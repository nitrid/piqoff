import React from 'react';
import { datatable } from '../../core/core';
import Form, { Label,Item } from 'devextreme-react/form';
import NdTextBox from '../../core/react/devex/textbox';
import NdCheckBox from '../../core/react/devex/checkbox';
import NdButton from '../../core/react/devex/button';
import NdPopUp from '../../core/react/devex/popup';
import NdPopGrid from '../../core/react/devex/popgrid';
import NdGrid,{Column,Pager,Editing,Popup,Paging,Scrolling,KeyboardNavigation,Lookup} from '../../core/react/devex/grid';
import NdTextArea from '../../core/react/devex/textarea';
import NdSelectBox from '../../core/react/devex/selectbox';

function parseTry(pData)
{
    try
    {
        return JSON.parse(pData)
    }catch (error) 
    {
        return pData
    }
}
function checkBoxBuild(pItem)
{
    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={pItem.VIEW.CAPTION} alignment="right" />
            <NdCheckBox id={pItem.ID} key={pItem.ID} parent={this}/>
        </Item>
    )
}
function checkBoxSet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'boolean')
        {
           this[pItem.ID].value = parseTry(pItem.VALUE)
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && typeof parseTry(pItem.VALUE).value == 'boolean')
        {
            this[pItem.ID].value = parseTry(pItem.VALUE).value
        }
    }
}
function checkBoxGet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(typeof pItem.VALUE == 'boolean')
        {
            return this[pItem.ID].value
        }
        else if(typeof pItem.VALUE == 'object' && typeof pItem.VALUE.value == 'boolean')
        {
            return JSON.stringify({value : this[pItem.ID].value})
        }
    }
}
function textBoxBuild(pItem)
{
    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={pItem.VIEW.CAPTION} alignment="right" />
            <NdTextBox id={pItem.ID} key={pItem.ID} parent={this} simple={true}/>
        </Item>
    )
}
function textBoxSet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'string' || typeof parseTry(pItem.VALUE) == 'number')
        {
           this[pItem.ID].value = parseTry(pItem.VALUE)
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && (typeof parseTry(pItem.VALUE).value == 'string' || typeof parseTry(pItem.VALUE).value == 'number'))
        {
            this[pItem.ID].value = parseTry(pItem.VALUE).value
        }
    }
}
function textBoxGet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'string' || typeof parseTry(pItem.VALUE) == 'number')
        {
            return this[pItem.ID].value
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && (typeof parseTry(pItem.VALUE).value == 'string' || typeof parseTry(pItem.VALUE).value == 'number'))
        {
            return JSON.stringify({value : this[pItem.ID].value})
        }
    }
}
function comboBoxBuild(pItem)
{
    let tmpSource = {}
    if(Array.isArray(pItem.VIEW.DATA))
    {
        tmpSource = pItem.VIEW.DATA
    }
    else
    {
        tmpSource = pItem.VIEW.DATA
        tmpSource.sql = this.core.sql
    }
    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={pItem.VIEW.CAPTION} alignment="right" />
            <NdSelectBox id={pItem.ID} key={pItem.ID} parent={this} simple={true}
            displayExpr={pItem.VIEW.DISPLAY}                      
            valueExpr={pItem.VIEW.FIELD}
            data={{source:tmpSource}}
            />
        </Item>
    )
}
function comboBoxSet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'string' || typeof parseTry(pItem.VALUE) == 'number')
        {
           this[pItem.ID].value = parseTry(pItem.VALUE)
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && (typeof parseTry(pItem.VALUE).value == 'string' || typeof parseTry(pItem.VALUE).value == 'number'))
        {
            this[pItem.ID].value = parseTry(pItem.VALUE).value
        }
    }
}
function comboBoxGet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'string' || typeof parseTry(pItem.VALUE) == 'number')
        {
            return this[pItem.ID].value
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && (typeof parseTry(pItem.VALUE).value == 'string' || typeof parseTry(pItem.VALUE).value == 'number'))
        {
            return JSON.stringify({value : this[pItem.ID].value})
        }
    }
}
function popInputBuild(pItem)
{
    let tmpBuild = ()=>
    {
        let tmpItems = []
        pItem.VIEW.FORM.item.map((pObj) => 
        {
            let tmpProp = 
            {
                ID : pObj.id,
                VIEW : 
                {
                    CAPTION : pObj.caption,
                }
            }
            if(pObj.type == 'checkbox')
            {
                tmpItems.push(checkBoxBuild(tmpProp))
            }
            else if(pObj.type == 'text')
            {
                tmpItems.push(textBoxBuild(tmpProp))
            }
            else if(pObj.type == 'popObjectList')
            {
                tmpProp.VIEW.FORM = pObj.form
                tmpItems.push(popObjectListBuild(tmpProp))
            }
            else if(pObj.type == 'popInput')
            {
                tmpProp.VIEW.FORM = pObj.form
                tmpItems.push(popInputBuild(tmpProp))
            }
        })
        return tmpItems
    }

    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={pItem.VIEW.CAPTION} alignment="right" />
            <NdTextBox id={pItem.ID} key={pItem.ID} parent={this} simple={true} readOnly={true}
            button={
            [
                {
                    id:'01',
                    icon:'more',
                    onClick:async()=>
                    {
                        pItem.VIEW.FORM.item.map((pObj) => 
                        {                            
                            let tmpProp = 
                            {
                                ID : pObj.id,
                                VALUE : this[pItem.ID].obj[pObj.field]
                            }
                            if(pObj.type == 'checkbox')
                            {
                                checkBoxSet(tmpProp)
                            }
                            else if(pObj.type == 'text')
                            {
                                textBoxSet(tmpProp)
                            }
                            else if(pObj.type == 'popObjectList')
                            {
                                popObjectListSet(tmpProp)
                            }
                            else if(pObj.type == 'popInput')
                            {         
                                tmpProp.VIEW = {DISPLAY : pObj.display}
                                popInputBoxSet(tmpProp)
                            }
                        })

                        this["popInput" + pItem.ID].show()
                    }
                }
            ]}/>
            <div>
                <NdPopUp parent={this} id={"popInput" + pItem.ID} container={"#root"}
                position={{of:'#root'}}
                showCloseButton={true}
                showTitle={true}
                title={pItem.VIEW.CAPTION}
                width={typeof pItem.VIEW.FORM.width == 'undefined' ? '600' : pItem.VIEW.FORM.width}
                height={typeof pItem.VIEW.FORM.height == 'undefined' ? '260' : pItem.VIEW.FORM.height}
                >
                    <div className='row pb-2'>
                        <div className='col-12'>
                            <Form colCount={typeof pItem.VIEW.FORM.colCount == 'undefined' ? 2 : pItem.VIEW.FORM.colCount}>
                                {tmpBuild()}
                            </Form>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <NdButton id={"btnPopInput" + pItem.ID} parent={this} text={"Kaydet"} type="default" width={'100%'}
                            onClick={()=>
                            {
                                let tmpData = {}
                                pItem.VIEW.FORM.item.map((pObj) => 
                                {          
                                    if(pObj.type == 'popObjectList')
                                    {
                                        tmpData[pObj.field] = this[pObj.id].obj
                                    }
                                    else if(pObj.type == 'popInput')
                                    {
                                        tmpData[pObj.field] = this[pObj.id].obj
                                    }
                                    else
                                    {
                                        tmpData[pObj.field] = this[pObj.id].value
                                    }
                                })
                                this[pItem.ID].obj = tmpData
                                if(typeof pItem.VIEW.DISPLAY != 'undefined')
                                {
                                    this[pItem.ID].value = this[pItem.ID].obj[pItem.VIEW.DISPLAY]
                                }

                                this["popInput" + pItem.ID].hide()
                            }}/>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        </Item>
    )
}
function popInputBoxSet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'object')
        {            
            this[pItem.ID].obj = parseTry(Object.assign({},pItem).VALUE)
            
            if(typeof pItem.VIEW.DISPLAY != 'undefined')
            {
                this[pItem.ID].value = this[pItem.ID].obj[pItem.VIEW.DISPLAY]
            }
        }
    }
}
function popInputBoxGet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'object')
        {
            return JSON.stringify(this[pItem.ID].obj)
        }
    }
}
function popSelectBuild(pItem)
{
    let tmpSource = {}
    if(Array.isArray(pItem.VIEW.FORM.data))
    {
        tmpSource = pItem.VIEW.FORM.data
    }
    else
    {
        tmpSource = pItem.VIEW.FORM.data
        tmpSource.sql = this.core.sql
    }

    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={pItem.VIEW.CAPTION} alignment="right" />
            <NdTextBox id={pItem.ID} key={pItem.ID} parent={this} simple={true} readOnly={true}
            button={
            [
                {
                    id:'01',
                    icon:'more',
                    onClick:async()=>
                    {
                        this["popSelect" + pItem.ID].show()
                        this["popSelect" + pItem.ID].onClick = async(data) =>
                        {
                            let tmpData = 
                            {
                                ID : pItem.ID,
                                VALUE : ""
                            }

                            if(data.length > 1)
                            {
                                tmpData.VALUE = data
                            }
                            else if(data.length > 0)
                            {
                                if(typeof pItem.VIEW.FIELD == 'undefined')
                                {
                                    tmpData.VALUE = data[0]
                                }
                                else
                                {
                                    tmpData.VALUE = data[0][pItem.VIEW.FIELD]
                                }
                            }
                            popSelectBoxSet(tmpData)
                        }
                    }
                }
            ]}/>
            <div>
                <NdPopGrid id={"popSelect" + pItem.ID} parent={this} container={"#root"}
                visible={false}
                position={{of:'#root'}}
                showTitle={true}
                showBorders={true}
                title={pItem.VIEW.CAPTION}
                selection={pItem.VIEW.FORM.selection}
                width={typeof pItem.VIEW.FORM.width == 'undefined' ? '600' : pItem.VIEW.FORM.width}
                height={typeof pItem.VIEW.FORM.height == 'undefined' ? '400' : pItem.VIEW.FORM.height}
                data={{source:tmpSource}}
                >
                </NdPopGrid>
            </div>
        </Item>
    )
}
function popSelectBoxSet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'object')
        {
            this[pItem.ID].obj = parseTry(pItem.VALUE)

            if(typeof pItem.VIEW.DISPLAY != 'undefined')
            {
                this[pItem.ID].value = this[pItem.ID].obj[pItem.VIEW.DISPLAY]
            }
        }
        else
        {
            this[pItem.ID].obj = parseTry(pItem.VALUE)
            this[pItem.ID].value = parseTry(pItem.VALUE)
        }
    }
}
function popSelectBoxGet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'object')
        {
            return JSON.stringify(this[pItem.ID].obj)
        }
        else
        {
            return this[pItem.ID].obj
        }
        
    }
}
function popTextListBuild(pItem)
{
    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={pItem.VIEW.CAPTION} alignment="right" />
            <NdTextBox id={pItem.ID} key={pItem.ID} parent={this} simple={true} readOnly={true}
            button={
            [
                {
                    id:'01',
                    icon:'more',
                    onClick:async()=>
                    {
                        this["txtPopTextList" + pItem.ID].value = this[pItem.ID].obj.join('\r\n');
                        this["popTextList" + pItem.ID].show()
                    }
                }
            ]}/>
            <div>
                <NdPopUp parent={this} id={"popTextList" + pItem.ID} container={"#root"}
                position={{of:'#root'}}
                showCloseButton={true}
                showTitle={true}
                title={pItem.VIEW.CAPTION}
                width={typeof pItem.VIEW.FORM.width == 'undefined' ? '600' : pItem.VIEW.FORM.width}
                height={typeof pItem.VIEW.FORM.height == 'undefined' ? '260' : pItem.VIEW.FORM.height}
                >
                    <div className='row pb-2'>
                        <div className='col-12'>
                            <NdTextArea id={"txtPopTextList" + pItem.ID} parent={this} height={pItem.VIEW.FORM.textHeight}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <NdButton id={"btnPopTextList" + pItem.ID} parent={this} text={"Kaydet"} type="default" width={'100%'}
                            onClick={()=>
                            {
                                this[pItem.ID].obj = this["txtPopTextList" + pItem.ID].value.trim().split(/\r?\n/)
                                this["popTextList" + pItem.ID].hide()
                            }}/>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        </Item>
    )
}
function popTextListSet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(Array.isArray(parseTry(pItem.VALUE)))
        {
            this[pItem.ID].obj = parseTry(pItem.VALUE)
            
            if(parseTry(pItem.VALUE).length > 0)
            {
                this[pItem.ID].value = parseTry(pItem.VALUE)[0]
            }
        }
    }
}
function popTextListGet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        return JSON.stringify(this[pItem.ID].obj)
    }
}
function popObjectListBuild(pItem)
{
    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={pItem.VIEW.CAPTION} alignment="right" />
            <NdButton id={pItem.ID} key={pItem.ID} parent={this} text={"Giriş"} width={'100%'} type="default"
            onClick={async()=>
            {
                await this["popObjectListGrd" + pItem.ID].dataRefresh({source:this[pItem.ID].obj});
                this["popObjectList" + pItem.ID].show()
            }}/>
            <div>
                <NdPopUp parent={this} id={"popObjectList" + pItem.ID} container={"#root"}
                position={{of:'#root'}}
                showCloseButton={true}
                showTitle={true}
                title={pItem.VIEW.CAPTION}
                width={typeof pItem.VIEW.FORM.width == 'undefined' ? '600' : pItem.VIEW.FORM.width}
                height={typeof pItem.VIEW.FORM.height == 'undefined' ? '260' : pItem.VIEW.FORM.height}
                >
                    <div className='row pb-2'>
                        <div className='col-12'>
                            <NdGrid id={"popObjectListGrd" + pItem.ID} parent={this}
                            showBorders={true}
                            allowColumnResizing={true}
                            selection={{mode:"single"}} 
                            width={'100%'}
                            height={'100%'}
                            dbApply={false}
                            >
                                <Scrolling mode="standart" />
                                <Paging defaultPageSize={5} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                <Editing mode="popup" allowUpdating={pItem.VIEW.FORM.allowUpdating} allowAdding={pItem.VIEW.FORM.allowAdding} allowDeleting={pItem.VIEW.FORM.allowDeleting}>
                                    <Popup title={pItem.VIEW.CAPTION} showTitle={true} width={pItem.VIEW.FORM.formWidth} height={pItem.VIEW.FORM.formHeight} />
                                </Editing>
                            </NdGrid>
                        </div>
                    </div>
                    <div className='row pb-2'>
                        <div className='col-12'>
                            <NdButton id={"btnPopObjectListGrd" + pItem.ID} parent={this} text={"Kaydet"} type="default" width={'100%'}
                            onClick={()=>
                            {
                                this["popObjectList" + pItem.ID].hide()
                            }}/>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        </Item>
    )
}
function popObjectListSet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        if(Array.isArray(parseTry(pItem.VALUE)))
        {
            this[pItem.ID].obj = parseTry(Object.assign({},pItem).VALUE)
        }
    }
}
function popObjectListGet(pItem)
{
    if(typeof this[pItem.ID] != 'undefined')
    {
        return JSON.stringify(this[pItem.ID].obj)
    }
}
export function ItemBuild(pItem)
{
    checkBoxBuild = checkBoxBuild.bind(this)
    textBoxBuild = textBoxBuild.bind(this)
    comboBoxBuild = comboBoxBuild.bind(this)
    popInputBuild = popInputBuild.bind(this)
    popSelectBuild = popSelectBuild.bind(this)
    popTextListBuild = popTextListBuild.bind(this)
    popObjectListBuild = popObjectListBuild.bind(this)

    if(pItem.VIEW.TYPE == 'checkbox')
    {
        return checkBoxBuild(pItem)
    }
    else if(pItem.VIEW.TYPE == 'text')
    {
        return textBoxBuild(pItem)
    }
    else if(pItem.VIEW.TYPE == 'combobox')
    {
        return comboBoxBuild(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popInput')
    {
        return popInputBuild(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popSelect')
    {
        return popSelectBuild(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popTextList')
    {
        return popTextListBuild(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popObjectList')
    {
        return popObjectListBuild(pItem)
    }
    // else
    // {
    //     return <Item key={pItem.ID}> </Item>
    // }
}
export async function ItemSet(pItem)
{
    await this.core.util.waitUntil(0)
    
    checkBoxSet = checkBoxSet.bind(this)
    textBoxSet = textBoxSet.bind(this)
    comboBoxSet = comboBoxSet.bind(this)
    popInputBoxSet = popInputBoxSet.bind(this)
    popSelectBoxSet = popSelectBoxSet.bind(this)
    popTextListSet = popTextListSet.bind(this)
    popObjectListSet = popObjectListSet.bind(this)

    if(pItem.VIEW.TYPE == 'checkbox')
    {
        checkBoxSet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'text')
    {
        textBoxSet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'combobox')
    {
        comboBoxSet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popInput')
    {
        popInputBoxSet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popSelect')
    {
        popSelectBoxSet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popTextList')
    {
        popTextListSet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popObjectList')
    {
        popObjectListSet(pItem)
    }
}
export async function ItemGet(pItem)
{
    await this.core.util.waitUntil(0)
    
    checkBoxGet = checkBoxGet.bind(this)
    textBoxGet = textBoxGet.bind(this)
    comboBoxGet = comboBoxGet.bind(this)
    popInputBoxGet = popInputBoxGet.bind(this)
    popSelectBoxGet = popSelectBoxGet.bind(this)
    popTextListGet = popTextListGet.bind(this)
    popObjectListGet = popObjectListGet.bind(this)

    if(pItem.VIEW.TYPE == 'checkbox')
    {
        return checkBoxGet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'text')
    {
        return textBoxGet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'combobox')
    {
        return comboBoxGet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popInput')
    {
        return popInputBoxGet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popSelect')
    {
        return popSelectBoxGet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popTextList')
    {
        return popTextListGet(pItem)
    }
    else if(pItem.VIEW.TYPE == 'popObjectList')
    {
        return popObjectListGet(pItem)
    }
}