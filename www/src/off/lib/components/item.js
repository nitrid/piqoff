import React from 'react';
import App from '../app.js';

export default class item
{
    constructor(props)
    {
        this.core = App.instance.core;
        this.page = props.page;
        this.doc = props.doc;
    }
    /**
     * Ürünün fiyatını getir. Fiyatı getirirken müşteriye ait kontrat varsa önce buna bakar.
     * Tek bir ürün için fiyat getirmek için kullanılır.
     * @param {*} pItem  Ürünün guid'i
     * @param {*} pQty Kaç adet için fiyat isteniyor. null ise 1 adet için fiyat istenir.
     * @param {*} pCustomer Hangi müşteriye ait fiyat isteniyor. null ise tüm müşteriler için fiyat istenir.
     * @param {*} pDepot Hangi depoya ait fiyat isteniyor. null ise tüm depolara ait fiyat istenir.
     * @param {*} pListNo Hangi fiyat listesine ait fiyat isteniyor. null ise 1. nolu (genel) fiyat istenir.
     * @param {*} pType Hangi tipte fiyat isteniyor. (0: Satış Fiyatı, 1: Alış Fiyatı).
     * @param {*} pAddVat Fiyat vergi dahil mi? (0: Hayır, 1: Evet).
     * @returns Fiyat
     */
    async getPrice(pItem,pQty,pCustomer,pDepot,pListNo,pType,pAddVat)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : `SELECT dbo.FN_PRICE(@GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER,@DEPOT,@PRICE_LIST_NO,@TYPE,@ADD_VAT) AS PRICE`,
                param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50','DEPOT:string|50','PRICE_LIST_NO:int','TYPE:int','ADD_VAT:bit'],
                value : [pItem,pQty,pCustomer,pDepot,pListNo,pType,pAddVat]
            }
            
            let tmpData = await this.core.sql.execute(tmpQuery) 
     
            if(tmpData.result.recordset.length > 0)
            {
                resolve(tmpData.result.recordset[0].PRICE)
                return
            }

            resolve()
        })
    }
    async getDepotQty(pItem,pDepot)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : `SELECT 
                        dbo.FN_DEPOT_QUANTITY(@ITEM,@DEPOT,dbo.GETDATE()) AS DEPOT_QTY,
                        dbo.FN_ORDER_PEND_QTY(@ITEM,1,@DEPOT) AS RESERV_OUTPUT_QTY,
                        dbo.FN_ORDER_PEND_QTY(@ITEM,0,@DEPOT) AS RESERV_INPUT_QTY`,
                param : ['ITEM:string|50','DEPOT:string|50'],
                value : [pItem,pDepot]
            }
            
            let tmpData = await this.core.sql.execute(tmpQuery) 
            
            if(tmpData.result.recordset.length > 0)
            {
                resolve(tmpData.result.recordset[0])
                return
            }

            resolve()
        })
    }
    render()
    {
        return(
            <div>
                <h1>NdItemOp</h1>
            </div>
        )
    }
}