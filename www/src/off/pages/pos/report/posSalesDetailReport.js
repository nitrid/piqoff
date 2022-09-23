import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPivot,{FieldChooser} from '../../../../core/react/devex/pivot.js';

export default class posSalesDetailReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdButton text={this.lang.t("btnGet")} type="default" stylingMode="contained" width={'100%'}
                            onClick={async (e)=>
                            {
                                let tmpQuery = 
                                {
                                    query : "SELECT " +
                                    "ITEM_GRP_CODE AS CODE, " +
                                    "ITEM_GRP_NAME, " +
                                    "ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE PAGE = 70),'') AS PATH, " +
                                    "SUM(TOTAL) AS ITEM_GROUP_TOTAL, " +
                                    "ROUND((SUM(TOTAL) / (SELECT SUM(TOTAL) FROM POS_VW_01)) * 100,2) AS TICKET_ORT, " +
                                    "(SELECT COUNT(GUID) FROM POS_VW_01 WHERE DOC_DATE >= @START AND DOC_DATE <= @END) AS TICKET_COUNT, " +
                                    "(SELECT SUM(TOTAL) FROM POS_VW_01 WHERE DOC_DATE >= @START AND DOC_DATE <= @END) AS TICKET_TOTAL, " +
                                    "(SELECT COUNT(CUSTOMER_GUID) FROM POS_VW_01 WHERE CUSTOMER_GUID <> '00000000-0000-0000-0000-000000000000' AND DOC_DATE >= @START AND DOC_DATE <= @END) AS CUSTOMER_CARD, " +
                                    "(SELECT COUNT(GUID) FROM POS_VW_01 WHERE TYPE = 1 AND DOC_DATE >= @START AND DOC_DATE <= @END) AS RETURN_COUNT, " +
                                    "(SELECT SUM(TOTAL) FROM POS_VW_01 WHERE TYPE = 1 AND DOC_DATE >= @START AND DOC_DATE <= @END) AS RETURN_TOTAL, " +
                                    "(SELECT COUNT(DISCOUNT) FROM POS_VW_01 WHERE TYPE = 0 AND DISCOUNT > 0 AND DOC_DATE >= @START AND DOC_DATE <= @END) AS DISCOUNT_COUNT, " +
                                    "(SELECT SUM(DISCOUNT) FROM POS_VW_01 WHERE TYPE = 0 AND DOC_DATE >= @START AND DOC_DATE <= @END) AS DISCOUNT_TOTAL " +
                                    "FROM POS_SALE_VW_01 WHERE DOC_DATE >= @START AND DOC_DATE <= @END GROUP BY ITEM_GRP_CODE,ITEM_GRP_NAME ORDER BY SUM(TOTAL) ASC ",
                                    param : ['START:date','END:date'],
                                    value : [this.dtDate.startDate,this.dtDate.endDate]
                                }
                                App.instance.setState({isExecute:true})
                                let tmpData = await this.core.sql.execute(tmpQuery)
                                App.instance.setState({isExecute:false})
                                if(tmpData.result.recordset.length > 0)
                                {
                                    this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" +  JSON.stringify(tmpData.result.recordset)+ "}",(pResult) => 
                                    {
                                        if(pResult.split('|')[0] != 'ERR')
                                        {
                                            console.log(12)
                                            let mywindow = window.open('','_blank',"width=900,height=1000,left=500");
                                            mywindow.document.write("<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' default-src='self' width='100%' height='100%'></iframe>");
                                        }
                                    });
                                }
                            }}/>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}