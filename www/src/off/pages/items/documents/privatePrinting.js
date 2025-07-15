import React from 'react';
import App from '../../../lib/app.js';
import { priLabelObj, labelMainCls } from '../../../../core/cls/label.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{ Item } from 'devextreme-react/toolbar';

import NdTextBox, { Validator, RequiredRule, RangeRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Button,Editing,Paging,Scrolling,KeyboardNavigation,Pager} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class privatePrinting extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;

        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.prilabelCls = new priLabelObj();
        this.labelMainObj = new labelMainCls();
        this.btnGrdPrint = this.btnGrdPrint.bind(this)

        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.prilabelCls.clearAll()
        this.labelMainObj.clearAll()
        this.txtRef.value = ''
        this.txtItemName.value = ''
        this.txtPrice.value = 0
        this.txtQuantity.value = 1
        this.txtDescription.value = ''

        this.btnNew.setState({disabled:false});
        this.btnSave.setState({disabled:false});
        this.btnPrint.setState({disabled:true});

        this.prilabelCls.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:true});
                this.btnPrint.setState({disabled:true});
            }
        })
        this.prilabelCls.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnPrint.setState({disabled:true});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.prilabelCls.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnPrint.setState({disabled:true});          
        })

        this.txtBarkod.readOnly = false
        this.txtItemName.readOnly = false
        this.txtPrice.readOnly = false
        this.txtDescription.readOnly = false
        this.txtQuantity.readOnly = false
    }
    async btnGrdPrint(e)
    {
        let tmpQuery = 
        {
            query:  `SELECT *,
                    ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE PAGE = @PAGE),'') AS PATH 
                    FROM ITEM_LABEL_QUEUE_VW_01 WHERE GUID = @GUID`,
            param:  ['GUID:string|50','PAGE:string|25'],
            value:  [e.row.data.GUID,'02']
        }

        App.instance.setState({isExecute:true})
        let tmpData = await this.core.sql.execute(tmpQuery) 
        App.instance.setState({isExecute:false})
        
        this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' +  JSON.stringify(tmpData.result.recordset)+ '}',(pResult) => 
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

        let tmpUpdateQuery = 
        {
            query:  `UPDATE LABEL_QUEUE SET STATUS = 1 WHERE GUID = @GUID`,
            param:  ['GUID:string|50'],
            value:  [e.row.data.GUID]
        }

        await this.core.sql.execute(tmpUpdateQuery) 
        
        this.popUniqCodeList.hide()
        this.btnList.props.onClick()
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default" onClick={()=>{this.init()}}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmPriLabel" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            if(this.txtItemName.value.length > 49)
                                            {
                                                this.toast.show({message:this.t("msgItemName.msg"),type:"warning"})
                                                return
                                            }
                                            
                                            let tmpPrm = this.prmObj.filter({ID:'underMinCostPrice',USERS:this.user.CODE}).getValue()

                                            if(typeof tmpPrm != 'undefined'&& tmpPrm == true)
                                            {
                                                let tmpQuery = 
                                                {
                                                    query:  `SELECT CUSTOMER_PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = @ITEM_GUID ORDER BY LDATE DESC`,
                                                    param:  ['ITEM_GUID:string|50'],
                                                    value:  [this.txtRef.GUID]
                                                }
        
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                
                                                if(tmpData.result.recordset.length > 0)
                                                {
                                                    if(tmpData.result.recordset[0].CUSTOMER_PRICE >= parseFloat(this.txtPrice.value))
                                                    {
                                                        this.toast.show({message:this.t("msgPrice.msg"),type:"warning"})
                                                        return
                                                    }
                                                }
                                            }
                                            
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);

                                            if(pResult == 'btn01')
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : `SELECT ISNULL(REPLACE(STR(SUBSTRING(MAX(CODE),0,8) + 1, 7), SPACE(1), '0'),'2700001') AS CODE FROM ITEM_UNIQ`,
                                                }

                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                
                                                if(tmpData.result.recordset.length > 0)
                                                {   
                                                    let tmpDefCode = tmpData.result.recordset[0].CODE

                                                    for (let i = 0; i < this.txtQuantity.value; i++) 
                                                    {
                                                        tmpDefCode = tmpDefCode.toString()
                                                        let tmpCode = ''
                                                        let outPut = []
                                                        
                                                        for (let x = 0, len = tmpDefCode.length; x < len; x += 1) 
                                                        {
                                                            outPut.push(+tmpDefCode.charAt(x));
                                                        }
                                                
                                                        var tmpOnly = (outPut[0] + outPut[2] + outPut[4] + outPut[6]) * 3
                                                        var tmpCouple = outPut[1] + outPut[3] + outPut[5]
                                                        var tmpCount = tmpOnly + tmpCouple
                                                        let tmpResult = (10 - (tmpCount %= 10))

                                                        if(tmpResult == 10)
                                                        {
                                                            tmpResult = 0
                                                        }

                                                        tmpCode = tmpDefCode + tmpResult.toString();
                                                        let tmpEmpty = {...this.prilabelCls.empty};
                                                        tmpEmpty.CODE = tmpCode
                                                        tmpEmpty.ITEM = this.txtRef.GUID
                                                        tmpEmpty.NAME = this.txtItemName.value
                                                        tmpEmpty.PRICE = this.txtPrice.value
                                                        tmpEmpty.PRICE_RATE = this.txtPriceRate.value
                                                        tmpEmpty.DESCRIPTION = this.txtDescription.value
                                                        this.prilabelCls.addEmpty(tmpEmpty);  
                                                        tmpDefCode = Number(tmpDefCode) + 1
                                                    }
                                                }

                                                if((await this.prilabelCls.save()) == 0)
                                                {                  
                                                    let Data = {data:this.prilabelCls.dt().toArray()}                                  
                                                    let tmpLbl = {...this.labelMainObj.empty}
                                                    tmpLbl.REF = 'SPECIAL'
                                                    tmpLbl.DATA = JSON.stringify(Data)     
                                                    this.labelMainObj.addEmpty(tmpLbl);
                                                    this.labelMainObj.save()
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
                                                    this.btnPrint.setState({disabled:false});
                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
                                                    
                                                    this.txtBarkod.readOnly = true
                                                    this.txtItemName.readOnly = true
                                                    this.txtPrice.readOnly = true
                                                    this.txtDescription.readOnly = true
                                                    this.txtQuantity.readOnly = true
                                                }
                                                else
                                                {
                                                    let tmpConfObj1 =
                                                    {
                                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                        button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                        content: (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    }
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                        }                              
                                        else
                                        {
                                            this.toast.show({message:this.t("msgSaveValid.msg"),type:"warning"})
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default" onClick={async ()=>{this.popDesign.show()}}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnList" parent={this} icon="bulletlist" type="default"
                                    onClick={async()=>
                                    {
                                        let tmpSource =
                                        {
                                            source : 
                                            {
                                                groupBy : this.groupList,
                                                select : 
                                                {
                                                    query : `SELECT GUID,NAME,PRICE,DESCRIPTION,MAX(QUANTITY) AS QUANTITY 
                                                            FROM ITEM_LABEL_QUEUE_VW_01 WHERE REF = 'SPECIAL' AND 
                                                            (SELECT STATUS FROM LABEL_QUEUE WHERE LABEL_QUEUE.GUID = ITEM_LABEL_QUEUE_VW_01.GUID) = 0 
                                                            GROUP BY GUID,NAME,PRICE,DESCRIPTION`,
                                                },
                                                sql : this.core.sql
                                            }
                                        }

                                        App.instance.setState({isExecute:true})
                                        await this.grdUniqList.dataRefresh(tmpSource)
                                        App.instance.setState({isExecute:false})
                                        
                                        this.popUniqCodeList.show()
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
                        <div className="col-9">
                            <NdForm colCount={2} id={"frmPriLabel" + this.tabIndex}>
                                <NdItem>
                                    <NdLabel text={this.t("txtBarkod")} alignment="right" />
                                    <NdTextBox id="txtBarkod" parent={this} simple={true} tabIndex={this.tabIndex}
                                    onChange={(async()=>
                                    {
                                        let tmpBarData = new datatable()
                                        tmpBarData.selectCmd = 
                                        {
                                            query : `SELECT ITEM_GUID AS GUID,ITEM_CODE AS CODE,ITEM_NAME AS NAME,
                                                    [dbo].[FN_PRICE](ITEM_GUID,1,dbo.GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1) AS PRICE 
                                                    FROM [ITEM_BARCODE_VW_01] WHERE BARCODE = @BARCODE`,
                                            param : ['BARCODE:string|50'],
                                            value : [this.txtBarkod.value]
                                        }
                                        await tmpBarData.refresh()

                                        if(tmpBarData.length > 0)
                                        {
                                            this.txtRef.value = tmpBarData[0].CODE
                                            this.txtItemName.value = tmpBarData[0].NAME
                                            this.txtRef.GUID = tmpBarData[0].GUID
                                            this.txtPrice.value = tmpBarData[0].PRICE
                                            this.txtBarkod.value = ""                                            
                                        }
                                    }).bind(this)} 
                                    param={this.param.filter({ELEMENT:'txtBarkod',USERS:this.user.CODE})} 
                                    access={this.access.filter({ELEMENT:'txtBarkod',USERS:this.user.CODE})}     
                                    selectAll={true}                           
                                    />     
                                </NdItem>
                                <NdEmptyItem/>
                                {/* txtRef */}
                                <NdItem>                                    
                                    <NdLabel text={this.t("txtRef")} alignment="right" />
                                    <NdTextBox id="txtRef" parent={this} simple={true} tabIndex={this.tabIndex} readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button={
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                this.pg_txtRef.show()
                                                this.pg_txtRef.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.txtRef.value = data[0].CODE
                                                        this.txtItemName.value = data[0].NAME
                                                        this.txtRef.GUID = data[0].GUID
                                                        this.txtPrice.value = data[0].PRICE
                                                    }
                                                }
                                            }
                                        },
                                    ]}
                                    param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})} 
                                    access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}     
                                    selectAll={true}                           
                                    >     
                                        <Validator validationGroup={"frmPriLabel" + this.tabIndex}>
                                            <RequiredRule message={this.t("valCode")} />
                                        </Validator> 
                                    </NdTextBox>      
                                    {/* STOK SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtRef"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtRef.title")} 
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : `SELECT GUID,CODE,NAME,
                                                        [dbo].[FN_PRICE](GUID,1,dbo.GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1) AS PRICE 
                                                        FROM ITEMS_VW_04 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) AND STATUS = 1`,
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={500} defaultSortOrder="asc" />
                                        <Column dataField="PRICE" caption={this.t("pg_txtRef.clmPrice")} width={150} type={"text"}/>
                                    </NdPopGrid>
                                </NdItem>
                                {/* txtItemName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtItemName")} alignment="right" />
                                    <NdTextBox id="txtItemName" parent={this} simple={true}
                                    param={this.param.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    >
                                        <Validator validationGroup={"frmPriLabel" + this.tabIndex}>
                                            <RequiredRule message={this.t("valName")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtPrice */}
                                <NdItem>
                                    <NdLabel text={this.t("txtPrice")} alignment="right" />
                                    <div className='row'>
                                        <div className='col-4 pe-0'>
                                            <NdNumberBox id="txtPrice" parent={this} simple={true} dt={{data:this.prilabelCls.dt('ITEM_UNIQ'),field:"PRICE"}}
                                            param={this.param.filter({ELEMENT:'txtPrice',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtPrice',USERS:this.user.CODE})}
                                            >
                                                <Validator validationGroup={"frmPriLabel" + this.tabIndex}>
                                                    <RangeRule min={0.001} message={this.t("valPrice")} />
                                                </Validator> 
                                            </NdNumberBox>
                                        </div>
                                        <div className='col-8'>
                                            <div className='row'>
                                                <div className='col-6 p-0'>
                                                    <label className="col-form-label d-flex justify-content-end">{this.t("txtPriceRate") + " :"}</label>
                                                </div>
                                                <div className='col-6'>
                                                    <NdNumberBox id="txtPriceRate" parent={this} simple={true} dt={{data:this.prilabelCls.dt('ITEM_UNIQ'),field:"PRICE_RATE"}}
                                                    param={this.param.filter({ELEMENT:'txtPriceRate',USERS:this.user.CODE})}
                                                    access={this.access.filter({ELEMENT:'txtPriceRate',USERS:this.user.CODE})}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </NdItem>
                                {/* txtDescription */}
                                <NdItem>
                                    <NdLabel text={this.t("txtDescription")} alignment="right" />
                                    <NdTextBox id="txtDescription" parent={this} simple={true} dt={{data:this.prilabelCls.dt('ITEM_UNIQ'),field:"DESCRIPTION"}}
                                    param={this.param.filter({ELEMENT:'txtDescription',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtDescription',USERS:this.user.CODE})}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                {/* txtQuantity */}
                                <NdItem>
                                    <NdLabel text={this.t("txtQuantity")} alignment="right" />
                                    <NdTextBox id="txtQuantity" parent={this} simple={true}
                                    param={this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                            </NdForm>
                        </div>
                         {/* Unique Code PopUp */}
                        <div>
                            <NdPopUp parent={this} id={"popUniqCodeList"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popUniqCodeList.title")}
                            container={'#' + this.props.data.id + this.tabIndex} 
                            width={'800'}
                            height={'800'}
                            position={{of:'#' + this.props.data.id + this.tabIndex}}
                            >
                                <NdForm colCount={1} height={'fit-content'}>
                                    <NdItem>
                                        <NdGrid parent={this} id={"grdUniqList"} 
                                        filterRow={{visible:true}} 
                                        height={'700'} 
                                        width={'100%'}
                                        dbApply={false}
                                        loadPanel={{enabled:true}}
                                        >
                                            <Paging defaultPageSize={18} />
                                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="standart"/>
                                            <Editing mode="cell" allowUpdating={false} allowDeleting={false} confirmDelete={false}/>
                                            <Column dataField="NAME" caption={this.t("grdUniqList.clmName")} width={250} dataType={'number'} defaultSortOrder="desc"/>
                                            <Column dataField="PRICE" caption={this.t("grdUniqList.clmPrice")} width={70} allowEditing={false}/>
                                            <Column dataField="DESCRIPTION" caption={this.t("grdUniqList.clmDescription")} width={200} allowEditing={false}/>
                                            <Column dataField="QUANTITY" caption={this.t("grdUniqList.clmQuantity")} dataType={'number'} width={50}/>
                                            <Column type="buttons" width={70}>
                                                <Button hint="Clone" icon="print" onClick={this.btnGrdPrint} />
                                            </Column>
                                        </NdGrid>
                                    </NdItem>
                                </NdForm>
                            </NdPopUp>
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
                        height={'180'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        deferRendering={true}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popDesign.design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '02'"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPrintPop" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDesign")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                <NdItem>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmPrintPop" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                let tmpQuery = 
                                                {
                                                    query:  `SELECT *,
                                                            ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @TAG),'') AS PATH 
                                                            FROM ITEM_LABEL_QUEUE_VW_01 WHERE GUID = @GUID`,
                                                    param:  ['GUID:string|50','TAG:string|25'],
                                                    value:  [this.labelMainObj.dt()[0].GUID,this.cmbDesignList.value]
                                                }

                                                App.instance.setState({isExecute:true})
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                App.instance.setState({isExecute:false})
                                                
                                                this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' +  JSON.stringify(tmpData.result.recordset)+ '}',(pResult) => 
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

                                                this.popDesign.hide();  
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'} onClick={()=>{this.popDesign.hide()}}/>
                                        </div>
                                    </div>
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>  
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>                
            </div>
        )
    }
}