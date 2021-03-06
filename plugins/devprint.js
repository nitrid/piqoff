import {spawn} from 'child_process'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {core} from 'gensrv'

//"{TYPE:'REVIEW',PATH:'C:\\\\Users\\\\A.K.K\\\\Desktop\\\\DevPrint\\\\test.repx',DATA:[{KODU:'001'}]}"
class devprint
{
    constructor()
    {
        this.core = core.instance;
        this.__dirname = dirname(fileURLToPath(import.meta.url));
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)
    }
    connEvt(pSocket)
    {
        pSocket.on('devprint',async (pParam,pCallback) =>
        {
            pCallback(await this.print(pParam))
        })
    }
    print(pData)
    {
        return new Promise(resolve =>
        {
            let tmpData = ""
            let terminal = spawn(this.__dirname + "/devprint/lib/DevPrint")
            terminal.stdin.write(pData + "\n");

            terminal.stdout.on('data', function (data) 
            {
                tmpData += data.toString();         
            }); 

            terminal.stdout.on('end',function()
            {
                resolve(tmpData)
            })
        })
    }
}

export const _devprint = new devprint()