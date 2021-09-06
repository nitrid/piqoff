export class datatable
{
    constructor(pName)
    {        
        this.selectCmd;
        this.insertCmd;
        this.updateCmd;
        this.deleteCmd;
        
        if(typeof pName != 'undefined')
        {
            this.name = pName;
        }
    }
    push(pItem,pIsNew)
    {     
        pItem = new Proxy(pItem, 
        {
            get: function(target, prop, receiver) 
            {
                return target[prop];
            },
            set: function(target, prop, receiver) 
            {
                Object.setPrototypeOf(target,{stat:'edit'})
                target[prop] = receiver
                return target[prop];
            }
        });
        
        if(typeof pIsNew == 'undefined' || pIsNew)
        {
            Object.setPrototypeOf(pItem,{stat:"new"})
        }
        
        super.push(pItem)
    }
    removeAt(pIndex)
    {
        this.splice(pIndex,1);
    }
    clear()
    {
        this.splice(0,this.length);
    }
    refresh()
    {
        return new Promise(async resolve => 
        {
            if(typeof this.selectCmd != 'undefined')
            {
                let TmpData = await core.instance.sql.execute(this.selectCmd)
                if(typeof TmpData.result.err == 'undefined')
                {
                    for (let i = 0; i < TmpData.result.recordset.length; i++) 
                    {                    
                        this.push(TmpData.result.recordset[i],false)   
                    }                    
                }
                else
                {
                    console.log(TmpData.result.err)
                }                
            }
            resolve();
        });
    }
    update()
    {
        return new Promise(async resolve => 
        {
            if(typeof this.updateCmd != 'undefined')
            {
                this.updateCmd.value = [];
            }
            if(typeof this.insertCmd != 'undefined')
            {
                this.insertCmd.value = [];
            }
            
            for (let i = 0; i < this.length; i++) 
            {
                if(typeof this[i].stat != 'undefined')
                {
                    if(this[i].stat == 'edit')
                    {
                        if(typeof this.updateCmd != 'undefined')
                        {
                            if(typeof this.updateCmd.param == 'undefined')
                            {
                                continue;
                            }
                            for (let m = 0; m < this.updateCmd.param.length; m++) 
                            {
                                this.updateCmd.value.push(this[i][this.updateCmd.param[m].split(':')[0]]);
                            }
                        }
                    }
                    else if(this[i].stat == 'new')
                    {
                        if(typeof this.insertCmd != 'undefined')
                        {
                            if(typeof this.insertCmd.param == 'undefined')
                            {
                                continue;
                            }

                            for (let m = 0; m < this.insertCmd.param.length; m++) 
                            {
                                this.insertCmd.value.push(this[i][this.insertCmd.param[m].split(':')[0]]);
                            }
                        }
                    }
                }
            }
            if(typeof this.updateCmd != 'undefined' && typeof this.updateCmd.value != 'undefined' && this.updateCmd.value.length > 0)
            {
                let TmpUpdateData = await core.instance.sql.execute(this.updateCmd)

                if(typeof TmpUpdateData.result.err == 'undefined')
                {
                    //this.updateCmd.value = [];
                }
                else
                {
                    console.log(TmpUpdateData.result.err)
                }   
            }
            
            if(typeof this.insertCmd != 'undefined' && typeof this.insertCmd.value != 'undefined' && this.insertCmd.value.length > 0)
            {
                let TmpInsertData = await core.instance.sql.execute(this.insertCmd)

                if(typeof TmpInsertData.result.err == 'undefined')
                {
                    this.insertCmd.value = [];
                }
                else
                {
                    console.log(TmpInsertData.result.err)
                }   
            }
               
            resolve();
        });
    }
}
export class dataset
{    
    constructor()
    {
        this.datatables = [];
    }
    add(pTable)
    {
        if(typeof pTable != 'undefined')
        {
            if(typeof pTable == 'string')
            {
                this.datatables.push(new datatable(pTable))    
            }
            else if(typeof pTable == 'object')
            {
                this.datatables.push(pTable)
            }
        }
    }
    datatable(pName)
    {
        if(typeof pName != 'undefined')
        {
            for (let i = 0; i < this.datatables.length; i++) 
            {
                if(this.datatables[i].name == pName)
                {
                    return this.datatables[i];
                }
            }
        }
    }
    remove(pName)
    {
        if(typeof pName != 'undefined')
        {
            for (let i = 0; i < this.datatables.length; i++) 
            {
                if(this.datatables[i].name == pName)
                {
                    this.splice(i,1);
                }
            }
        }
    }
    addTemplate(pObj)
    {
        for (let i = 0; i < pObj.length; i++) 
        {
            this.add(pObj[i].name);
            let TmpTbl = this.datatable(pObj[i].name);
            TmpTbl.selectCmd = pObj[i].selectCmd;
            TmpTbl.insertCmd = pObj[i].insertCmd;
            TmpTbl.updateCmd = pObj[i].updateCmd;
        }
    }
}
export default class core
{    
    static instance = null;
    
