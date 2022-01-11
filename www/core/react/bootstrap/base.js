import React from 'react';
import { datatable } from '../../core.js';

export default class NdBase extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            data : typeof props.data == 'undefined' ? undefined : props.data,
        }

        if(typeof this.props.parent != 'undefined' && typeof this.props.id != 'undefined')
        {
            this.props.parent[this.props.id] = this
        }
    }
    get datatable()
    {
        if(typeof this.state.data == 'undefined' || typeof this.state.data.datatable == 'undefined')
        {
            return undefined;
        }

        return this.state.data.datatable;
    }
    dataRefresh(e)
    {        
        return new Promise(mresolve => 
        {
            let tmpThis = this;
            this.setState(
            { 
                data : 
                {
                    store : new CustomStore(
                    {
                        load: () =>
                        {                        
                            return new Promise(async resolve => 
                            {        
                                // EĞER FONKSİYONA PARAMETRE GÖNDERİLMEMİŞ İSE VE STATE DEĞİŞKENİNDE DAHA ÖNCEDEN ATANMIŞ DATA SOURCE VARSA GRİD REFRESH EDİLİYOR.
                                if(typeof e == 'undefined' && typeof tmpThis.state.data != 'undefined' && typeof tmpThis.state.data.source != 'undefined')
                                {
                                    e = 
                                    {
                                        source : tmpThis.state.data.source
                                    }
                                }
                                // EĞER DATA SOURCE A DİZİ GÖNDERİLMİŞ İSE
                                if(typeof e.source != 'undefined' && Array.isArray(e.source))
                                {
                                    tmpThis.state.data.source = e.source;
                                    tmpThis.state.data.datatable = new datatable();
                                    tmpThis.state.data.datatable.import(e.source)
                                    resolve({data: tmpThis.state.data.datatable.toArray()});
                                    mresolve()
                                }
                                // EĞER DATA SOURCE A DATATABLE GÖNDERİLMİŞ İSE
                                else if (typeof e.source != 'undefined' && e.source instanceof datatable)
                                {
                                    tmpThis.state.data.source = e.source;
                                    tmpThis.state.data.datatable = e.source;
                                    await tmpThis.state.data.datatable.refresh();
                                    resolve({data: tmpThis.state.data.datatable.toArray()});
                                    mresolve()
                                }
                                // EĞER DATA SOURCE A QUERY SET GÖNDERİLMİŞ İSE
                                else if (typeof e.source != 'undefined' && typeof e.source == 'object' && typeof e.source.sql != 'undefined' && typeof e.source.select != 'undefined')
                                {                
                                    tmpThis.state.data.source = e.source;
                                    tmpThis.state.data.datatable = new datatable();
                                    tmpThis.state.data.datatable.sql = e.source.sql
                                    tmpThis.state.data.datatable.selectCmd = e.source.select;
                                    tmpThis.state.data.datatable.insertCmd = e.source.insert;
                                    tmpThis.state.data.datatable.updateCmd = e.source.update;
                                    tmpThis.state.data.datatable.deleteCmd = e.source.delete;

                                    await tmpThis.state.data.datatable.refresh()
                                    resolve({data: tmpThis.state.data.datatable.toArray()});
                                    mresolve()
                                }
                                else
                                {
                                    resolve({data: []});
                                    mresolve()
                                }
                            });
                        },
                        insert: (values) => 
                        {
                            return new Promise(async resolve => 
                            {
                                if(typeof tmpThis.state.data != 'undefined' && typeof tmpThis.state.data.datatable != 'undefined')
                                {
                                    tmpThis.state.data.datatable.push(values)
                                    await tmpThis.state.data.datatable.insert();
                                }
                                resolve()                                
                            });
                        },
                        update: (key, values) => 
                        {
                            return new Promise(async resolve => 
                            {
                                if(typeof tmpThis.state.data != 'undefined' && typeof tmpThis.state.data.datatable != 'undefined')
                                {
                                    for (let i = 0; i < Object.keys(values).length; i++) 
                                    {
                                        tmpThis.state.data.datatable.find(x => x === key)[Object.keys(values)[i]] = values[Object.keys(values)[i]]
                                    }                                    
                                }
                                await this.state.data.datatable.update();
                                resolve()                                
                            });
                        },
                    })
                }
            });
        });
    }
}