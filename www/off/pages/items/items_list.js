import React from 'react';
import App from '../../lib/app.js';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import NdGrid from '../../../core/react/devex/grid.js';

export default class items_list extends React.Component
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
    }
    render()
    {
        return(
            <div>
                <div className="row p-2">
                    <div className="col-12">
                        <Toolbar>
                            <Item location="after"
                            locateInMenu="auto"
                            widget="dxButton"
                            options=
                            {
                                {
                                    type: 'default',
                                    icon: 'add',
                                    onClick: async () => 
                                    {
                                        
                                    }
                                }    
                            } />
                        </Toolbar>
                    </div>
                </div>
                <div className="row p-2">
                    <div className="col-12">
                        <NdGrid id="test" parent={this} 
                           selection={{mode:"multiple"}} 
                           data={{source: {select : {query:"SELECT * FROM USERS "},sql : this.core.sql}}}
                           filterRow={{visible:true}} headerFilter={{visible:true}}
                           columns=
                           {
                               [
                                    {
                                        dataField:"CODE",
                                        caption:"KODU"
                                    },
                                    {
                                        dataField:"NAME",
                                        caption:"ADI"
                                    }
                               ]
                           }
                        > 
                        </NdGrid>
                    </div>
                </div>
            </div>
        )
    }
}