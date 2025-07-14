import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import NdButton from '../../../../core/react/devex/button.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import { NdForm,NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';

export default class posLottery extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.countDown = React.createRef()
        this.state = 
        {
            listItem : []
        }   
        this.btnLottery = this.btnLottery.bind(this)
    }
    async btnLottery()
    {
        let tmpArr = []
        let tmpPosDt = new datatable()
        tmpPosDt.selectCmd = 
        {
            query : "SELECT GUID,CUSTOMER_CODE,DEVICE,REF,CUSTOMER_GUID,CUSTOMER_NAME FROM POS_VW_01 WHERE CUSTOMER_NAME <> '' AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND STATUS = 1",
            param : ['FIRST_DATE:date','LAST_DATE:date'],
            value : [this.dtDate.startDate,this.dtDate.endDate]
        }
        await tmpPosDt.refresh()

        if(tmpPosDt.length > 0)
        {
            for (let i = 0; i < this.txtLucky.value; i++) 
            {
                let tmpRandIndex = this.getRandomInt(0,tmpPosDt.length - 1)
                if(i == 0)
                {
                    tmpArr.push(
                        <div key={"header"} className="row px-2 pt-2">
                            <div className="col-4"><p className="fs-4 text-center text-primary">{this.t("lblTicketNo")}</p></div>
                            <div className="col-4"><p className="fs-4 text-center text-primary">{this.t("lblCustomerNo")}</p></div>
                            <div className="col-4"><p className="fs-4 text-center text-primary">{this.t("lblCustomer")}</p></div>
                        </div>
                    )
                    this.setState({listItem:tmpArr})
                }
                await this.countDown.current.start(tmpPosDt[tmpRandIndex].CUSTOMER_NAME)
                await this.core.util.waitUntil(2000)

                this.setState({listItem:[]})

                tmpArr.push(
                    <div key={"item" + i} className="row px-2 pt-2">
                        <div className="col-4"><p className="fs-5 text-center text-succes">{tmpPosDt[tmpRandIndex].DEVICE + " - " + tmpPosDt[tmpRandIndex].REF}</p></div>
                        <div className="col-4"><p className="fs-5 text-center text-succes">{tmpPosDt[tmpRandIndex].CUSTOMER_CODE}</p></div>
                        <div className="col-4"><p className="fs-5 text-center text-succes">{tmpPosDt[tmpRandIndex].CUSTOMER_NAME}</p></div>
                    </div>
                )
                this.setState({listItem:tmpArr})

                let tmpInsertExtra = 
                {
                    query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                    "@CUSER = @PCUSER, " + 
                    "@TAG = 'LOTTERY', " +
                    "@POS_GUID = @PPOS_GUID, " +
                    "@LINE_GUID = '00000000-0000-0000-0000-000000000000', " +
                    "@DATA = '', " +
                    "@APP_VERSION = '', " +
                    "@DESCRIPTION = '' ", 
                    param : ['PCUSER:string|25','PPOS_GUID:string|50'],
                    value : [this.user.CODE,tmpPosDt[tmpRandIndex].GUID]
                }
                await this.core.sql.execute(tmpInsertExtra)

                let tmpInsertPoint = 
                {
                    query : "EXEC [dbo].[PRD_CUSTOMER_POINT_INSERT] " + 
                            "@GUID = @PGUID, " + 
                            "@CUSER = @PCUSER, " + 
                            "@TYPE = @PTYPE, " +
                            "@CUSTOMER = @PCUSTOMER, " +
                            "@DOC = @PDOC, " +
                            "@POINT = @PPOINT, " +
                            "@DESCRIPTION = 'LOTTERY' ", 
                    param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PCUSTOMER:string|50','PDOC:string|50','PPOINT:int'],
                    value : [datatable.uuidv4(),this.user.CODE,0,tmpPosDt[tmpRandIndex].CUSTOMER_GUID,tmpPosDt[tmpRandIndex].GUID,this.txtPoint.value]
                }
                console.log(1453)
                await this.core.sql.execute(tmpInsertPoint)
            }
            this.countDown.current.visible(false)
        }
    }
    getRandomInt(min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'clear',
                                        onClick: async () => 
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                App.instance.panel.closePage()
                                            }
                                        }
                                    }    
                                }/>
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={3} id="frmFilter">
                                <NdItem>
                                    <NdLabel text={this.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("txtLucky")} alignment="right" />
                                    <NdTextBox id="txtLucky" parent={this} simple={true} value={"1"}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("txtPoint")} alignment="right" />
                                    <NdTextBox id="txtPoint" parent={this} simple={true} value={"0"}/>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdButton text={this.t("btnLottery")} type="success" width="100%" 
                            onClick={this.btnLottery}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <CountDown ref={this.countDown}/>
                        </div>
                    </div>
                    <div>
                        {this.state.listItem}
                    </div>
                </ScrollView>
            </div>
        )
    }
}
import '../../../css/lotterycountdown.css';
export class CountDown extends React.PureComponent
{
    constructor()
    {
        super()

        this.core = App.instance.core;
        this.state =
        {
            text : "",
            visible : false
        }
    }
    async start(pText)
    {    
        this.setState({text:"Ready",visible:true})
        document.querySelector(".demo__text").style.animationPlayState = 'running'
        document.querySelector(".demo__numbers-path").style.animationPlayState = 'running'
        document.querySelector(".demo__colored-blocks-inner").style.animationPlayState = 'running'
        document.querySelector(".demo__colored-blocks-rotater").style.animationPlayState = 'running'
        document.querySelector(".demo__colored-blocks").style.animationPlayState = 'running'
        await this.core.util.waitUntil(1000)
        this.setState({text:pText,visible:true})
        await this.core.util.waitUntil(3000)
        document.querySelector(".demo__text").style.animationPlayState = 'paused'
        document.querySelector(".demo__numbers-path").style.animationPlayState = 'paused'
        document.querySelector(".demo__colored-blocks-inner").style.animationPlayState = 'paused'
        //document.querySelector(".demo__colored-blocks-rotater").style.animationPlayState = 'paused'
        document.querySelector(".demo__colored-blocks").style.animationPlayState = 'paused'            
        return new Promise(resolve => 
        {            
            resolve()
        })
    }
    visible(pVisible)
    {
        this.setState({visible:pVisible})
    }
    async componentDidMount()
    {
        document.querySelector(".demo__text").style.animationPlayState = 'paused'
        document.querySelector(".demo__numbers-path").style.animationPlayState = 'paused'
        document.querySelector(".demo__colored-blocks-inner").style.animationPlayState = 'paused'
        document.querySelector(".demo__colored-blocks-rotater").style.animationPlayState = 'paused'
        document.querySelector(".demo__colored-blocks").style.animationPlayState = 'paused'
    }
    render()
    {
        return (
            <div>
                <div className="demo" style={{visibility: this.state.visible ? 'visible' : 'hidden'}}>
                    <div className="demo__colored-blocks">
                        <div className="demo__colored-blocks-rotater">
                        <div className="demo__colored-block"></div>
                        <div className="demo__colored-block"></div>
                        <div className="demo__colored-block"></div>
                        </div>
                        <div className="demo__colored-blocks-inner"></div>
                        <div className="demo__text">{this.state.text}</div>
                    </div>
                    <div className="demo__inner">
                        <svg className="demo__numbers" viewBox="0 0 100 100">
                        <defs>
                            <path className="demo__num-path-1" d="M40,28 55,22 55,78"/>
                            <path className="demo__num-join-1-2" d="M55,78 55,83 a17,17 0 1,0 34,0 a20,10 0 0,0 -20,-10"/>
                            <path className="demo__num-path-2" d="M69,73 l-35,0 l30,-30 a16,16 0 0,0 -22.6,-22.6 l-7,7"/>
                            <path className="demo__num-join-2-3" d="M28,69 Q25,44 34.4,27.4"/>
                            <path className="demo__num-path-3" d="M30,20 60,20 40,50 a18,15 0 1,1 -12,19"/>
                        </defs>
                        <path className="demo__numbers-path" 
                        d="M-10,20 60,20 40,50 a18,15 0 1,1 -12,19 
                        Q25,44 34.4,27.4
                        l7,-7 a16,16 0 0,1 22.6,22.6 l-30,30 l35,0 L69,73 
                        a20,10 0 0,1 20,10 a17,17 0 0,1 -34,0 L55,83 
                        l0,-61 L40,28" />
                        </svg>
                    </div>
                </div>
            </div>
        )
    }
}