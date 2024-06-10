import {spawn} from 'child_process'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {core} from 'gensrv'
import os from 'os'
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
            let terminal = undefined
            
            if(os.platform() == 'linux')
            {
                terminal = spawn("dotnet",[this.__dirname + "/devprint/lib/DevPrint.dll"])    
            }
            else
            {
                terminal = spawn(this.__dirname + "/devprint/lib/DevPrint")
            }

            try 
            {
                let jsonObj = JSON.parse(pData);
                jsonObj.PATH = this.__dirname + "/devprint/repx/" + jsonObj.PATH
                pData = JSON.stringify(jsonObj)
            } catch (error) 
            {
                console.error("JSON parse hatası:", error.message);
            }

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