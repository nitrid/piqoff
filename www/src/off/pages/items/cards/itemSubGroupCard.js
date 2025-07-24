import React from 'react';
import App from '../../../lib/app.js';
import { subGroupCls} from '../../../../core/cls/items.js';
import ScrollView from 'devextreme-react/scroll-view';

import NdTreeList,{Column,RowDragging,Editing,Button,ValidationRule,Popup,Form,Item} from '../../../../core/react/devex/treelist.js';
import { datatable } from '../../../../core/core.js';

export default class itemSubGroupCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.subGrpObj = new subGroupCls();
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        await this.subGrpObj.load()
        this.tglGrp.setDataSource(this.subGrpObj.dt().toArray())
    }
    calculateDepth(itemId, items, depth = 0) 
    {
        const item = items.find(x => x.GUID === itemId);
        if (!item || item.PARENT === '00000000-0000-0000-0000-000000000000') 
        {
            return depth;
        } 
        else 
        {
            return this.calculateDepth(item.PARENT, items, depth + 1);
        }
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdTreeList
                            id="tglGrp"
                            parent={this}
                            width={'100%'}
                            columnAutoWidth={true}
                            showRowLines={true}
                            showBorders={true}
                            defaultExpandedRowKeys={[]}
                            dbApply={false}
                            keyExpr="GUID"
                            parentIdExpr="PARENT_MASK"
                            onRowInserted={async(e)=>
                            {
                                this.subGrpObj.addEmpty()

                                this.subGrpObj.dt()[this.subGrpObj.dt().length - 1].GUID = datatable.uuidv4()
                                this.subGrpObj.dt()[this.subGrpObj.dt().length - 1].CUSER = this.core.auth.data.CODE
                                this.subGrpObj.dt()[this.subGrpObj.dt().length - 1].LUSER = this.core.auth.data.CODE
                                this.subGrpObj.dt()[this.subGrpObj.dt().length - 1].CODE = e.data.CODE
                                this.subGrpObj.dt()[this.subGrpObj.dt().length - 1].NAME = e.data.NAME
                                this.subGrpObj.dt()[this.subGrpObj.dt().length - 1].PARENT = '00000000-0000-0000-0000-000000000000'
                                this.subGrpObj.dt()[this.subGrpObj.dt().length - 1].PARENT_MASK = null
                                this.subGrpObj.dt()[this.subGrpObj.dt().length - 1].RANK = -1
                                
                                this.tglGrp.setDataSource(this.subGrpObj.dt().toArray())

                                await this.subGrpObj.save()
                            }}
                            onRowUpdated={async()=>
                            {
                                await this.subGrpObj.save()
                            }}
                            onRowRemoved={async(e)=>
                            {
                                let tmpFn = (itemId, items)=>
                                {
                                    const item = items.find(x => x.PARENT === itemId);
                                    if (typeof item != 'undefined') 
                                    {
                                        this.subGrpObj.dt().removeAt(item)
                                        return tmpFn(item.GUID,items)
                                    }
                                    else
                                    {
                                        return
                                    }
                                }
                                tmpFn(e.data.GUID,this.subGrpObj.dt().toArray())
                                this.subGrpObj.dt().removeAt(e.data)
                                await this.subGrpObj.dt().delete()
                            }}
                            >
                                <RowDragging allowDropInsideItem={true} allowReordering={true} showDragIcons={true}
                                onReorder={async(e)=>
                                {
                                    const visibleRows = e.component.getVisibleRows();
                                    let sourceData = e.itemData;
                                    const sourceIndex = this.subGrpObj.dt().indexOf(sourceData);
                                    
                                    if (e.dropInsideItem) 
                                    {
                                        sourceData.PARENT = visibleRows[e.toIndex].key;
                                        sourceData.PARENT_MASK = visibleRows[e.toIndex].key;
                                        this.subGrpObj.dt().splice(sourceIndex, 1);
                                        this.subGrpObj.dt().splice(e.toIndex, 0, sourceData);
                                    } 
                                    else 
                                    {
                                        const targetData = visibleRows[e.toIndex].data;
                                        const targetIndex = this.subGrpObj.dt().indexOf(targetData);
                                        sourceData.PARENT = targetData.PARENT;
                                        sourceData.PARENT_MASK = targetData.PARENT_MASK;
                                        this.subGrpObj.dt().splice(sourceIndex, 1);
                                        this.subGrpObj.dt().splice(targetIndex + 1, 0, sourceData);
                                    }

                                    this.subGrpObj.dt().forEach(item => 
                                    {
                                        item.RANK = this.calculateDepth(item.GUID, this.subGrpObj.dt());
                                        if (!this.subGrpObj.dt().some(child => child.PARENT === item.GUID) && item.RANK === 0) 
                                        {
                                            item.RANK = -1;
                                        }
                                    });

                                    await this.tglGrp.setDataSource(this.subGrpObj.dt().toArray());
                                    
                                    await this.subGrpObj.save()
                                }}
                                />
                                <Editing allowUpdating={true} allowDeleting={true} allowAdding={true} mode="popup">
                                    <Popup title={""} showTitle={true} width={400} height={260} />
                                    <Form colCount={1}>
                                        <Item dataField="CODE" />
                                        <Item dataField="NAME" />
                                    </Form>
                                </Editing>

                                <Column dataField="NAME" caption={this.t("tglGrp.clmName")}>
                                    <ValidationRule type="required" />
                                </Column>
                                <Column dataField="CODE" caption={this.t("tglGrp.clmCode")}>
                                    <ValidationRule type="required" />
                                </Column>
                                <Column dataField="GUID" visible={false}/>
                                <Column dataField="PARENT_MASK" visible={false}/>
                                <Column dataField="RANK" visible={false}/>
                                <Column type="buttons">
                                    <Button name="edit" icon="edit"/>
                                    <Button name="delete" icon="trash"/>
                                </Column>
                            </NdTreeList>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}
