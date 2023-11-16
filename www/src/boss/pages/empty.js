import React from 'react';
import App from '../lib/app.js';
import ScrollView from 'devextreme-react/scroll-view';

export default class empty extends React.PureComponent
{
    constructor(props)
    {
        super(props)
    }
    render()
    {
        return(
            <ScrollView>
                <div className='row px-3'>{this.lang.t("comingSoon")}</div>
            </ScrollView>
        )
    }
}