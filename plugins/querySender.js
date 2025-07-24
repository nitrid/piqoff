import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {core} from 'gensrv'
import cron from 'node-cron';
import fetch from 'node-fetch';
import config from '../config.js';
class querySender
{
    constructor()
    {
        this.core = core.instance;
        this.__dirname = dirname(fileURLToPath(import.meta.url));
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)
        this.active = false
        this.host = 'localhost:3333'

        if(config?.plugins?.querySender?.active)
        {
            this.active = config?.plugins?.querySender?.active
            this.host = typeof config.plugins.querySender.host == 'undefined' ? this.host : config?.plugins?.querySender?.host
        }
        
        this.processRun()
    }
    async connEvt(pSocket)
    {
        if(this.active == true)
        {
            pSocket.on('sql',async (pParam,pCallback) =>
            {
                if(typeof pParam.length != 'undefined')
                {
                    for (let i = 0; i < pParam.length; i++) 
                    {
                        if(pParam[i].query.indexOf('PRD_ITEM_PRICE_UPDATE') > -1)
                        { 
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                                fetch(`http://${this.host}/execute-query`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        query: pParam[i].query,
                                        params: pParam[i].rowData
                                    }),
                                }).catch(err => {
                                    console.error('Merkeze sorgu gönderme hatası:', err);
                                });
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEM_PRICE_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {

                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEMS_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEMS_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEM_UNIT_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                              
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEM_UNIT_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_INVOICE_PRICE_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_COLLECTIVE_ITEMS_EDIT') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEM_BARCODE_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEM_BARCODE_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_APPLICATION_INSERT') > -1)
                        {
                            console.log(pParam[i].rowData)
                            if(typeof pParam[i].rowData.PROMO != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_APPLICATION_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.PROMO != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_CONDITION_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.PROMO != 'undefined')
                            {
                               
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_CONDITION_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.PROMO != 'undefined')
                            {
                               
                            }
                        }
                    }
                }
            })

        }
    }
   
}

export const _querySender = new querySender()