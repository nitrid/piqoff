import moment from 'moment';
import React from 'react';
import App from '../app.js';
import NdPopGrid from '../../../core/react/devex/popgrid.js';
import { Column } from '../../../core/react/devex/grid.js';
import { datatable } from '../../../core/core.js';

export default class customer
{
    constructor(props)
    {
        this.core = App.instance.core;
        this.page = props.page;
        this.doc = props.doc;
    }
    async getCustomerData(pGuid)
    {
        return new Promise(async resolve =>
        {
            let tmpDt = new datatable()
            tmpDt.selectCmd = 
            {
                query : `SELECT 
                        GUID,
                        CODE,
                        TITLE,
                        NAME,
                        LAST_NAME,
                        TYPE_NAME,
                        GENUS_NAME,
                        EXPIRY_DAY,
                        TAX_NO,
                        PRICE_LIST_NO,
                        VAT_ZERO,
                        ISNULL((SELECT TOP 1 ZIPCODE FROM CUSTOMER_ADRESS_VW_01 WHERE ADRESS_NO = 0),'') AS ZIPCODE, 
                        ISNULL((SELECT dbo.FN_CUSTOMER_BALANCE(GUID,GETDATE())),0) AS BALANCE
                        FROM CUSTOMER_VW_01 WHERE GUID = @GUID`,
                param : ['GUID:string|50'],
                value : [pGuid]
            }
            await tmpDt.refresh()
    
            if(tmpDt.length > 0)
            {
                resolve(tmpDt[0])
                return
            }
            resolve(null)
        })
    }
    async popCustomerShow(pVal)
    {
        return new Promise(async resolve =>
        {
            if(pVal != null && typeof pVal != "undefined" && pVal != '')
            {
                this.popCustomer.setVal(pVal)
            }
            else
            {
                this.popCustomer.show()
            }

            this.popCustomer.onClick = async(pData) =>
            {
                if(pData.length > 0)
                {
                    let tmpData = await this.getCustomerData(pData[0].GUID)

                    if(tmpData != null)
                    {
                        let tmpAdress = await this.popCustomerAdressShow(tmpData.GUID)

                        if(tmpAdress != null)
                        {
                            tmpData.ADDRESS = tmpAdress.ADDRESS
                            tmpData.ZIPCODE = typeof tmpAdress.ZIPCODE == 'undefined' ? tmpData.ZIPCODE : tmpAdress.ZIPCODE

                            resolve(tmpData)
                            return
                        }
                    }
                }
                else
                {
                    resolve(null)
                }
            }
            this.popCustomer.onHiding = async() =>
            {
                resolve(null)
            }
        })
    }
    async popCustomerAdressShow(pGuid)
    {
        return new Promise(async resolve =>
        {
            let tmpData = {}
            let tmpQuery = 
            {
                query : `SELECT * FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER = @CUSTOMER`,
                param : ['CUSTOMER:string|50'],
                value : [ pGuid]
            }

            let tmpAdressData = await this.core.sql.execute(tmpQuery) 
            
            if(tmpAdressData.result.recordset.length > 1)
            {
                this.popCustomerAdress.onClick = async(pData) =>
                {
                    if(pData.length > 0)
                    {
                        tmpData.ADDRESS = pData[0].ADRESS_NO
                        tmpData.ZIPCODE = pData[0].ZIPCODE
                        resolve(tmpData)
                    }
                    else
                    {
                        resolve(null)
                    }
                }
                await this.popCustomerAdress.show()
                await this.popCustomerAdress.setData(tmpAdressData.result.recordset)
            }
            else
            {
                tmpData.ADDRESS = 0
                resolve(tmpData)
            }
        })
    }
    async setDocCustomer(pData)
    {
        if(this.doc.detail.dt().length > 0 && this.doc.detail.dt()[0].ITEM != '00000000-0000-0000-0000-000000000000')
        {
            this.doc.docToast.show({message:this.page.t("msgCustomerLock.msg"),type:"warning"})
            return;
        }

        this.doc.docObj.dt()[0].INPUT = pData.GUID
        this.doc.docObj.docCustomer.dt()[0].INPUT = pData.GUID
        this.doc.docObj.dt()[0].INPUT_CODE = pData.CODE
        this.doc.docObj.dt()[0].INPUT_NAME = pData.TITLE
        this.doc.docObj.dt()[0].ZIPCODE = pData.ZIPCODE
        this.doc.docObj.dt()[0].TAX_NO = pData.TAX_NO
        this.doc.docObj.dt()[0].PRICE_LIST_NO = pData.PRICE_LIST_NO
        this.doc.docObj.dt()[0].VAT_ZERO = pData.VAT_ZERO
        
        // Müşteriye ait açık da sipariş ya da irsaliye varsa uyarısı versin parametresi ************************************* */
        if(this.page?.prmObj?.filter({ID:'dispatchOrderWarning',USERS:this.page.user.CODE})?.getValue()?.value)
        {
            let tmpDispatchDt = new datatable()

            tmpDispatchDt.selectCmd = 
            {
                query : `SELECT 
                        ISNULL((SELECT TOP 1 1 FROM DOC_ITEMS_VW_01 WHERE INPUT = @CUSTOMER AND 
                        INVOICE_DOC_GUID = '00000000-0000-0000-0000-000000000000' AND 
                        TYPE = 1 AND ITEM_CODE <> 'INTERFEL' AND REBATE = 0 AND DOC_TYPE IN(40)),0) AS DISPATCHS,
                        ISNULL((SELECT TOP 1 1 FROM DOC_ORDERS_VW_01 WHERE INPUT = @CUSTOMER AND 
                        SHIPMENT_LINE_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 1 AND DOC_TYPE IN (60)),0) AS ORDERS`,
                param : ['CUSTOMER:string|50'],
                value : [ pData.GUID]
            }

            await tmpDispatchDt.refresh()
            
            if(tmpDispatchDt.length > 0)
            {
                if(tmpDispatchDt[0].DISPATCHS == 1)
                {
                    await this.doc.docToast.show({message:this.page.t("dispatchWarning"),type:"warning"})
                }
                if(tmpDispatchDt[0].ORDERS == 1)
                {
                    setTimeout(() => { this.doc.docToast.show({message:this.page.t("orderWarning"),type:"warning"}) }, 3000);
                }
            }
        }
        //******************************************************************************************************************** */
        // Ref değeri müşteri kodu ile aynı olsun parametresi **************************************************************** */
        let tmpData = this.page?.sysParam?.filter({ID:'refForCustomerCode',USERS:this.page.user.CODE})?.getValue()
        if(typeof tmpData != 'undefined' && tmpData?.value ==  true)
        {
            this.doc.docObj.dt()[0].REF = pData.CODE
            this.doc.docObj.docCustomer.dt()[0].REF = pData.CODE
        }
        //******************************************************************************************************************** */
        // Evrak üzerinde vade tarihi var ise müşteri den gelen vade günü set ediliyor. ************************************** */
        if(typeof this.page.dtExpDate != 'undefined')
        {
            this.page.dtExpDate.value = moment(new Date()).add(pData.EXPIRY_DAY, 'days')
            this.page.dtExpDate.day = pData.EXPIRY_DAY
        }
        //******************************************************************************************************************** */
        // Vade tipi müşteri den gelen vade gününe göre set ediliyor. ******************************************************** */
        if(typeof this.page.cmbExpiryType != 'undefined')
        {
            this.page.cmbExpiryType.value = pData.EXPIRY_DAY != 0 ? 0 : 1
        }
        //******************************************************************************************************************** */
    }
    async autoCompleteCustomer(pData)
    {
        if(pData != null && typeof pData != "undefined" && typeof pData.GUID != "undefined" && pData.GUID != "")
        {
            let tmpData = await this.getCustomerData(pData.GUID)
            
            if(tmpData != null)
            {
                let tmpAdress = await this.popCustomerAdressShow(tmpData.GUID)
            
                if(tmpAdress != null)
                {
                    tmpData.ADDRESS = tmpAdress.ADDRESS
                    tmpData.ZIPCODE = typeof tmpAdress.ZIPCODE == 'undefined' ? tmpData.ZIPCODE : tmpAdress.ZIPCODE
                }
                this.setDocCustomer(tmpData)
            }
        }
        else
        {
            let tmpVal = undefined

            if(pData != null && typeof pData != "undefined" && typeof pData.NAME != "undefined")
            {
                tmpVal = pData.NAME
            }
            else if(pData != null && typeof pData != "undefined" && typeof pData.CODE != "undefined")
            {
                tmpVal = pData.CODE
            }
            
            let tmpData = await this.popCustomerShow(tmpVal)

            if(tmpData != null)
            {
                this.setDocCustomer(tmpData)
            }
        }
    }
    render()
    {
        return(
            <React.Fragment>
                {/* Cari Seçim PopUp */}
                <div>
                    <NdPopGrid id={"popCustomer"} parent={this} container={'#' + this.page.props.data.id + this.tabIndex}
                    lang={this.page.lang}
                    visible={false}
                    position={{of:'#' + this.page.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.page.lang.t("popCustomer.title")} //
                    search={true}
                    deferRendering={true}
                    selection={{mode:'single'}}
                    showCloseButton={true}
                    data={{source:
                    {
                        select:
                        {
                            query : `SELECT GUID,CODE,TITLE,TYPE_NAME,GENUS_NAME FROM CUSTOMER_VW_01 
                                    WHERE STATUS = 1 AND ((UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL))) `,
                            param : ['VAL:string|50']
                        },
                        sql:this.core.sql
                    }}}
                    >
                        <Column dataField="CODE" caption={this.page.lang.t("popCustomer.clmCode")} width={150} />
                        <Column dataField="TITLE" caption={this.page.lang.t("popCustomer.clmTitle")} width={500} defaultSortOrder="asc" />
                        <Column dataField="TYPE_NAME" caption={this.page.lang.t("popCustomer.clmTypeName")} width={150} />
                        <Column dataField="GENUS_NAME" caption={this.page.lang.t("popCustomer.clmGenusName")} width={150} />
                    </NdPopGrid>
                </div>
                {/* Adres Seçim PopUp */}
                <div>
                    <NdPopGrid id={"popCustomerAdress"} showCloseButton={false} parent={this} 
                    lang={this.page.lang}
                    container={"#" + this.page.props.data.id + this.tabIndex}
                    visible={false}
                    position={{of:'#' + this.page.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.page.lang.t("popCustomerAdress.title")} //
                    deferRendering={true}
                    >
                        <Column dataField="ADRESS" caption={this.page.lang.t("popCustomerAdress.clmAdress")} width={250} />
                        <Column dataField="CITY" caption={this.page.lang.t("popCustomerAdress.clmCiyt")} width={150} />
                        <Column dataField="ZIPCODE" caption={this.page.lang.t("popCustomerAdress.clmZipcode")} width={300} defaultSortOrder="asc" />
                        <Column dataField="COUNTRY" caption={this.page.lang.t("popCustomerAdress.clmCountry")} width={200}/>
                    </NdPopGrid>
                </div>
            </React.Fragment>
        )
    }
}