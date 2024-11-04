import React from 'react';
import App from '../lib/app.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../core/react/devex/textbox.js'
import NdNumberBox from '../../core/react/devex/numberbox.js';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdCheckBox from '../../core/react/devex/checkbox.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import NdPopUp from '../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../core/react/devex/grid.js';
import NdButton from '../../core/react/devex/button.js';
import NdDatePicker from '../../core/react/devex/datepicker.js';
import NdImageUpload from '../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../core/react/devex/dialog.js';
import { datatable } from '../../core/core.js';

export default class mainPage extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
    }
    componentDidMount()
    {
        this.init()
    }
    async init()
    {
        // let tmpQuery = 
        // {
        //     query : "SELECT * FROM " +
        //             "(SELECT *, " +
        //             "ISNULL((SELECT SUM(QUANTITY) FROM POS_SALE  WHERE POS_SALE.ITEM = ITEM_EXPDATE_VW_01.ITEM_GUID AND POS_SALE.DELETED = 0 AND POS_SALE.CDATE > ITEM_EXPDATE_VW_01.CDATE),0) AS DIFF " +
        //             "FROM [ITEM_EXPDATE_VW_01] WHERE  " +
        //             " (dbo.GETDATE()+15 >  EXP_DATE) AND (EXP_DATE >= dbo.GETDATE())) AS TMP WHERE QUANTITY - DIFF > 0",
        // }
        // let tmpData = await this.core.sql.execute(tmpQuery) 
        // if(tmpData.result.recordset.length > 0)
        // {
        //     let tmpConfObj =
        //     {
        //         id:'msgExpUpcoming',showTitle:true,title:this.lang.t("msgExpUpcoming.title"),showCloseButton:true,width:'500px',height:'200px',
        //         button:[{id:"btn01",caption:this.lang.t("msgExpUpcoming.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgExpUpcoming.btn02"),location:'after'}],
        //         content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgExpUpcoming.msg")}</div>)
        //     }
        //     let pResult = await dialog(tmpConfObj);
        //     if(pResult == 'btn02')
        //     {
        //         App.instance.menuClick(
        //         {
        //             id: 'stk_04_004',
        //             text: this.lang.t('menuOff.stk_04_004'),
        //             path: 'items/operations/expdateOperations',
        //         })
        //     }
           
        // }
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                </ScrollView>
            </div>
        )
    }
}