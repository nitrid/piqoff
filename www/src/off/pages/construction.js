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
      
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className='py-5'>
                        <h4 className='text-center'>
                            {this.lang.t("constructionMsg")}
                        </h4>
                    </div>
                   
                </ScrollView>
            </div>
        )
    }
}