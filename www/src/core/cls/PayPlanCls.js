import { core,dataset,datatable } from "../core.js";
import moment from 'moment';
import React from "react";
import ReactDOM from 'react-dom';
import NdPopUp from "../react/devex/popup.js";
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,Summary,TotalItem} from '../react/devex/grid.js';
import NdButton from "../react/devex/button.js";
import NbDateRange from '../react/bootstrap/daterange.js';
import NdCheckBox from '../react/devex/checkbox.js';


export class payPlanCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CDATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSER : this.core.auth.data.CODE,
            LDATE : moment(new Date()).format("YYYY-MM-DD"),
            LUSER : this.core.auth.data.CODE,
            DOC_GUID : '00000000-0000-0000-0000-000000000000',
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            REF : '',
            REF_NO : 0,
            FAC_GUID : '00000000-0000-0000-0000-000000000000',
            INSTALLMENT_NO : 0,
            INSTALLMENT_DATE : moment(new Date()).format("YYYY-MM-DD"),
            AMOUNT : 0,
            TOTAL : 0,
            STATUS : 0,
            DELETED : 0
        }   
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('DOC_INSTALLMENT');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM DOC_INSTALLMENT_VW_01 WHERE ((DOC_GUID = @DOC_GUID) OR (@DOC_GUID = '00000000-0000-0000-0000-000000000000')) AND ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
            param : ['DOC_GUID:string|50','REF:string|50','REF_NO:int']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_INSTALLMENT_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " +
                    "@DOC_DATE = @PDOC_DATE, " +
                    "@CUSTOMER_GUID = @PCUSTOMER_GUID, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@FAC_GUID = @PFAC_GUID, " +
                    "@INSTALLMENT_NO = @PINSTALLMENT_NO, " +
                    "@INSTALLMENT_DATE = @PINSTALLMENT_DATE, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@STATUS = @PSTATUS, " +
                    "@DELETED = @PDELETED ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PDOC_DATE:date','PCUSTOMER_GUID:string|50','PREF:string|50','PREF_NO:int','PFAC_GUID:string|50','PINSTALLMENT_NO:int','PINSTALLMENT_DATE:date','PAMOUNT:float','PTOTAL:float','PSTATUS:int','PDELETED:int'],
            dataprm : ['GUID','CUSER','DOC_GUID','DOC_DATE','CUSTOMER_GUID','REF','REF_NO','FAC_GUID','INSTALLMENT_NO','INSTALLMENT_DATE','AMOUNT','TOTAL','STATUS','DELETED']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_INSTALLMENT_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " +    
                    "@DOC_DATE = @PDOC_DATE, " +
                    "@CUSTOMER_GUID = @PCUSTOMER_GUID, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@FAC_GUID = @PFAC_GUID, " +
                    "@INSTALLMENT_NO = @PINSTALLMENT_NO, " +
                    "@INSTALLMENT_DATE = @PINSTALLMENT_DATE, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@STATUS = @PSTATUS, " +
                    "@DELETED = @PDELETED ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PDOC_DATE:date','PCUSTOMER_GUID:string|50','PREF:string|50','PREF_NO:int','PFAC_GUID:string|50','PINSTALLMENT_NO:int','PINSTALLMENT_DATE:date','PAMOUNT:float','PTOTAL:float','PSTATUS:int','PDELETED:int'],
            dataprm : ['GUID','CUSER','DOC_GUID','DOC_DATE','CUSTOMER_GUID','REF','REF_NO','FAC_GUID','INSTALLMENT_NO','INSTALLMENT_DATE','AMOUNT','TOTAL','STATUS','DELETED']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_INSTALLMENT_DELETE] " +
                    "@CUSER = @PCUSER, " +
                    "@FAC_GUID = @PFAC_GUID, " +
                    "@UPDATE = 1 " ,
            param : ['PCUSER:string|25','PFAC_GUID:string|50'],
            dataprm : ['CUSER','FAC_GUID']
        }   

        this.ds.add(tmpDt);
        }
    //#endregion
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0]);
        }

        return this.ds.get(0);
    }
    addEmpty()
    {
        if(typeof this.dt('DOC_INSTALLMENT') == 'undefined')
        {
            return;
        }
        let tmp = {};
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}
        }
        else        
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('DOC_INSTALLMENT').push(tmp);
    }
    clearAll()
    {
        for(let i = 0; i < this.ds.length; i++)
        {
            this.dt(i).clear();
        }
    }
    load()
    {
        return new Promise(async resolve => 
        {
            let tmpPrm = {DOC_GUID:'00000000-0000-0000-0000-000000000000',REF:'',REF_NO:0}
            if(arguments.length > 0)
            {
                tmpPrm.DOC_GUID = typeof arguments[0].DOC_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].DOC_GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? 0 : arguments[0].REF_NO;
            }
            this.ds.get('DOC_INSTALLMENT').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DOC_INSTALLMENT').refresh();
            resolve(this.ds.get('DOC_INSTALLMENT'));
        });
    }   
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete();
            resolve(await this.ds.update());
        });
    }
   
    
}
export class payPlanMatchingCls 
{
    constructor()
    {
        this.core = core.instance;
        this.ds =  new dataset()
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            TYPE : 0,
            DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER : '00000000-0000-0000-0000-000000000000',
            PAID_DOC : '00000000-0000-0000-0000-000000000000',
            PAYING_DOC : '00000000-0000-0000-0000-000000000000',
            PAYING_DAY : 0,
            PAID_AMOUNT : 0,
            PAYING_AMOUNT : 0
        }
        this.lang = undefined;
        this.type = 0; //0 = ÖDEME, 1 = TAHSİLAT
        this.popUpList = new datatable()
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('DEPT_CREDIT_MATCHING');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM DEPT_CREDIT_MATCHING WHERE PAID_DOC = @PAID_DOC OR PAYING_DOC = @PAYING_DOC",
            param : ['PAID_DOC:string|50','PAYING_DOC:string|50']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DEPT_CREDIT_MATCHING_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@TYPE = @PTYPE, " +
                    "@DATE = @PDATE, " +
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@PAID_DOC = @PPAID_DOC, " +
                    "@PAYING_DOC = @PPAYING_DOC, " +
                    "@PAYING_DAY = @PPAYING_DAY, " +
                    "@PAID_AMOUNT = @PPAID_AMOUNT, " +
                    "@PAYING_AMOUNT = @PPAYING_AMOUNT ",
            param : ['PGUID:string|50','PTYPE:int','PDATE:date','PCUSTOMER:string|50','PPAID_DOC:string|50','PPAYING_DOC:string|50','PPAYING_DAY:int','PPAID_AMOUNT:float','PPAYING_AMOUNT:float'],
            dataprm : ['GUID','TYPE','DATE','CUSTOMER','PAID_DOC','PAYING_DOC','PAYING_DAY','PAID_AMOUNT','PAYING_AMOUNT']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DEPT_CREDIT_MATCHING_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@TYPE = @PTYPE, " +
                    "@DATE = @PDATE, " +
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@PAID_DOC = @PPAID_DOC, " +
                    "@PAYING_DOC = @PPAYING_DOC, " +
                    "@PAYING_DAY = @PPAYING_DAY, " +
                    "@PAID_AMOUNT = @PPAID_AMOUNT, " +
                    "@PAYING_AMOUNT = @PPAYING_AMOUNT ",
            param : ['PGUID:string|50','PTYPE:int','PPAID_DOC:string|50','PPAYING_DOC:string|50','PPAYING_DAY:int','PPAID_AMOUNT:float','PPAYING_AMOUNT:float'],
            dataprm : ['GUID','TYPE','DATE','CUSTOMER','PAID_DOC','PAYING_DOC','PAYING_DAY','PAID_AMOUNT','PAYING_AMOUNT']
        }
        tmpDt.deleteCmd = 
        {
            query : "[dbo].[PRD_DEPT_CREDIT_MATCHING_DELETE] " + 
                    "@GUID = @PGUID, " + 
                    "@PAID_DOC = @PPAID_DOC, " + 
                    "@PAYING_DOC = @PPAYING_DOC ",
            param : ['PGUID:string|50','PPAID_DOC:string|50','PPAYING_DOC:string|50'],
            dataprm : ['GUID','PAID_DOC','PAYING_DOC']
        }
        this.ds.add(tmpDt);
    }
    //#region
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0])
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('DEPT_CREDIT_MATCHING') == 'undefined')
        {
            return;
        }
        let tmp = {};
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4()
        this.dt('DEPT_CREDIT_MATCHING').push(tmp)
    }
    clearAll()
    {
        for(let i = 0; i < this.ds.length; i++)
        {
            this.dt(i).clear()
        }
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
    async showPopUp(pCustomer)
    {
        this.popUpList = new datatable()
        let tmpJsx = 
        (
            <div>
                <NdPopUp parent={this} id={"popDeptCreditList"} 
                visible={false}
                showCloseButton={true}
                showTitle={true}
                title={this.lang.t("popDeptCreditList.title")}
                container={"#root"} 
                width={'90%'}
                height={'90%'}
                position={{of:'#root'}}
                >
                    <div className="row p-2">
                        <div className="col-10">
                            <NbDateRange id={"dtPopDeptCreditListDate"} parent={this} startDate={moment().add(-15, 'days')} endDate={moment().add(15, 'days')}
                            onApply={()=>
                            {
                                gridRefresh()
                            }}/>
                        </div>
                        <div className="col-2">
                            <NdCheckBox id="chkPopDeptCreditList" parent={this} text={this.lang.t("popDeptCreditList.chkPopDeptCreditList")} value={false}
                            onValueChanged={(e)=>
                            {
                                gridRefresh()
                            }}
                            ></NdCheckBox>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-12">
                            <NdButton parent={this} id={"btnPopDeptCreditListSelection"} text={this.lang.t('popDeptCreditList.btnPopDeptCreditListSelection')} width={'100%'} type={"default"}
                            onClick={()=>
                            {
                                if(this.grdPopDeptCreditList.getSelectedData().length > 0)
                                {
                                    this.popDeptCreditList.hide()
                                    this.popDeptCreditList.onClick(this.grdPopDeptCreditList.getSelectedData())
                                }
                            }}
                            />
                        </div>
                    </div>
                    <div className="row p-2" style={{height:"85%"}}>
                        <div className="col-12">
                            <NdGrid parent={this} id={"grdPopDeptCreditList"} 
                            height={'100%'} 
                            width={'100%'}
                            showBorders={true}
                            selection={{mode:"single"}}
                            onSelectionChanged={(e)=>
                            {
                                e.component.refresh(true);
                            }}
                            >
                                <Column dataField="DOC_DATE" caption={this.lang.t("popDeptCreditList.clmDate")} width={100} dataType={"date"} defaultSortOrder="asc"/>                                
                                <Column dataField="REF" caption={this.lang.t("popDeptCreditList.clmRef")} width={80}/>
                                <Column dataField="REF_NO" caption={this.lang.t("popDeptCreditList.clmRefNo")} width={100}/>
                                <Column dataField="CUSTOMER_NAME" caption={this.lang.t("popDeptCreditList.clmCustomer")} width={300}/>
                                <Column dataField="DATE" caption={this.lang.t("popDeptCreditList.clmInstallmentDate")} width={100} dataType={"date"}/>
                                <Column dataField="PAY_PLAN" caption={this.lang.t("popDeptCreditList.clmInstallmentNo")} width={100}/>
                                <Column dataField="AMOUNT" caption={this.lang.t("popDeptCreditList.clmAmount")} width={100} format={{ style: "currency", currency:Number.money.code,precision: 3}}/>
                                <Column dataField="REMAINDER" caption={this.lang.t("popDeptCreditList.clmBalance")} width={100} format={{ style: "currency", currency:Number.money.code,precision: 3}}/>
                                <Column dataField="TOTAL" caption={this.lang.t("popDeptCreditList.clmTotal")} width={100} format={{ style: "currency", currency:Number.money.code,precision: 3}}/>

                                <Summary calculateCustomSummary={(options) =>
                                {
                                    if (options.name === 'SelectedRowsSummary') 
                                    {
                                        if (options.summaryProcess === 'start') 
                                        {
                                            options.totalValue = 0;
                                        } 
                                        else if (options.summaryProcess === 'calculate') 
                                        {
                                            if (options.component.isRowSelected(options.value)) 
                                            {
                                                options.totalValue += Number(options.value.REMAINDER).round(2);
                                            }
                                        }
                                    }
                                }}>
                                    <TotalItem name="SelectedRowsSummary" summaryType="custom" valueFormat={{ style: "currency", currency:Number.money.code,precision: 3}} displayFormat="Sum: {0}" showInColumn="REMAINDER" />
                                </Summary>
                            </NdGrid>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        )

        if(typeof this.popDeptCreditList == 'undefined')
        {
            ReactDOM.render(tmpJsx,document.body.appendChild(document.createElement('div',{id:'popDeptCreditMatching'})));
        }

        let gridRefresh = async()=>
        {
            let tmpQuery = 
            {
                query : "SELECT DOC_DATE,DOC_GUID,REF,REF_NO,MIN(INSTALLMENT_DATE) AS DATE,TOTAL,MIN(INSTALLMENT_NO) AS PAY_PLAN,MIN(AMOUNT)AS AMOUNT,REMAINDER,CUSTOMER_NAME,CUSTOMER_CODE " + 
                        "FROM DOC_INSTALLMENT_VW_02 WHERE CUSTOMER_GUID = @CUSTOMER_GUID AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE " + 
                        "AND STATUS = 0 " +
                        "GROUP BY DOC_GUID,FAC_GUID,REF,REF_NO,TOTAL,CUSTOMER_NAME,CUSTOMER_CODE,DOC_DATE,REMAINDER",
                param : ['CUSTOMER_GUID:string|50','FIRST_DATE:date','LAST_DATE:date'],
                value : [pCustomer,this.dtPopDeptCreditListDate.startDate,this.dtPopDeptCreditListDate.endDate]
            }
            
            if(this.chkPopDeptCreditList.value == false)
            {
                tmpQuery.query = tmpQuery.query.replace('AND STATUS = 0 ','AND STATUS = 0 ')
            }
            else
            {
                tmpQuery.query = tmpQuery.query.replace('AND STATUS = 0 ','')
            }

            let tmpData = await this.core.sql.execute(tmpQuery) 

            if(tmpData.result.recordset.length > 0)
            {
                await this.grdPopDeptCreditList.dataRefresh({source:tmpData.result.recordset})
            }
            else
            {
                await this.grdPopDeptCreditList.dataRefresh({source:[]})
            }
        }
        
        gridRefresh()

        return new Promise(async resolve =>
        {
            this.popDeptCreditList.show()
            this.popDeptCreditList.onClick = async(data) =>
            {
                console.log(data)
                let tmpQuery = 
                {
                    query : "SELECT * FROM DOC_INSTALLMENT_VW_02 WHERE DOC_GUID = @DOC_GUID AND INSTALLMENT_NO = @INSTALLMENT_NO",
                    param : ['DOC_GUID:string|50','INSTALLMENT_NO:int'],
                    value : [data[0].DOC_GUID,data[0].PAY_PLAN]
                }   
                let tmpData = await this.core.sql.execute(tmpQuery)
                
                let tmpInvDt = new datatable()
                tmpInvDt.import(tmpData.result.recordset)
                this.popUpList = tmpInvDt
                resolve(tmpInvDt)
            }
        })
    }
    matching(pData)
    {
        return new Promise(async resolve =>
        {
            let tmpPaidDt = pData.where({FAC_TYPE : 1}).orderBy('LDATE',"asc")
            let tmpPayingDt = pData.where({TYPE : 0}).orderBy('LDATE',"asc")
            console.log(tmpPaidDt)
            console.log(tmpPayingDt)
            
            for (let i = 0; i < tmpPaidDt.length; i++) 
            {
                console.log(tmpPaidDt[i])
                for (let x = 0; x < tmpPayingDt.length; x++) 
                {
                    if(tmpPaidDt[i].REMAINDER != 0 && tmpPayingDt[x].REMAINDER != 0)
                    {
                        let tmpPaying = Number((Number(tmpPaidDt[i].REMAINDER).round(2) + Number(tmpPayingDt[x].REMAINDER).round(2)) >= 0 ? tmpPayingDt[x].REMAINDER * -1 : tmpPaidDt[i].REMAINDER).round(2)                    

                        let tmpDeptCredit = {...this.empty}
                        tmpDeptCredit.TYPE = tmpPaidDt[i].FAC_TYPE
                        tmpDeptCredit.DATE = tmpPaidDt[i].DOC_DATE
                        tmpDeptCredit.CUSTOMER = tmpPaidDt[i].CUSTOMER_GUID
                        tmpDeptCredit.PAID_DOC = tmpPaidDt[i].FAC_GUID
                        tmpDeptCredit.PAYING_DOC = tmpPayingDt[x].DOC
                        tmpDeptCredit.PAYING_DAY = 0
                        tmpDeptCredit.PAID_AMOUNT = Number(tmpPaidDt[i].REMAINDER).round(2)
                        tmpDeptCredit.PAYING_AMOUNT = tmpPaying
                        tmpDeptCredit.PAY_PLAN_GUID = tmpPaidDt[i].GUID
                        this.addEmpty(tmpDeptCredit)

                        tmpDeptCredit = {...this.empty}
                        tmpDeptCredit.TYPE = tmpPayingDt[x].TYPE
                        tmpDeptCredit.DATE = tmpPayingDt[x].DOC_DATE
                        tmpDeptCredit.CUSTOMER = tmpPayingDt[x].CUSTOMER_GUID
                        tmpDeptCredit.PAID_DOC = tmpPayingDt[x].DOC
                        tmpDeptCredit.PAYING_DOC = tmpPaidDt[i].FAC_GUID
                        tmpDeptCredit.PAYING_DAY = 0
                        tmpDeptCredit.PAID_AMOUNT = Number(tmpPayingDt[x].REMAINDER * -1).round(2)
                        tmpDeptCredit.PAYING_AMOUNT = tmpPaying
                        this.addEmpty(tmpDeptCredit)

                        tmpPaidDt[i].REMAINDER = Number(tmpPaidDt[i].REMAINDER - tmpPaying).round(2)
                        tmpPayingDt[x].REMAINDER = Number(tmpPayingDt[x].REMAINDER + tmpPaying).round(2)
                        // tmpPaidDt[i].PAYING_AMOUNT = Number(tmpPaidDt[i].PAYING_AMOUNT + tmpPaying).round(2)
                        // tmpPayingDt[x].PAYING_AMOUNT = Number(tmpPayingDt[x].PAYING_AMOUNT + tmpPaying).round(2)
          
                    }
                }
            }
            resolve()
        })
    }
}