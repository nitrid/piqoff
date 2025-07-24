import React from 'react';
import App from '../../../lib/app.js';

import ScrollView from 'devextreme-react/scroll-view';
import Form, { Item} from 'devextreme-react/form';

import NdGrid,{Column,Editing,Scrolling} from '../../../../core/react/devex/grid.js';
import { datatable } from '../../../../core/core.js';

export default class ProductExtraProperty extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.itemObj = new datatable()
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.itemObj = new datatable()
        this.itemObj.selectCmd =
        {
            query : `SELECT GUID,'${this.user.CODE}' AS CUSER,'${this.user.CODE}' AS LUSER,CODE,NAME,MAIN_GRP,MAIN_GRP_NAME,
                    ISNULL((SELECT TOP 1 WAITING FROM ITEMS_REST WHERE ITEMS_REST.ITEM = ITEMS.GUID),0) AS WAITING
                    FROM ITEMS_VW_01 AS ITEMS`
        }
        this.itemObj.updateCmd =
        {
            query : 
                    `DECLARE @ISCHECK AS BIT
                    SET @ISCHECK = ISNULL((SELECT TOP 1 1 FROM ITEMS_REST WHERE ITEMS_REST.ITEM = @ITEM),0)
                    IF @ISCHECK = 0
                    BEGIN 
                    INSERT INTO [dbo].[ITEMS_REST] ([CDATE],[CUSER],[LDATE],[LUSER],[ITEM],[WAITING]) VALUES (dbo.GETDATE(),@CUSER,dbo.GETDATE(),@LUSER,@ITEM,@WAITING)
                    END
                    ELSE
                    BEGIN
                    UPDATE [dbo].[ITEMS_REST] SET [LDATE] = dbo.GETDATE(),[LUSER] = @LUSER,[WAITING] = @WAITING WHERE ITEM = @ITEM
                    END`,
            param : ['CUSER:string|25','LUSER:string|25','ITEM:string|50','WAITING:bit'],
            dataprm : ['CUSER','LUSER','GUID','WAITING']
        }

        await this.itemObj.refresh()
        this.grdList.dataRefresh({source:this.itemObj})
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} id="frmDepot">
                                <Item>
                                    <NdGrid parent={this} id={"grdList"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true}
                                    allowColumnResizing={true}
                                    height={'600'} 
                                    width={'100%'}
                                    dbApply={true}
                                    loadPanel={{enabled:true}}
                                    filterRow={{visible:true}}
                                    >
                                        <Scrolling mode="standart" />
                                        <Editing mode="batch" allowUpdating={true}/>
                                        <Column dataField="NAME" caption={this.t("grdList.NAME")} width={'60%'}/>
                                        <Column dataField="MAIN_GRP_NAME" caption={this.t("grdList.MAIN_GRP_NAME")} width={'30%'}/>
                                        <Column dataField="WAITING" caption={this.t("grdList.WAITING")} width={'10%'}/>
                                    </NdGrid>
                                </Item>    
                            </Form>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}
