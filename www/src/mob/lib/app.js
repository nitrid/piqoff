import React from 'react';

export default class App extends React.PureComponent
{
    static instance = null;

    constructor()
    {
        super();
    }
    render() 
    {
        return (
            <div>SELAM</div>
        );
    }
}