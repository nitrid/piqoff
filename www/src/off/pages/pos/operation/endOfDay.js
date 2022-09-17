import React from 'react';
import App from '../../../lib/app.js';
import ReactWizard from 'react-bootstrap-wizard';
import { Container, Row, Col } from "reactstrap";
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import { docCls} from "../../../../core/cls/doc.js"


import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class endOfDay extends React.PureComponent
{
    constructor()
    {
        super()
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls()
        this.message = ''

        this.finishButtonClick = this.finishButtonClick.bind(this)
        ReactWizard.defaultProps = {
          validate: true,
          previousButtonText: this.t("previous"),
          finishButtonText: this.t("finish"),
          nextButtonText: this.t("next"),
          color: "primary",
          progressbar: false
        };    
        
        this.steps = [
            {
              stepName: this.t("start"),
              stepIcon: "tim-icons icon-single-02",
              component: this.stepStart(),
              
            },
            {
              stepName: this.t("advance"),
              stepIcon: "tim-icons icon-settings-gear-63",
              component: this.stepAdvance(),
            },
            {
              stepName: this.t("cash"),
              stepIcon: "tim-icons icon-delivery-fast",
              component: this.stepCash()
            }, 
            {
              stepName: this.t("debitCard"),
              stepIcon: "tim-icons icon-settings-gear-63",
              component: this.stepCreditCard()
            },
            {
              stepName: this.t("check"),
              stepIcon: "tim-icons icon-settings-gear-63",
              component: this.stepCheck()
            },
            {
              stepName: this.t("ticketRest"),
              stepIcon: "tim-icons icon-settings-gear-63",
              component: this.stepRestorant()
            },
          ];


          this.Cash = '';
          this.DebitCard = '';
          this.Check = '';
          this.TicketRest =  ''
          this.color =
          {
            cash :"green",
            card :"green",
            check :"green",
            rest :"green",
          }
          this.paymentData = new datatable

    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();

    }
    async init()
    {
      this.dtDocDate.value = moment(new Date()).format("YYYY-MM-DD")
      let tmpSource =
      {
          source : 
          {
              groupBy : this.groupList,
              select : 
              {
                  query : "SELECT *,CONVERT(NVARCHAR,DOC_DATE,104) AS DATE,SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,25) AS TICKET_ID FROM POS_VW_01 WHERE STATUS = 0 ORDER BY DOC_DATE"
              },
              sql : this.core.sql
          }
      }
      await this.grdOpenTike.dataRefresh(tmpSource)
      if(this.grdOpenTike.data.datatable.length > 0)
      {
        this.popOpenTike.show()
      }
      // let tmpQuery = 
      // {
      //     query : "SELECT   " +
      //     param : [],
      //     value : [this.dtDocDate.value,this.cmbSafe.value]
      // }

      await this.grdAdvance.dataRefresh({source:this.docObj.docCustomer.dt('DOC_CUSTOMER')});
      
    }
    async finishButtonClick()
    {
      this.message = this.txtAdvance.value.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
      let tmpQuery = 
      {
          query : "SELECT   " +
                  "MAX(DOC_DATE) AS DOC_DATE,PAY_TYPE AS PAY_TYPE,TYPE AS TYPE,  " +
                  "PAY_TYPE_NAME AS PAY_TYPE_NAME,   " +
                  "CASE WHEN TYPE = 0 THEN SUM(AMOUNT - CHANGE) ELSE SUM(AMOUNT) * -1 END AS AMOUNT   " +
                  "FROM POS_PAYMENT_VW_01 WHERE DOC_DATE = @DOC_DATE AND DEVICE = @DEVICE AND STATUS = 1   " +
                  "GROUP BY PAY_TYPE_NAME,PAY_TYPE,TYPE " ,
          param : ['DOC_DATE:date','DEVICE:string|50'],
          value : [this.dtDocDate.value,this.cmbSafe.value]
      }
      let tmpData = await this.core.sql.execute(tmpQuery) 
      if(tmpData.result.recordset.length > 0)
      {
        this.paymentData.clear()
        for (let i = 0; i < tmpData.result.recordset.length; i++) 
        {
          this.paymentData.push(tmpData.result.recordset[i])
        }
      }
      if(parseFloat(this.paymentData.where({'PAY_TYPE':0}).sum('AMOUNT').toFixed(2)) ==  parseFloat((this.txtCash.value - this.txtAdvance.value).toFixed(2)))
      {
        this.color.cash = "green"
        this.Cash = this.t("txtReal")
        this.setState({Cash:this.t("txtReal")})
      }
      else
      {
        let tmpCash
        tmpCash = (parseFloat((parseFloat(this.txtCash.value) - parseFloat(this.txtAdvance.value).toFixed(2))) - parseFloat((this.paymentData.where({'PAY_TYPE':0}).sum('AMOUNT').toFixed(2))))
        let tmpCashValue
        if(tmpCash > 0)
        {
          this.color.cash = "blue"
          tmpCashValue = '+' + tmpCash.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        else
        {
          this.color.cash = "red"
          tmpCashValue = tmpCash.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        this.Cash = tmpCashValue
        this.setState({Cash:tmpCashValue})
      }

      if((this.paymentData.where({'PAY_TYPE':1}).sum('AMOUNT')).toFixed(2) ==  (this.txtCreditCard.value).toFixed(2))
      {
        this.color.card = "green"
        this.DebitCard = this.t("txtReal")
        this.setState({DebitCard:this.t("txtReal")})
      }
      else 
      {
        let tmpDebit
        tmpDebit = (this.txtCreditCard.value - parseFloat(this.paymentData.where({'PAY_TYPE':1}).sum('AMOUNT'))).toFixed(2)
        let tmpDebitValue
        if(tmpDebit > 0)
        {
          this.color.card = "blue"
          tmpDebitValue = '+' + tmpDebit.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        else
        {
          this.color.card = "red"
          tmpDebitValue = tmpDebit.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        this.DebitCard = tmpDebitValue
        this.setState({DebitCard:tmpDebitValue})
      }
      if(parseFloat((this.paymentData.where({'PAY_TYPE':2}).sum('AMOUNT')).toFixed(2)) ==  this.txtCheck.value)
      {
        this.color.check = "green"
        this.Check = this.t("txtReal")
        this.setState({Check:this.t("txtReal")})
      }
      else 
      {
        let tmpCheck
        tmpCheck = parseFloat((this.txtCheck.value - parseFloat(this.paymentData.where({'PAY_TYPE':2}).sum('AMOUNT'))).toFixed(2))
        let tmpCheckValue
        if(tmpCheck > 0)
        {
          this.color.check = "blue"
          tmpCheckValue = '+' + tmpCheck.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        else
        {
          this.color.check = "red"
          tmpCheckValue = tmpCheck.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        this.Check = tmpCheckValue
        this.setState({Check:tmpCheckValue})
      }

      if(parseFloat(this.paymentData.where({'PAY_TYPE':3}).sum('AMOUNT')) ==  this.txtRestorant.value)
      {
        this.color.rest = "green"
        this.TicketRest = this.t("txtReal")
        this.setState({TicketRest:this.t("txtReal")})
      }
      else 
      {
        let tmpTikcet
        tmpTikcet = parseFloat((this.txtRestorant.value - parseFloat(this.paymentData.where({'PAY_TYPE':3}).sum('AMOUNT'))).toFixed(2))
        let tmpTicketValue
        if(tmpTikcet > 0)
        {
          this.color.rest = "blue"
          tmpTicketValue = '+' + tmpTikcet.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        else
        {
          this.color.rest = "red"
          tmpTicketValue = tmpTikcet.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        this.TicketRest = tmpTicketValue
        this.setState({TicketRest:tmpTikcet})
      }
      
      this.popFinish.show()
    }
    stepStart()
    {
      return (
        <Form colCount={2}>
           <Item>
            <NdButton text={this.t("addAdvance")}
             onClick={async ()=>
              {       
                this.dtAdvanceDate.value = moment(new Date()).add(1,'days').format("YYYY-MM-DD")
                this.docObj.load({DOC_DATE:this.dtAdvanceDate.value,DOC_TYPE:201})
                this.popAdvance.show()
              }}
            />
          </Item>
          <EmptyItem/>
          <Item>
              <Label text={this.t("dtDocDate")} alignment="right" />
              <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
               onValueChanged={(async(e)=>
                {
                  if(this.cmbSafe.value != '')
                  {
                    let tmpQuery = 
                    {
                      query : "SELECT (SUM(AMOUNT) - ISNULL((SELECT SUM(AMOUNT) FROM DOC_CUSTOMER_VW_01 AS DOCOUT WHERE DOCOUT.OUTPUT = DOCIN.INPUT AND TYPE = 2 AND DOC_TYPE = 201 AND PAY_TYPE = 20),0)) AS AMOUNT FROM DOC_CUSTOMER_VW_01 AS DOCIN " + 
                      "WHERE INPUT_CODE = @INPUT_CODE AND DOC_DATE = @DOC_DATE AND TYPE = 2 AND DOC_TYPE = 201 AND PAY_TYPE = 20 GROUP BY INPUT", 
                        param : ['INPUT_CODE:string|50','DOC_DATE:date'],
                        value : [this.cmbSafe.value,this.dtDocDate.value]
                    }
                    let tmpData = await this.core.sql.execute(tmpQuery) 
                    if(tmpData.result.recordset.length > 0)
                    {
                      this.txtAdvance.value =tmpData.result.recordset[0].AMOUNT 
                    }
                  }
                  
                }).bind(this)}
              >
              </NdDatePicker>
          </Item>
          <Item>
                <Label text={this.t("cmbSafe")} alignment="right" />
                <NdSelectBox simple={true} parent={this} id="cmbSafe" notRefresh = {true}
                displayExpr="NAME"                       
                valueExpr="CODE"
                showClearButton={true}
                value=""
                data={{source:{select:{query : "SELECT NAME,CODE,GUID FROM [dbo].[SAFE_VW_01] WHERE TYPE = 2"},sql:this.core.sql}}}
                param={this.param.filter({ELEMENT:'cmbSafe',USERS:this.user.CODE})}
                access={this.access.filter({ELEMENT:'cmbSafe',USERS:this.user.CODE})}
                onValueChanged={(async(e)=>
                  {
                    let tmpQuery = 
                    {
                        query : "SELECT (SUM(AMOUNT) - ISNULL((SELECT SUM(AMOUNT) FROM DOC_CUSTOMER_VW_01 AS DOCOUT WHERE DOCOUT.OUTPUT = DOCIN.INPUT AND TYPE = 2 AND DOC_TYPE = 201 AND PAY_TYPE = 20),0)) AS AMOUNT FROM DOC_CUSTOMER_VW_01 AS DOCIN " + 
                        "WHERE INPUT_CODE = @INPUT_CODE AND DOC_DATE = @DOC_DATE AND TYPE = 2 AND DOC_TYPE = 201 AND PAY_TYPE = 20 GROUP BY INPUT", 
                        param : ['INPUT_CODE:string|50','DOC_DATE:date'],
                        value : [this.cmbSafe.value,this.dtDocDate.value]
                    }
                    let tmpData = await this.core.sql.execute(tmpQuery) 
                    if(tmpData.result.recordset.length > 0)
                    {
                      this.txtAdvance.value =tmpData.result.recordset[0].AMOUNT 
                    }
                  }).bind(this)}
                >
                </NdSelectBox>
          </Item>
        </Form>
      )
    }
    stepAdvance()
    {
      return (
        <Form colCount={2}>
          <EmptyItem/>
          <Item>
              <Label text={this.t("txtAdvance")} alignment="right" />
              <NdNumberBox id="txtAdvance" parent={this} simple={true} readOnly={true} 
              param={this.param.filter({ELEMENT:'txtAdvance',USERS:this.user.CODE})}
              access={this.access.filter({ELEMENT:'txtAdvance',USERS:this.user.CODE})}
              >
              </NdNumberBox>
          </Item>
        </Form>
      )
      
    }
    stepCash()
    {
      return (
        <Form colCount={2}>
          <EmptyItem/>
          <Item>
              <Label text={this.t("txtCash")} alignment="right" />
              <NdNumberBox id="txtCash" parent={this} simple={true} value=''
              param={this.param.filter({ELEMENT:'txtCash',USERS:this.user.CODE})}
              access={this.access.filter({ELEMENT:'txtCash',USERS:this.user.CODE})}
              >
              </NdNumberBox>
          </Item>
        </Form>
      )
    }
    stepCreditCard()
    {
      return (
        <Form colCount={2}>
          <EmptyItem/>
          <Item>
              <Label text={this.t("txtCreditCard")} alignment="right" />
              <NdNumberBox id="txtCreditCard" parent={this} simple={true}  value=''
              param={this.param.filter({ELEMENT:'txtCreditCard',USERS:this.user.CODE})}
              access={this.access.filter({ELEMENT:'txtCreditCard',USERS:this.user.CODE})}
              >
              </NdNumberBox>
          </Item>
        </Form>      
      )
    }
    stepCheck()
    {
      return (
        <Form colCount={2}>
          <EmptyItem/>
          <Item>
              <Label text={this.t("txtCheck")} alignment="right" />
              <NdNumberBox id="txtCheck" parent={this} simple={true} 
              param={this.param.filter({ELEMENT:'txtCheck',USERS:this.user.CODE})}
              access={this.access.filter({ELEMENT:'txtCheck',USERS:this.user.CODE})}
              >
              </NdNumberBox>
          </Item>
        </Form>      
      )
    }
    stepRestorant()
    {
      return (
        <Form colCount={2}>
          <EmptyItem/>
          <Item>
              <Label text={this.t("txtRestorant")} alignment="right" />
              <NdNumberBox id="txtRestorant" parent={this} simple={true}  value=''
              param={this.param.filter({ELEMENT:'txtRestorant',USERS:this.user.CODE})}
              access={this.access.filter({ELEMENT:'txtRestorant',USERS:this.user.CODE})}
              >
              </NdNumberBox>
          </Item>
        </Form>      
      )
    }
    render()
    {
        return(
            <div>
                <div className='panel'>
                    <div className={"panel-body container-fluid"}>
                        <div className={'row'}>
                            <div className={'col-12'}>
                            <ReactWizard color={"green"} steps={this.steps} progressbar={true}  title={this.t("title")} finishButtonClick={this.finishButtonClick}>
                            </ReactWizard>
                            </div>
                        </div>
                    </div>
                </div>
                  {/* Finish PopUp */}
                  <div>
                        <NdPopUp parent={this} id={"popFinish"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popFinish.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'600'}
                        position={{of:'#root'}}
                        >
                          <div className='col-12'>
                            <div className='row'>
                              <div className='col-6'>
                                <h2>{this.t("cash")}</h2>
                              </div>
                              <div className='col-6' style={{color:this.color.cash}}>
                                <h2> : {this.Cash}</h2>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-6'>
                                <h2>{this.t("debitCard")}</h2>
                              </div>
                              <div className='col-6' style={{color:this.color.card}}>
                                <h2> : {this.DebitCard}</h2>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-6'>
                                <h2>{this.t("check")}</h2>
                              </div>
                              <div className='col-6' style={{color:this.color.check}}>
                                <h2> : {this.Check}</h2>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-6'>
                                <h2>{this.t("ticketRest")}</h2>
                              </div>
                              <div className='col-6' style={{color:this.color.rest}}>
                                <h2> : {this.TicketRest}</h2>
                              </div>
                            </div>
                             <div className='row px-4'>
                              <div className='col-12'>
                                <h2>{this.t("advanceMsg1")}</h2>
                              </div>
                            </div>
                            <div className='row px-4'>
                              <div className='col-4 offset-4'>
                                <h2>{this.message}</h2>
                              </div>
                            </div>
                            <div className='row px-4'>
                              <div className='col-12'>
                                <h2>{this.t("advanceMsg2")}</h2>
                              </div>
                            </div>
                          </div>
                        </NdPopUp>
                  </div> 
                    {/* Açık Fişler PopUp */}
                    <div>
                      <NdPopUp parent={this} id={"popOpenTike"} 
                      visible={false}
                      showCloseButton={true}
                      showTitle={true}
                      title={this.t("popOpenTike.title")}
                      container={"#root"} 
                      width={'700'}
                      height={'500'}
                      position={{of:'#root'}}
                      >
                          <Form colCount={1} height={'fit-content'}>
                              <Item>
                               <NdGrid parent={this} id={"grdOpenTike"} 
                                      showBorders={true} 
                                      columnsAutoWidth={true} 
                                      allowColumnReordering={true} 
                                      allowColumnResizing={true} 
                                      headerFilter={{visible:true}}
                                      height={350} 
                                      width={'100%'}
                                      dbApply={false}
                                      onRowRemoved={async (e)=>{
                                      }}
                                      >
                                          <Scrolling mode="virtual" />
                                          <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                          <Column dataField="CUSER_NAME" caption={this.t("grdOpenTike.clmUser")} width={120}  headerFilter={{visible:true}}/>
                                          <Column dataField="DEVICE" caption={this.t("grdOpenTike.clmDevice")} width={100}  headerFilter={{visible:true}}/>
                                          <Column dataField="DATE" caption={this.t("grdOpenTike.clmDate")} width={150} allowEditing={false} />
                                          <Column dataField="TICKET_ID" caption={this.t("grdOpenTike.clmTicketId")} width={150}  headerFilter={{visible:true}}/>
                                  </NdGrid>
                             </Item>
                          </Form>
                      </NdPopUp>
                    </div>  
                      {/* Avans PopUp */}
                      <div>
                      <NdPopUp parent={this} id={"popAdvance"} 
                      visible={false}
                      showCloseButton={true}
                      showTitle={true}
                      title={this.t("popAdvance.title")}
                      container={"#root"} 
                      width={'700'}
                      height={'600'}
                      position={{of:'#root'}}
                      >
                          <Form colCount={1} height={'fit-content'}>
                            <Item>
                              <Label text={this.t("dtAdvanceDate")} alignment="right" />
                              <NdDatePicker simple={true}  parent={this} id={"dtAdvanceDate"}
                              onValueChanged={(async()=>
                              {
                                this.docObj.load({DOC_DATE:this.dtAdvanceDate.value,DOC_TYPE:201})
                              }).bind(this)}
                              >
                              </NdDatePicker>
                            </Item>
                            <Item>
                                  <Label text={this.t("cmbPopSafe")} alignment="right" />
                                  <NdSelectBox simple={true} parent={this} id="cmbPopSafe" notRefresh = {true}
                                  displayExpr="NAME"                       
                                  valueExpr="GUID"
                                  value=""
                                  searchEnabled={true}
                                  
                                  data={{source:{select:{query : "SELECT NAME,CODE,GUID FROM [dbo].[SAFE_VW_01] WHERE TYPE = 2"},sql:this.core.sql}}}
                                  >
                                  </NdSelectBox>
                              </Item>
                              <Item>
                                <Label text={this.t("txtPopAdvance")} alignment="right" />
                                <NdNumberBox id="txtPopAdvance" parent={this} simple={true} value=''
                                >
                                </NdNumberBox>
                              </Item>
                              <Item>
                              <div className='row'>
                                        <div className='col-6'>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnPopAdd")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={async ()=>
                                            {
                                              if(this.cmbPopSafe.value != '')
                                              {
                                                if(this.docObj.dt().length == 0)
                                                {
                                                  this.docObj.addEmpty()
                                                  this.docObj.dt()[0].TYPE = 2
                                                  this.docObj.dt()[0].DOC_TYPE = 201
                                                  this.docObj.dt()[0].REF = 'POS'
                                                  this.docObj.dt()[0].REF_NO = Math.floor(Date.now() / 1000)
                                                  this.docObj.dt()[0].DOC_DATE = this.dtAdvanceDate.value
                                                  this.docObj.dt()[0].INPUT = this.cmbPopSafe.value
                                                  this.docObj.dt()[0].OUTPUT = this.prmObj.filter({ID:'SafeCenter',TYPE:0}).getValue()
                                                  this.docObj.dt()[0].AMOUNT = this.txtPopAdvance.value
                                                  this.docObj.dt()[0].TOTAL = this.txtPopAdvance.value
                                                }
                                                if(this.docObj.docCustomer.dt().where({INPUT:this.cmbPopSafe.value}).length > 0)
                                                {
                                                  let tmpConfObj =
                                                  {
                                                      id:'msgDoubleAdvence',showTitle:true,title:this.t("msgDoubleAdvence.title"),showCloseButton:true,width:'500px',height:'200px',
                                                      button:[{id:"btn01",caption:this.t("msgDoubleAdvence.btn01"),location:'after'}],
                                                      content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDoubleAdvence.msg")}</div>)
                                                  }
                                                  
                                                  await dialog(tmpConfObj);
                                                  return
                                                }
                                                this.docObj.docCustomer.addEmpty()
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].TYPE = 2
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_GUID = this.docObj.dt()[0].GUID
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_TYPE = 201
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_DATE = this.dtAdvanceDate.value
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF = 'POS'
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF_NO = this.docObj.dt()[0].REF_NO
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT = this.cmbPopSafe.value
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT_NAME =  this.cmbPopSafe.displayValue
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].OUTPUT = this.docObj.dt()[0].OUTPUT
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].PAY_TYPE = 20
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].AMOUNT = this.txtPopAdvance.value
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DESCRIPTION = ''
                                                
                                                await this.docObj.save()
                                              }
                                            }}/>
                                        </div>
                                    </div>
                              </Item>
                              <Item>
                               <NdGrid parent={this} id={"grdAdvance"} 
                                      showBorders={true} 
                                      columnsAutoWidth={true} 
                                      allowColumnReordering={true} 
                                      allowColumnResizing={true} 
                                      headerFilter={{visible:true}}
                                      height={250} 
                                      width={'100%'}
                                      dbApply={false}
                                      onRowRemoved={async (e)=>{
                                        await this.docObj.save()
                                      }}
                                      onRowUpdated={async (e)=>{
                                        await this.docObj.save()
                                      }}
                                      >
                                          <Scrolling mode="virtual" />
                                          <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                          <Column dataField="CUSER_NAME" caption={this.t("grdAdvance.clmUser")} width={120}  headerFilter={{visible:true}} allowEditing={false} />
                                          <Column dataField="DOC_DATE" caption={this.t("grdAdvance.clmDate")} width={120} dataType={'date'} allowEditing={false}  headerFilter={{visible:true}}/>
                                          <Column dataField="INPUT_NAME" caption={this.t("grdAdvance.clmInput")} width={120}  allowEditing={false}  headerFilter={{visible:true}}/>
                                          <Column dataField="AMOUNT" caption={this.t("grdAdvance.clmAmount")} width={100} />
                                  </NdGrid>
                             </Item>
                             <Item>
                              <div className='row'>
                                        <div className='col-6'>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnPopOk")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                              this.popAdvance.hide()
                                            }}/>
                                        </div>
                                    </div>
                              </Item>
                          </Form>
                      </NdPopUp>
                    </div>  
            </div>
        )
    }
}