    constructor()
    {
        this.dataset = null;
        this.listeners = Object();
        this.socket = io(window.location.origin);
        this.sql = new sql();
        this.auth = new auth();
        this.ioEvents();
        this.plugins = {};

        if(!core.instance)
        {
            core.instance = this;
        }

        import('./plugins/plugins.js').then(module =>
        {
            Object.keys(module).forEach(element => 
            {
                this.plugins[element] = new module[element];
            });
        })
    }
    on(pEvt, pCallback) 
    {
        if (!this.listeners.hasOwnProperty(pEvt))
        this.listeners[pEvt] = Array();

        this.listeners[pEvt].push(pCallback); 
    }
    emit(pEvt, pParams)
    {
        return this.eventTrigger(pEvt,pParams);
    }
    ioEvents()
    {
        this.socket.on('connect',() => 
        {
            this.eventTrigger('connect',()=>{})
        });
        this.socket.on('connect_error',(error) => 
        {
            this.eventTrigger('connect_error',()=>{})
        });
        this.socket.on('error', (error) => 
        {
            this.eventTrigger('connect_error',()=>{})
        });
    }
    //#region  "EVENT"
    eventTrigger(pEvt, pParams) 
    {
        if (pEvt in this.listeners) 
        {
            let callbacks = this.listeners[pEvt];
            for (var x in callbacks)
            {
                callbacks[x](pParams);
            }
        } 
    }
    //#endregion
}
export class sql 
{
    constructor()
    {
        this.query = "";
    }
    try()
    {
        return new Promise(resolve => 
        {
            core.instance.socket.emit('terminal','-try',(pResult) => 
            {
                resolve(pResult);
            });
        });
    }
    createDb()
    {
        return new Promise(resolve => 
        {
            core.instance.socket.emit('terminal','-createDb ' + arguments[0],(pResult) => 
            {
                resolve(pResult);
            });
        });        
    }
    execute()
    {    
        return new Promise(resolve => 
        {
            let TmpQuery = ""
            if(typeof arguments[0] == 'undefined')
            {
                TmpQuery = this.query
            }
            else
            {
                TmpQuery = arguments[0];
            }
            //PARAMETRE UNDEFINED CONTROL
            if(typeof(TmpQuery.value) != 'undefined')
            {
                for (let i = 0; i < TmpQuery.value.length; i++) 
                {
                    if(typeof TmpQuery.value[i] == 'undefined')
                    {
                        resolve({result : {err: "Parametre değerlerinde problem oluştu ! "}})
                    }
                }
            }

            core.instance.socket.emit('sql',TmpQuery,(data) =>
            {
                if(typeof data.auth_err == 'undefined')
                {
                    resolve(data); 
                }
                else
                {
                    //BURADA HATA SAYFASINA YÖNLENDİRME ÇALIŞACAK.
                    console.log(data.auth_err);
                    resolve([]);
                }
            });
        });
    }
}
export class auth 
{
    constructor()
    {
        this.data = null
    }
    login()
    {
        return new Promise(resolve => 
        {
            let TmpData = []
            if(arguments.length == 1)
            {
                TmpData.push(arguments[0])
            }
            else if(arguments.length == 2)
            {
                TmpData.push(arguments[0],arguments[1])
            }

            core.instance.socket.emit('login',TmpData,async (data) =>
            {
                if(data.length > 0)
                {
                    this.data = data[0]
                    window.sessionStorage.setItem('auth',data[0].SHA)
                    resolve(true)
                }
                else
                {
                    window.sessionStorage.removeItem('auth')
                    this.data = null
                    resolve(false)
                }
            });
        })
    }
    logout()
    {
        window.sessionStorage.removeItem('auth');
    }
}
export const coreobj = new core();

Object.setPrototypeOf(datatable.prototype,Array.prototype);