import {core} from 'gensrv'
import cron from 'node-cron';

class piqpoidApi
{
    constructor()
    {
        this.core = core.instance;
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)
    }
    connEvt(pSocket)
    {
        cron.schedule('0 3 * * *', async () => 
        {
            pSocket.emit('piqPoid',{tag:"Refresh"}) 
        })

        pSocket.on('piqPoid',async(pParam,pCallback) =>
        {
            if(pParam.tag == 'getParam')
            {
                let tmpQuery = 
                {
                    query : "SELECT * FROM BALANCE_DEVICES WHERE MACID = @MACID",
                    param : ['MACID:string|50'],
                    value : [pParam.macId]
                }

                let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
                pCallback(tmpResult)
            }
        })
    }
}

export const _piqpoidApi = new piqpoidApi()