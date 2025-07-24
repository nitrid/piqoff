import React from 'react';
import App from '../lib/app.js';
import ScrollView from 'devextreme-react/scroll-view';

export default class empty extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.lang = App.instance.lang;
    }
    render()
    {
        return(
            <ScrollView>
                <div className="p-2">
                    <div className="row">
                        <div className="col-4 p-1">
                            <div className="card text-center" style={{cursor:'pointer',height:'120px'}} 
                                onClick={() => 
                                {
                                    App.instance.menuClick({
                                        id: 'stk_01',
                                        text: this.lang.t(`menu.stk_01`),
                                        path: 'items/priceCheck',
                                    })
                                }}>
                                <div className="card-body d-flex flex-column justify-content-center align-items-center p-1">
                                    <i className={'fa-solid fa-barcode mb-1'} style={{fontSize:'32px', color:'#17a2b8'}}></i>
                                    <h6 className="card-title" style={{fontSize:'13px', fontWeight:'500', margin: 0}}>
                                        {this.lang.t(`menu.stk_01`)}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollView>
        )
    }
}