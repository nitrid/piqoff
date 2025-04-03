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
                <div style={{display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '24px'}}>
                    {this.lang.t("comingSoon")}
                </div>
            </ScrollView>
        )
    }
}