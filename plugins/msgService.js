import {core} from 'gensrv'
class msgService
{
    constructor()
    {
        this.core = core.instance;
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)
    }
    connEvt(pSocket)
    {
        pSocket.on('msgService',(pParam,pCallback) =>
        {
            if(pParam.tag == 'msgPosDevice')
            {
                this.core.socket.emit('msgService',pParam)
            }
        })
    }
}

export const _msgService = new msgService()