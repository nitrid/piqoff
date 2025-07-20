import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';

import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import Form, {Item, Label} from 'devextreme-react/form';

export default class posSalesDetailReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(100)
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form>
                                <Item>
                                    <Label text={this.lang.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdButton text={this.lang.t("btnGet")} type="default" stylingMode="contained" width={'100%'}
                            onClick={async ()=>
                            {
                                let tmpQuery = 
                                {
                                    query : 
                                            `SELECT 
                                            ITEM_GRP_CODE AS CODE, 
                                            ITEM_GRP_NAME, 
                                            ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE PAGE = 70),'') AS PATH, 
                                            SUM(TOTAL) AS ITEM_GROUP_TOTAL, 
                                            ROUND((SUM(TOTAL) / (SELECT SUM(TOTAL) FROM POS_VW_01)) * 100,2) AS TICKET_ORT, 
                                            (SELECT COUNT(GUID) FROM POS_VW_01 WHERE DOC_DATE >= @START AND DOC_DATE <= @END) AS TICKET_COUNT, 
                                            (SELECT SUM(TOTAL) FROM POS_VW_01 WHERE DOC_DATE >= @START AND DOC_DATE <= @END AND TYPE =0 AND STATUS = 1) - (SELECT SUM(TOTAL) FROM POS_VW_01 WHERE DOC_DATE >= @START AND DOC_DATE <= @END AND TYPE <>0 AND STATUS = 1) AS TICKET_TOTAL, 
                                            (SELECT COUNT(CUSTOMER_GUID) FROM POS_VW_01 WHERE CUSTOMER_GUID <> '00000000-0000-0000-0000-000000000000' AND DOC_DATE >= @START AND DOC_DATE <= @END) AS CUSTOMER_CARD, 
                                            (SELECT COUNT(GUID) FROM POS_VW_01 WHERE TYPE = 1 AND DOC_DATE >= @START AND DOC_DATE <= @END) AS RETURN_COUNT, 
                                            (SELECT SUM(TOTAL) FROM POS_VW_01 WHERE TYPE = 1 AND DOC_DATE >= @START AND DOC_DATE <= @END) AS RETURN_TOTAL, 
                                            (SELECT COUNT(DISCOUNT) FROM POS_VW_01 WHERE TYPE = 0 AND DISCOUNT > 0 AND DOC_DATE >= @START AND DOC_DATE <= @END) AS DISCOUNT_COUNT, 
                                            (SELECT SUM(DISCOUNT) FROM POS_VW_01 WHERE TYPE = 0 AND DOC_DATE >= @START AND DOC_DATE <= @END) AS DISCOUNT_TOTAL 
                                            FROM POS_SALE_VW_01 WHERE DOC_DATE >= @START AND DOC_DATE <= @END AND DEVICE <> '9999' GROUP BY ITEM_GRP_CODE,ITEM_GRP_NAME ORDER BY SUM(TOTAL) ASC `,
                                    param : ['START:date','END:date'],
                                    value : [this.dtDate.startDate,this.dtDate.endDate]
                                }

                                App.instance.setState({isExecute:true})
                                let tmpData = await this.core.sql.execute(tmpQuery)
                                App.instance.setState({isExecute:false})

                                if(tmpData.result.recordset.length > 0)
                                {
                                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' +  JSON.stringify(tmpData.result.recordset)+ '}',(pResult) => 
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