import {core} from 'gensrv'
import fetch from 'node-fetch';
import config from '../config.js';

class piqXApi
{
    constructor()
    {
        this.core = core.instance;
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)
        
        this.active = true
        this.username = 'Admin'
        this.password = '1'
        this.token = ''
        this.endpoint = 'http://piqx.azurewebsites.net/'

        if(config?.plugins?.piqXApi?.active)
        {
            this.active = config?.plugins?.piqXApi?.active
            this.endpoint = typeof config.plugins.piqXApi.endpoint == 'undefined' ? this.endpoint : config?.plugins?.piqXApi?.endpoint
            this.username = typeof config.plugins.piqXApi.username == 'undefined' ? this.username : config?.plugins?.piqXApi?.username
            this.password = typeof config.plugins.piqXApi.password == 'undefined' ? this.password : config?.plugins?.piqXApi?.password
        }
    }
    async connEvt(pSocket)
    {
        if(this.active == true)
        {
            await this.login(this.username,this.password)
            
            pSocket.on('piqXInvoiceList',async (pParam,pCallback) =>
            {
                let tmpResult = await this.getInvoiceList(pParam)
                
                console.log(tmpResult)
                if(typeof tmpResult.err != 'undefined' && (tmpResult.err == 403 || tmpResult.err == 404))
                {
                    await this.login(this.username,this.password)
                    tmpResult = await this.getInvoiceList(pParam)
                }
                if(typeof pCallback != 'undefined')
                {
                    pCallback(tmpResult)
                }
            })
            pSocket.on('piqXInvoice',async (pParam,pCallback) =>
            {
                let tmpResult = await this.getInvoice(pParam.invoiceId)
                
                if(typeof tmpResult.err != 'undefined' && (tmpResult.err == 403 || tmpResult.err == 404))
                {
                    await this.login(this.username,this.password)
                    tmpResult = await this.getInvoice(pParam.invoiceId)
                }
                if(typeof pCallback != 'undefined')
                {
                    pCallback(tmpResult)
                }
            })
            pSocket.on('piqXInvoiceInsert',async (pParam,pCallback) =>
            {
                let tmpResult = await this.setInvoice(pParam)
                
                if(typeof tmpResult.err != 'undefined' && (tmpResult.err == 403 || tmpResult.err == 404))
                {
                    await this.login(this.username,this.password)
                    tmpResult = await this.setInvoice(pParam)
                }
                if(typeof pCallback != 'undefined')
                {
                    pCallback(tmpResult)
                }
            })
            pSocket.on('piqXInvoiceSetStatus',async (pParam,pCallback) =>
            {
                let tmpResult = await this.setInvoiceStatus(pParam)

                if(typeof tmpResult.err != 'undefined' && (tmpResult.err == 403 || tmpResult.err == 404))
                {
                    await this.login(this.username,this.password)
                    tmpResult = await this.setInvoiceStatus(pParam)
                }
                if(typeof pCallback != 'undefined')
                {
                    pCallback(tmpResult)
                }
            })
        }
    }
    async login(username, password) 
    {
        try 
        {
            const base64Credentials = btoa(username + ':' + password);
            const response = await fetch(this.endpoint + '/api/login', 
            {
                method: 'POST',
                headers: 
                {
                    'Authorization': `Basic ${base64Credentials}`,
                    'Content-Type': 'application/json'
                }
            });
        
            if (!response.ok) 
            {
                this.token = ''
                return this.token
            }

            const data = await response.json();
            this.token = data.token;
        }
        catch (error) 
        {
            
        }
        return this.token
    }
    async getInvoiceList(pData) 
    {
        try 
        {
            let url = this.endpoint + `/api/invoiceList?taxId=${encodeURIComponent(pData.taxId)}`;

            if (pData.first && pData.last) 
            {
                url += `&first=${encodeURIComponent(pData.first)}&last=${encodeURIComponent(pData.last)}`;
            }

            const response = await fetch(url, 
            {
                method: 'GET',
                headers: 
                {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) 
            {
                return {err : response.status}
            }
    
            const data = await response.json();
            return data;
        } 
        catch (error) 
        {
            return {err : error}
        }
    }
    async getInvoice(invoiceId) 
    {
        try 
        {
            const response = await fetch(this.endpoint + `/api/invoice?invoiceId=${encodeURIComponent(invoiceId)}`, 
            {
                method: 'GET',
                headers: 
                {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) 
            {
                return {err : response.status}
            }
    
            const data = await response.json();
            return data;
        } 
        catch (error) 
        {
            return {err : error}
        }
    }
    async setInvoice(pData) 
    {
        try 
        {
            const response = await fetch(this.endpoint + `/api/invoiceInsert`, 
            {
                method: 'POST',
                headers: 
                {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                {
                    fromuser: pData.fromUser || '',
                    touser: pData.toUser || '',
                    docguid: pData.docGuid || '',
                    docdate: pData.docDate || '',
                    fromtax: pData.fromTax || '',
                    totax: pData.toTax || '',
                    json: pData.json || '',
                    pdf: pData.pdf || ''
                })
            });

            if (!response.ok) 
            {
                return {err : response.status}
            }

            const data = await response.json();
            return data;
        } 
        catch (error) 
        {
            return {err : error}
        }
    }
    async setInvoiceStatus(pData)
    {
        try 
        {
            const response = await fetch(this.endpoint + `/api/invoiceUpdate`, 
            {
                method: 'POST',
                headers: 
                {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                {
                    invoiceId: pData.invoiceId || '',
                    user: pData.user || '',
                    status: pData.status || 0,
                })
            });

            if (!response.ok) 
            {
                return {err : response.status}
            }

            const data = await response.json();
            return data;
        } 
        catch (error) 
        {
            return {err : error}
        }
    }
}
export const _piqXApi = new piqXApi()