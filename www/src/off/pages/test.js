import React from 'react';
import NdTextBox from '../../core/react/devex/textbox.js';
import NdPopUp from '../../core/react/devex/popup.js';
import NdGrid from '../../core/react/devex/grid.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdDatePicker from '../../core/react/devex/datepicker.js';
import App from '../lib/app.js';
import { datatable } from '../../core/core.js';
import TextBox from 'devextreme-react/text-box';

export default class Test extends React.Component
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        //this.sysprm = this.param.
        //this.onSelectionChanged = this.onSelectionChanged.bind(this);
        //console.log(Button)
        
        //console.log(this.access.filter({ELEMENT:'txtSeri',USERS:this.user.CODE}))
        
        //console.log(this.param)
        //console.log(this.param.filter({ELEMENT:'txtSeri'}))

        //this.param.filter({ELEMENT:'txtSeri'}).setValue("112233");
        //this.param.filter({ELEMENT:'txtS'}).setValue({"KODU":"001"})
        //this.param.add({ID:"001",VALUE:"test"})
        //this.param.filter({ELEMENT_ID:'txtSeri'}).setValue()
        // this.access.filter({ELEMENT:'txtSeri',USERS:this.user.CODE}).setValue({"editable":true})
        // this.access.add({ID:"001",VALUE:"test"})
    }
    async componentDidMount() 
    {        
        //this.popgrid.show()

        this.core.socket.emit('devprint',"{TYPE:'PRINT',PATH:'C:\\\\Project\\\\piqoff\\\\plugins\\\\devprint\\\\repx\\\\test\\\\test.repx',DATA:[{KODU:'001'}]}",(pResult) => 
        {
            console.log(pResult)
            if(pResult.split('|')[0] != 'ERR')
            {
                var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                mywindow.onload = function() 
                {
                    mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                }   
            }
        });
        //this.txtSeri.value = "aa"
        //this.txtSira.value = "100"
        // await this.access.save()
        //await this.param.save()
        //console.log(this.param)
        //this.pop.show()
        // this.test.setState(
        //     {
        //         showBorders : true,
        //         width : '100%',
        //         height : '100%',
        //         selection : {mode:"multiple"}
        //     }
        // )
        
        // let source = 
        // {
        //     source : 
        //     {
        //         select : 
        //         {
        //             query : "SELECT * FROM USERS ",
        //         },
        //         update : 
        //         {
        //             query : "UPDATE USERS SET NAME = @NAME WHERE CODE = @CODE",
        //             param : ['CODE:string|25','NAME:string|25']
        //         },
        //         insert : 
        //         {
        //             query : "INSERT INTO USERS (CODE,NAME,PWD,ROLE,SHA,STATUS) VALUES (@CODE,@NAME,'','','',1) ",
        //             param : ['CODE:string|25','NAME:string|25']
        //         },
        //         sql : this.core.sql
        //     }
        // }
        // await this.test.dataRefresh(source);

        // let tmp = 
        // {
        //     source:
        //     {
        //         select : 
        //         {
        //             query : "SELECT CODE,NAME,GUID FROM USERS ",
        //         },
        //         sql : this.core.sql
        //     }
        // }
        // await this.sbDepo.dataRefresh(tmp)
    }
    render()
    {
        return (
            <div>
                Test
            </div>
        )
    }
}