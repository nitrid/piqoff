import React from "react";
import App from "../lib/app.js";

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

export default class posCustomerPointReport extends React.PureComponent
{
    constructor(props)
    {
        super(props);

        this.core = App.instance.core;
        this.lang = App.instance.lang;
        this.user = this.core.auth.data
        this.prmObj = App.instance.prmObj
        this.acsObj = App.instance.acsObj

        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()
    }

    render()
    {
        return (
            <div>
                <ScrollView>

                </ScrollView>
            </div>
        );
    }
}