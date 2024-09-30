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
import NdHtmlEditor from '../../core/react/devex/htmlEditor';

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
function checkBoxBuild(pItem,pThis,pLang)
{
    let tmpCaption = pItem.VIEW.CAPTION

    if(typeof pLang != 'undefined' && typeof pItem.VIEW.CAPTION == 'object')
    {
        tmpCaption = pItem.VIEW.CAPTION[pLang]
    }
    
    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={tmpCaption} alignment="right" />
            <NdCheckBox id={pItem.ID} key={pItem.ID} parent={pThis}/>
        </Item>
    )
}
function checkBoxSet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'boolean')
        {
            pThis[pItem.ID].value = parseTry(pItem.VALUE)
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && typeof parseTry(pItem.VALUE).value == 'boolean')
        {
            pThis[pItem.ID].value = parseTry(pItem.VALUE).value
        }
    }
}
function checkBoxGet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof pItem.VALUE == 'boolean')
        {
            return pThis[pItem.ID].value
        }
        else if(typeof pItem.VALUE == 'object' && typeof pItem.VALUE.value == 'boolean')
        {
            return JSON.stringify({value : pThis[pItem.ID].value})
        }
    }
}
function textBoxBuild(pItem,pThis,pLang)
{
    let tmpCaption = pItem.VIEW.CAPTION

    if(typeof pLang != 'undefined' && typeof pItem.VIEW.CAPTION == 'object')
    {
        tmpCaption = pItem.VIEW.CAPTION[pLang]
    }

    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={tmpCaption} alignment="right" />
            <NdTextBox id={pItem.ID} key={pItem.ID} parent={pThis} simple={true}/>
        </Item>
    )
}
function textBoxSet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'string' || typeof parseTry(pItem.VALUE) == 'number')
        {
           pThis[pItem.ID].value = parseTry(pItem.VALUE)
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && (typeof parseTry(pItem.VALUE).value == 'string' || typeof parseTry(pItem.VALUE).value == 'number'))
        {
            pThis[pItem.ID].value = parseTry(pItem.VALUE).value
        }
    }
}
function textBoxGet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'string' || typeof parseTry(pItem.VALUE) == 'number')
        {
            return pThis[pItem.ID].value
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && (typeof parseTry(pItem.VALUE).value == 'string' || typeof parseTry(pItem.VALUE).value == 'number'))
        {
            return JSON.stringify({value : pThis[pItem.ID].value})
        }
    }
}
function comboBoxBuild(pItem,pThis,pLang)
{
    let tmpSource = {}
    if(Array.isArray(pItem.VIEW.DATA))
    {
        tmpSource = pItem.VIEW.DATA
    }
    else
    {
        tmpSource = pItem.VIEW.DATA
        tmpSource.sql = pThis.core.sql
    }

    let tmpCaption = pItem.VIEW.CAPTION

    if(typeof pLang != 'undefined' && typeof pItem.VIEW.CAPTION == 'object')
    {
        tmpCaption = pItem.VIEW.CAPTION[pLang]
    }

    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={tmpCaption} alignment="right" />
            <NdSelectBox id={pItem.ID} key={pItem.ID} parent={pThis} simple={true}
            displayExpr={pItem.VIEW.DISPLAY}                      
            valueExpr={pItem.VIEW.FIELD}
            data={{source:tmpSource}}
            />
        </Item>
    )
}
function comboBoxSet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'string' || typeof parseTry(pItem.VALUE) == 'number')
        {
            pThis[pItem.ID].value = parseTry(pItem.VALUE)
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && (typeof parseTry(pItem.VALUE).value == 'string' || typeof parseTry(pItem.VALUE).value == 'number'))
        {
            pThis[pItem.ID].value = parseTry(pItem.VALUE).value
        }
    }
}
function comboBoxGet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'string' || typeof parseTry(pItem.VALUE) == 'number')
        {
            return pThis[pItem.ID].value
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && (typeof parseTry(pItem.VALUE).value == 'string' || typeof parseTry(pItem.VALUE).value == 'number'))
        {
            return JSON.stringify({value : pThis[pItem.ID].value})
        }
    }
}
function htmlBoxBuild(pItem,pThis,pLang)
{
    let tmpCaption = pItem.VIEW.CAPTION

    if(typeof pLang != 'undefined' && typeof pItem.VIEW.CAPTION == 'object')
    {
        tmpCaption = pItem.VIEW.CAPTION[pLang]
    }

    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={tmpCaption} alignment="right" />
            <NdHtmlEditor id={pItem.ID} key={pItem.ID} parent={pThis} height={300}>
            </NdHtmlEditor>
        </Item>
    )
}
function popInputBuild(pItem,pThis,pLang)
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
                tmpItems.push(checkBoxBuild(tmpProp,pThis))
            }
            else if(pObj.type == 'text')
            {
                tmpItems.push(textBoxBuild(tmpProp,pThis))
            }
            else if(pObj.type == 'popObjectList')
            {
                tmpProp.VIEW.FORM = pObj.form
                tmpItems.push(popObjectListBuild(tmpProp,pThis))
            }
            else if(pObj.type == 'popInput')
            {
                tmpProp.VIEW.FORM = pObj.form
                tmpItems.push(popInputBuild(tmpProp,pThis))
            }
        })
        return tmpItems
    }

    let tmpCaption = pItem.VIEW.CAPTION

    if(typeof pLang != 'undefined' && typeof pItem.VIEW.CAPTION == 'object')
    {
        tmpCaption = pItem.VIEW.CAPTION[pLang]
    }

    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={tmpCaption} alignment="right" />
            <NdTextBox id={pItem.ID} key={pItem.ID} parent={pThis} simple={true} readOnly={true}
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
                                VALUE : pThis[pItem.ID].obj[pObj.field]
                            }
                            if(pObj.type == 'checkbox')
                            {
                                checkBoxSet(tmpProp,pThis)
                            }
                            else if(pObj.type == 'text')
                            {
                                textBoxSet(tmpProp,pThis)
                            }
                            else if(pObj.type == 'popObjectList')
                            {
                                popObjectListSet(tmpProp,pThis)
                            }
                            else if(pObj.type == 'popInput')
                            {         
                                tmpProp.VIEW = {DISPLAY : pObj.display}
                                popInputBoxSet(tmpProp,pThis)
                            }
                        })

                        pThis["popInput" + pItem.ID].show()
                    }
                }
            ]}/>
            <div>
                <NdPopUp parent={pThis} id={"popInput" + pItem.ID} container={"#root"}
                position={{of:'#root'}}
                showCloseButton={true}
                showTitle={true}
                title={tmpCaption}
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
                            <NdButton id={"btnPopInput" + pItem.ID} parent={pThis} text={"Kaydet"} type="default" width={'100%'}
                            onClick={()=>
                            {
                                let tmpData = {}
                                pItem.VIEW.FORM.item.map((pObj) => 
                                {          
                                    if(pObj.type == 'popObjectList')
                                    {
                                        tmpData[pObj.field] = pThis[pObj.id].obj
                                    }
                                    else if(pObj.type == 'popInput')
                                    {
                                        tmpData[pObj.field] = pThis[pObj.id].obj
                                    }
                                    else
                                    {
                                        tmpData[pObj.field] = pThis[pObj.id].value
                                    }
                                })
                                pThis[pItem.ID].obj = tmpData
                                if(typeof pItem.VIEW.DISPLAY != 'undefined')
                                {
                                    pThis[pItem.ID].value = pThis[pItem.ID].obj[pItem.VIEW.DISPLAY]
                                }

                                pThis["popInput" + pItem.ID].hide()
                            }}/>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        </Item>
    )
}
function popInputBoxSet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'object')
        {            
            pThis[pItem.ID].obj = parseTry(Object.assign({},pItem).VALUE)
            
            if(typeof pItem.VIEW.DISPLAY != 'undefined')
            {
                pThis[pItem.ID].value = pThis[pItem.ID].obj[pItem.VIEW.DISPLAY]
            }
        }
    }
}
function popInputBoxGet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'object')
        {
            return JSON.stringify(pThis[pItem.ID].obj)
        }
    }
}
function popSelectBuild(pItem,pThis,pLang)
{
    let tmpSource = {}
    if(Array.isArray(pItem.VIEW.FORM.data))
    {
        tmpSource = pItem.VIEW.FORM.data
    }
    else
    {
        tmpSource = pItem.VIEW.FORM.data
        tmpSource.sql = pThis.core.sql
    }

    let tmpCaption = pItem.VIEW.CAPTION

    if(typeof pLang != 'undefined' && typeof pItem.VIEW.CAPTION == 'object')
    {
        tmpCaption = pItem.VIEW.CAPTION[pLang]
    }

    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={tmpCaption} alignment="right" />
            <NdTextBox id={pItem.ID} key={pItem.ID} parent={pThis} simple={true} readOnly={true}
            button={
            [
                {
                    id:'01',
                    icon:'more',
                    onClick:async()=>
                    {
                        pThis["popSelect" + pItem.ID].show()
                        pThis["popSelect" + pItem.ID].onClick = async(data) =>
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
                <NdPopGrid id={"popSelect" + pItem.ID} parent={pThis} container={"#root"}
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
function popSelectBoxSet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'object')
        {
            pThis[pItem.ID].obj = parseTry(pItem.VALUE)

            if(typeof pItem.VIEW.DISPLAY != 'undefined')
            {
                pThis[pItem.ID].value = pThis[pItem.ID].obj[pItem.VIEW.DISPLAY]
            }
        }
        else
        {
            pThis[pItem.ID].obj = parseTry(pItem.VALUE)
            pThis[pItem.ID].value = parseTry(pItem.VALUE)
        }
    }
}
function popSelectBoxGet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'object')
        {
            return JSON.stringify(pThis[pItem.ID].obj)
        }
        else
        {
            return pThis[pItem.ID].obj
        }        
    }
}
function popTextListBuild(pItem,pThis,pLang)
{
    let tmpCaption = pItem.VIEW.CAPTION

    if(typeof pLang != 'undefined' && typeof pItem.VIEW.CAPTION == 'object')
    {
        tmpCaption = pItem.VIEW.CAPTION[pLang]
    }

    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={tmpCaption} alignment="right" />
            <NdTextBox id={pItem.ID} key={pItem.ID} parent={pThis} simple={true} readOnly={true}
            button={
            [
                {
                    id:'01',
                    icon:'more',
                    onClick:async()=>
                    {
                        pThis["txtPopTextList" + pItem.ID].value = pThis[pItem.ID].obj.join('\r\n');
                        pThis["popTextList" + pItem.ID].show()
                    }
                }
            ]}/>
            <div>
                <NdPopUp parent={pThis} id={"popTextList" + pItem.ID} container={"#root"}
                position={{of:'#root'}}
                showCloseButton={true}
                showTitle={true}
                title={pItem.VIEW.CAPTION}
                width={typeof pItem.VIEW.FORM.width == 'undefined' ? '600' : pItem.VIEW.FORM.width}
                height={typeof pItem.VIEW.FORM.height == 'undefined' ? '260' : pItem.VIEW.FORM.height}
                >
                    <div className='row pb-2'>
                        <div className='col-12'>
                            <NdTextArea id={"txtPopTextList" + pItem.ID} parent={pThis} height={pItem.VIEW.FORM.textHeight}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <NdButton id={"btnPopTextList" + pItem.ID} parent={pThis} text={"Kaydet"} type="default" width={'100%'}
                            onClick={()=>
                            {
                                pThis[pItem.ID].obj = pThis["txtPopTextList" + pItem.ID].value.trim().split(/\r?\n/)
                                pThis["popTextList" + pItem.ID].hide()
                            }}/>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        </Item>
    )
}
function popTextListSet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(Array.isArray(parseTry(pItem.VALUE)))
        {
            pThis[pItem.ID].obj = parseTry(pItem.VALUE)
            
            if(parseTry(pItem.VALUE).length > 0)
            {
                pThis[pItem.ID].value = parseTry(pItem.VALUE)[0]
            }
        }
    }
}
function popTextListGet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        return JSON.stringify(pThis[pItem.ID].obj)
    }
}
function popObjectListBuild(pItem,pThis,pLang)
{
    let tmpCaption = pItem.VIEW.CAPTION

    if(typeof pLang != 'undefined' && typeof pItem.VIEW.CAPTION == 'object')
    {
        tmpCaption = pItem.VIEW.CAPTION[pLang]
    }

    return (
        <Item key={pItem.ID} cssClass="form-label-bold">
            <Label text={tmpCaption} alignment="right" />
            <NdButton id={pItem.ID} key={pItem.ID} parent={pThis} text={"Giriş"} width={'100%'} type="default"
            onClick={async()=>
            {
                await pThis["popObjectListGrd" + pItem.ID].dataRefresh({source:pThis[pItem.ID].obj});
                pThis["popObjectList" + pItem.ID].show()
            }}/>
            <div>
                <NdPopUp parent={pThis} id={"popObjectList" + pItem.ID} container={"#root"}
                position={{of:'#root'}}
                showCloseButton={true}
                showTitle={true}
                title={pItem.VIEW.CAPTION}
                width={typeof pItem.VIEW.FORM.width == 'undefined' ? '600' : pItem.VIEW.FORM.width}
                height={typeof pItem.VIEW.FORM.height == 'undefined' ? '260' : pItem.VIEW.FORM.height}
                >
                    <div className='row pb-2'>
                        <div className='col-12'>
                            <NdGrid id={"popObjectListGrd" + pItem.ID} parent={pThis}
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
                            <NdButton id={"btnPopObjectListGrd" + pItem.ID} parent={pThis} text={"Kaydet"} type="default" width={'100%'}
                            onClick={()=>
                            {
                                pThis["popObjectList" + pItem.ID].hide()
                            }}/>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        </Item>
    )
}
function popObjectListSet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(Array.isArray(parseTry(pItem.VALUE)))
        {
            pThis[pItem.ID].obj = parseTry(Object.assign({},pItem).VALUE)
        }
    }
}
function popObjectListGet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        return JSON.stringify(pThis[pItem.ID].obj)
    }
}
function htmlEditorSet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'string' || typeof parseTry(pItem.VALUE) == 'number')
        {
            pThis[pItem.ID].value = parseTry(pItem.VALUE)
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && (typeof parseTry(pItem.VALUE).value == 'string' || typeof parseTry(pItem.VALUE).value == 'number'))
        {
            pThis[pItem.ID].value = parseTry(pItem.VALUE).value
        }
    }
}
function htmlEditorGet(pItem,pThis)
{
    if(typeof pThis[pItem.ID] != 'undefined')
    {
        if(typeof parseTry(pItem.VALUE) == 'string' || typeof parseTry(pItem.VALUE) == 'number')
        {
            return pThis[pItem.ID].value
        }
        else if(typeof parseTry(pItem.VALUE) == 'object' && (typeof parseTry(pItem.VALUE).value == 'string' || typeof parseTry(pItem.VALUE).value == 'number'))
        {
            return JSON.stringify({value : pThis[pItem.ID].value})
        }
    }
}
export function ItemBuild(pItem,pThis,pLang)
{
    if(typeof pItem.VIEW == 'undefined' || typeof pItem.VIEW.TYPE == 'undefined')
    {
        return
    }
    if(pItem.VIEW.TYPE == 'checkbox')
    {
        return checkBoxBuild(pItem,pThis,pLang)
    }
    else if(pItem.VIEW.TYPE == 'text')
    {
        return textBoxBuild(pItem,pThis,pLang)
    }
    else if(pItem.VIEW.TYPE == 'combobox')
    {
        return comboBoxBuild(pItem,pThis,pLang)
    }
    else if(pItem.VIEW.TYPE == 'popInput')
    {
        return popInputBuild(pItem,pThis,pLang)
    }
    else if(pItem.VIEW.TYPE == 'popSelect')
    {
        return popSelectBuild(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'popTextList')
    {
        return popTextListBuild(pItem,pThis,pLang)
    }
    else if(pItem.VIEW.TYPE == 'popObjectList')
    {
        return popObjectListBuild(pItem,pThis,pLang)
    }
    else if(pItem.VIEW.TYPE == 'html')
    {
        return htmlBoxBuild(pItem,pThis,pLang)
    }
    // else
    // {
    //     return <Item key={pItem.ID}> </Item>
    // }
}
export async function ItemSet(pItem,pThis)
{
    await pThis.core.util.waitUntil(0)  

    if(typeof pItem.VIEW == 'undefined' || typeof pItem.VIEW.TYPE == 'undefined')
    {
        return
    }

    if(pItem.VIEW.TYPE == 'checkbox')
    {
        checkBoxSet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'text')
    {
        textBoxSet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'combobox')
    {
        comboBoxSet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'popInput')
    {
        popInputBoxSet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'popSelect')
    {
        popSelectBoxSet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'popTextList')
    {
        popTextListSet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'popObjectList')
    {
        popObjectListSet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'html')
    {
        htmlEditorSet(pItem,pThis)
    }
}
export async function ItemGet(pItem,pThis)
{
    await pThis.core.util.waitUntil(0)

    if(typeof pItem.VIEW == 'undefined' || typeof pItem.VIEW.TYPE == 'undefined')
    {
        return
    }

    if(pItem.VIEW.TYPE == 'checkbox')
    {
        return checkBoxGet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'text')
    {
        return textBoxGet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'combobox')
    {
        return comboBoxGet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'popInput')
    {
        return popInputBoxGet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'popSelect')
    {
        return popSelectBoxGet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'popTextList')
    {
        return popTextListGet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'popObjectList')
    {
        return popObjectListGet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'popObjectList')
    {
        return popObjectListGet(pItem,pThis)
    }
    else if(pItem.VIEW.TYPE == 'html')
    {
        return htmlEditorGet(pItem,pThis)
    }
}