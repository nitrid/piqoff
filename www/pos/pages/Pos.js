import React from 'react';
import { itemsCls } from '../../core/cls/items.js';
import App from '../lib/app.js';

export default class Pos extends React.Component
{
    constructor()
    {
        super() 
        this.core = App.instance.core;
    }
    async componentDidMount()
    {
        let tmpDb = 
        {
            name : 'POS',
            tables :
            [
                {
                    name : 'ITEMS',
                    columns : 
                    {
                        GUID : {dataType:"string"},
                        CDATE : {dataType:"date_time"},
                        CUSER : {dataType:"string"},
                        LDATE : {dataType:"date_time"},
                        LUSER : {dataType:"string"},
                        TYPE : {dataType:"string"},
                        SPECIAL : {dataType:"string"},
                        CODE : {dataType:"string"},
                        NAME : {dataType:"string"},
                        SNAME : {dataType:"string"},
                        VAT : {dataType:"number"},
                        COST_PRICE : {dataType:"number"},
                        MIN_PRICE : {dataType:"number"},
                        MAX_PRICE : {dataType:"number"},
                        STATUS : {dataType:"boolean"},
                        MAIN_GRP : {dataType:"string"},
                        MAIN_GRP_NAME : {dataType:"string"},
                        SUB_GRP : {dataType:"string"},
                        ORGINS : {dataType:"string"},
                        ORGINS_NAME : {dataType:"string"},
                        SECTOR : {dataType:"string"},
                        RAYON : {dataType:"string"},
                        SHELF : {dataType:"string"},
                        WEIGHING : {dataType:"boolean"},
                        SALE_JOIN_LINE : {dataType:"boolean"},
                        TICKET_REST: {dataType:"boolean"},
                    } 
                }
            ]
        }
        await this.core.local.init(tmpDb);
        console.log(111)
        let tmpItems = new itemsCls
        await tmpItems.load()
        this.core.offline = true

        Object.setPrototypeOf(tmpItems.dt('ITEMS')[0],{stat:'new'})
        
        await tmpItems.save()
        await tmpItems.load()
        tmpItems.dt('ITEMS')[0].CODE = '1453'
        await tmpItems.save()
        await tmpItems.load()
        tmpItems.dt('ITEMS').removeAt(0)
        await tmpItems.save()
        await tmpItems.load()
        console.log(tmpItems.dt('ITEMS'))
    }
    render()
    {
        return(
            <div>                
                <div className="top-bar" style={{backgroundColor:"#3498db"}}>
                    AAAA       
                </div>
                <div>
                    TEST
                </div>
            </div>
        )
    }
}