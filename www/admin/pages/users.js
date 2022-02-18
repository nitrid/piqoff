import React from 'react';
import App from '../lib/app.js';
import NdGrid,{Column} from '../../core/react/devex/grid.js';
import NdSelectBox from '../../core/react/devex/selectbox.js';

export default class Users extends React.Component
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;

        this._cellRoleRender = this._cellRoleRender.bind(this)

        this.data = 
        {
            source: 
            {
                select : 
                {
                    query:"SELECT * FROM USERS"
                },                
                insert : 
                {
                    query : "EXEC [dbo].[PRD_USERS_INSERT] " + 
                            "@CODE = @PCODE, " + 
                            "@NAME = @PNAME, " + 
                            "@PWD = @PPWD, " + 
                            "@ROLE = @PROLE, " + 
                            "@STATUS = @PSTATUS ",
                    param : ['PGUID:string|50','PCODE:string|25','PNAME:string|50','PPWD:string|50','PROLE:string|25','PSTATUS:bit'],
                    dataprm : ['GUID','CODE','NAME','PWD','ROLE','STATUS']
                },
                update : 
                {
                    query : "EXEC [dbo].[PRD_USERS_UPDATE] " + 
                            "@GUID = @PGUID, " + 
                            "@CODE = @PCODE, " + 
                            "@NAME = @PNAME, " + 
                            "@PWD = @PPWD, " + 
                            "@ROLE = @PROLE, " + 
                            "@STATUS = @PSTATUS ", 
                    param : ['PGUID:string|50','PCODE:string|25','PNAME:string|50','PPWD:string|50','PROLE:string|25','PSTATUS:bit'],
                    dataprm : ['GUID','CODE','NAME','PWD','ROLE','STATUS']
                },
                delete : 
                {
                    query : "EXEC [dbo].[PRD_USERS_DELETE] " + 
                            "@GUID = @PGUID " ,
                    param : ['PGUID:string|50'],
                    dataprm : ['GUID']
                },
                sql : this.core.sql
            }
        }
    }
    _cellRoleRender(e)
    {
        let onValueChanged = function(data)
        {
            e.setValue(data.value)
        }
        return (
            <NdSelectBox 
                parent={this}                             
                id = "cmbRole"                             
                displayExpr = "NAME"                       
                valueExpr = "CODE"      
                defaultValue = {e.value}
                onValueChanged={onValueChanged}
                data={{source: {select : {query:"SELECT CODE,NAME FROM ROLE"},sql : this.core.sql}}}
            >
            </NdSelectBox>
        )
    }
    componentDidMount()
    {

    }
    render()
    {
        return(
            <div className="row p-2">
                <div className="col-12">
                <NdGrid id="user_list" parent={this} onSelectionChanged={this.onSelectionChanged} 
                    showBorders={true}
                    allowColumnResizing={true}
                    selection={{mode:"single"}} 
                    width={'100%'}
                    height={'100%'}
                    data={this.data}
                    filterRow={{visible:true}} headerFilter={{visible:true}}
                    param={this.param.filter({ELEMENT:'user_list',USERS:this.user.CODE})} 
                    access={this.access.filter({ELEMENT:'user_list',USERS:this.user.CODE})}
                    editing=
                    {
                        {
                            mode:"popup",
                            allowUpdating:true,
                            allowAdding:true,
                            allowDeleting:true,
                            popup:
                            {
                                title : "User Add",
                                showTitle:true,
                                dragEnabled:false,
                                position:{of:"#page"},
                                width:"50%",
                                height:"355px"
                            },
                            form:
                            {
                                items:
                                [
                                    {
                                        dataField:"CODE"
                                    },
                                    {
                                        dataField:"NAME"
                                    },
                                    {
                                        dataField:"PWD"
                                    },
                                    {
                                        dataField:"ROLE"
                                    },
                                    {
                                        dataField:"STATUS"
                                    }
                                ]
                            }
                        }
                    }
                > 
                <Column dataField="CODE" caption="CODE" />
                <Column dataField="NAME" caption="NAME" />
                <Column dataField="PWD" caption="PWD" visible={false}/>
                <Column dataField="ROLE" caption="ROLE" editCellRender={this._cellRoleRender} />
                <Column dataField="STATUS" caption="STATUS" dataType="boolean" />
                </NdGrid>
                </div>
            </div>
        )
    }
}