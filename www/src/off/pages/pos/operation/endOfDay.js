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
          this.paymentData = new datatable

    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();
    }
    init()
    {
      this.dtDocDate.value = moment(new Date()).format("YYYY-MM-DD")
    }
    async finishButtonClick()
    {
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
      console.log(tmpQuery.value)
      let tmpData = await this.core.sql.execute(tmpQuery) 
      console.log(tmpData)
      if(tmpData.result.recordset.length > 0)
      {
        this.paymentData.clear()
        for (let i = 0; i < tmpData.result.recordset.length; i++) 
        {
          this.paymentData.push(tmpData.result.recordset[i])
        }
      }
      if(parseFloat(this.paymentData.where({'PAY_TYPE':0}).sum('AMOUNT')) ==  parseFloat(this.txtCash.value - this.txtAdvance.value))
      {
        this.Cash = 'Doğru'
        this.setState({Cash:'Doğru'})
      }
      else
      {
        let tmpCash
        tmpCash = (parseFloat(parseFloat(this.txtCash.value) + parseFloat(this.txtAdvance.value)) - parseFloat(this.paymentData.where({'PAY_TYPE':0}).sum('AMOUNT')))
        console.log(tmpCash)
        this.Cash = tmpCash.toFixed(2)
        this.setState({Cash:tmpCash})
      }

      if(parseFloat(this.paymentData.where({'PAY_TYPE':1}).sum('AMOUNT')) ==  this.txtCreditCard.value)
      {
        this.DebitCard = 'Doğru'
        this.setState({DebitCard:'Doğru'})
      }
      else 
      {
        let tmpDebit
        tmpDebit = (this.txtCreditCard.value - parseFloat(this.paymentData.where({'PAY_TYPE':1}).sum('AMOUNT')))
        this.DebitCard = tmpDebit.toFixed(2)
        this.setState({DebitCard:tmpDebit})
      }
      if(parseFloat(this.paymentData.where({'PAY_TYPE':2}).sum('AMOUNT')) ==  this.txtCheck.value)
      {
        this.Check = 'Doğru'
        this.setState({Check:'Doğru'})
      }
      else 
      {
        let tmpCheck
        tmpCheck = (this.txtCheck.value - parseFloat(this.paymentData.where({'PAY_TYPE':2}).sum('AMOUNT')))
        this.Check = tmpCheck.toFixed(2)
        this.setState({Check:tmpCheck})
      }

      if(parseFloat(this.paymentData.where({'PAY_TYPE':3}).sum('AMOUNT')) ==  this.txtRestorant.value)
      {
        this.TicketRest = 'Doğru'
        this.setState({TicketRest:'Doğru'})
      }
      else 
      {
        let tmpTikcet
        tmpTikcet = (this.txtRestorant.value - parseFloat(this.paymentData.where({'PAY_TYPE':3}).sum('AMOUNT')))
        this.TicketRest = tmpTikcet.toFixed(2)
        this.setState({TicketRest:tmpTikcet})
      }
      this.popFinish.show()
     
    }
    stepStart()
    {
      return (
        <Form colCount={2}>
          <Item>
              <Label text={this.t("dtDocDate")} alignment="right" />
              <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
              onValueChanged={(async()=>
                  {
              }).bind(this)}
              >
              </NdDatePicker>
          </Item>
          <Item>
                <Label text={this.t("cmbSafe")} alignment="right" />
                <NdSelectBox simple={true} parent={this} id="cmbSafe" notRefresh = {true}
                displayExpr="CODE"                       
                valueExpr="CODE"
                showClearButton={true}
                value=""
                data={{source:{select:{query : "SELECT CODE FROM POS_DEVICE ORDER BY CODE"},sql:this.core.sql}}}
                param={this.param.filter({ELEMENT:'cmbSafe',USERS:this.user.CODE})}
                access={this.access.filter({ELEMENT:'cmbSafe',USERS:this.user.CODE})}
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
              <NdNumberBox id="txtAdvance" parent={this} simple={true}
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
              <NdNumberBox id="txtCash" parent={this} simple={true} 
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
              <NdNumberBox id="txtCreditCard" parent={this} simple={true}  
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
              <NdNumberBox id="txtRestorant" parent={this} simple={true}  
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
                              <div className='col-6'>
                                <h2>{this.Cash}</h2>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-6'>
                                <h2>{this.t("debitCard")}</h2>
                              </div>
                              <div className='col-6'>
                                <h2>{this.DebitCard}</h2>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-6'>
                                <h2>{this.t("check")}</h2>
                              </div>
                              <div className='col-6'>
                                <h2>{this.Check}</h2>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-6'>
                                <h2>{this.t("ticketRest")}</h2>
                              </div>
                              <div className='col-6'>
                                <h2>{this.TicketRest}</h2>
                              </div>
                            </div>
                          </div>
                        </NdPopUp>
                    </div> 
            </div>
        )
    }
}