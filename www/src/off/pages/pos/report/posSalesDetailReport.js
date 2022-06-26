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

export default class posSalesDetailReport extends React.Component
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
                                            "POS.DOC_DATE AS DOC_DATE, " +
                                            "POS.DEVICE AS DEVICE, " +
                                            "CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, " +
                                            "'SALES' AS TITLE, " +
                                            "'HT' AS TYPE, " +
                                            "POS.VAT_RATE AS VAT_RATE, " +
                                            "SUM(POS.FAMOUNT) AS AMOUNT " +
                                            "FROM POS_SALE_VW_01 AS POS " +
                                            "WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END " +
                                            "GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.DEVICE " +
                                            "UNION ALL " +
                                            "SELECT " +
                                            "POS.DOC_DATE AS DOC_DATE, " +
                                            "POS.DEVICE AS DEVICE, " +
                                            "CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, " +
                                            "'SALES' AS TITLE, " +
                                            "'TVA' AS TYPE, " +
                                            "POS.VAT_RATE AS VAT_RATE, " +
                                            "SUM(POS.VAT) AS AMOUNT " +
                                            "FROM POS_SALE_VW_01 AS POS " +
                                            "WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END " +
                                            "GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.DEVICE " +
                                            "UNION ALL " +
                                            "SELECT " +
                                            "POS.DOC_DATE AS DOC_DATE, " +
                                            "POS.DEVICE AS DEVICE, " +
                                            "CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, " +
                                            "'PAYMENT' AS TITLE, " +
                                            "CASE WHEN PAY_TYPE = 0 THEN 'ESC' " +
                                            "WHEN PAY_TYPE = 1 THEN 'CB' " +
                                            "WHEN PAY_TYPE = 2 THEN 'CHQ' " +
                                            "WHEN PAY_TYPE = 3 THEN 'CHQe' " +
                                            "WHEN PAY_TYPE = 4 THEN 'BON D''AVOIR' " +
                                            "END AS TYPE, " +
                                            "0 AS VAT_RATE, " +
                                            "SUM(AMOUNT - CHANGE) AS AMOUNT " +
                                            "FROM POS_PAYMENT_VW_01 AS POS " +
                                            "WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END " +
                                            "GROUP BY POS.GUID,POS.DOC_DATE,POS.TYPE,POS.PAY_TYPE,POS.DEVICE " , 
                                    param : ['START:date','END:date'],
                                    value : [this.dtDate.startDate,this.dtDate.endDate]
                                }
                                let tmpData = await this.core.sql.execute(tmpQuery)
                                if(tmpData.result.recordset.length > 0)
                                {
                                    
                                }
                            }}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form>
                                <Item>
                                    <Label text={this.t("chkRowTotal")} alignment="right" />
                                    <NdCheckBox id="chkRowTotal" parent={this} defaultValue={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.pvtData.setState({showRowTotals:e.value})
                                    }}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <iframe src="http://localhost:3000/pos" title="W3Schools Free Online Web Tutorials">
                            </iframe>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}