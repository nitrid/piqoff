import React from "react";
import App from "../lib/app.js";
import moment from 'moment';

import Form, { Label,Item, EmptyItem } from "devextreme-react/form";
import { ButtonGroup } from "devextreme-react/button-group";
import { Button } from "react-bootstrap";
import { LoadPanel } from 'devextreme-react/load-panel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from "../../core/react/devex/textbox.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";
import NbButton from "../../core/react/bootstrap/button.js";
import NdPopUp from "../../core/react/devex/popup.js";
import NbNumberboard from "../../core/react/bootstrap/numberboard.js";
import NbCalculator from "../tools/calculator.js";
import NbPopUp from "../../core/react/bootstrap/popup.js";
import NdDatePicker from "../../core/react/devex/datepicker.js";
import NdSelectBox from "../../core/react/devex/selectbox.js";
import NbPluButtonGrp from "../tools/plubuttongrp.js";
import NbPopNumber from "../tools/popnumber.js";
import NbPopNumberRate from "../tools/popnumberrate.js";
import NbRadioButton from "../../core/react/bootstrap/radiogroup.js";
import NbPosPopGrid from "../tools/pospopgrid.js";
import NbPopDescboard from "../tools/popdescboard.js";
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";
import NbLabel from "../../core/react/bootstrap/label.js";
import NdPosBarBox from "../tools/posbarbox.js";
import NdAcsDialog,{acsDialog} from "../../core/react/devex/acsdialog.js";
import NbKeyboard from "../../core/react/bootstrap/keyboard.js";
import IdleTimer from 'react-idle-timer'
import NdButton from "../../core/react/devex/button.js";
import NdAccessEdit from '../../core/react/devex/accesEdit.js';
import { NdLayout,NdLayoutItem } from '../../core/react/devex/layout';
import NdPopGrid from '../../core/react/devex/popgrid.js';

import { posCls,posSaleCls,posPaymentCls,posPluCls,posDeviceCls,posPromoCls,posExtraCls,posUsbTSECls} from "../../core/cls/pos.js";
import { posScaleCls,posLcdCls } from "../../core/cls/scale.js";
import { docCls} from "../../core/cls/doc.js"
import transferCls from "../lib/transfer.js";
import { promoCls } from "../../core/cls/promotion.js";
import { nf525Cls } from "../../core/cls/nf525.js";
import { customersCls } from "../../core/cls/customers.js";

import { dataset,datatable } from "../../core/core.js";
export default class posDoc extends React.PureComponent
{
    constructor()
    {
        super() 
        this.core = App.instance.core
        this.lang = App.instance.lang
        this.t = App.instance.lang.getFixedT(null,null,"pos")
        this.user = this.core.auth.data
        this.prmObj = App.instance.prmObj
        this.acsObj = App.instance.acsObj
        this.payType = App.instance.payType
        this.nf525 = new nf525Cls();
        this.isFirstOpen = false
        this.pricingListNo = 1
        // NUMBER İÇİN PARAMETREDEN PARA SEMBOLÜ ATANIYOR.
        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()

        this.posObj = new posCls()
        this.posDevice = new posDeviceCls();
        this.posScale = new posScaleCls();
        this.posLcd = new posLcdCls();
        this.parkDt = new datatable();        
        this.cheqDt = new datatable();
        this.lastPosDt = new datatable();
        this.lastPosSaleDt = new datatable();
        this.lastPosPayDt = new datatable();
        this.lastPosPromoDt = new datatable();  
        this.firm = new datatable();
        this.customerObj = new customersCls();
        this.rebatePosSaleDt = new datatable()
        this.rebatePosPayDt = new datatable()
        this.rebatePosDt = new datatable()
        
        this.promoObj = new promoCls();
        this.posPromoObj = new posPromoCls();

        this.loading = React.createRef();
        this.loadingPay = React.createRef();      
        this.scaleTimeout  

        this.state =
        {
            date:"00.00.0000",
            isPluEdit:false,
            isConnected:this.core.offline ? false : true,
            isFormation:false,
            keyboardVisibility: false // État initial pour la visibilité du clavier
        }   
        
        document.onkeydown = (e) =>
        {
            //EĞER FORMUN ÖNÜNDE POPUP YADA LOADING PANEL VARSA BARCODE TEXTBOX ÇALIŞMIYOR.
            if(document.getElementsByClassName("dx-overlay-wrapper").length > 0)
            {
                // if(e.key == "Enter")
                // {
                //     document.getElementById("Sound").play();
                // }
                return
            }
            
            this.txtBarcode.focus()
            if(e.which == 38) //UP
            {
                
            }
            else if(e.which == 40) //DOWN
            {
                
            }
            else if(e.which == 123) //F12
            {
                
            }
        }
        
        this.posDevice.on('scanner',(tmpBarkod)=>
        {
            if(document.getElementsByClassName("dx-overlay-wrapper").length > 0)
            {
                document.getElementById("Sound").play(); 
            }
            else
            {
                this.getItem(this.txtBarcode.value + tmpBarkod)
            }
        })
        
        this.core.socket.on('connect',async () => 
        {   
            if(!this.state.isConnected)
            {
                this.sendJet({CODE:"120",NAME:"Le système est online"}) ///Kasa offline dan online a döndü.                
                this.sendJet({CODE:"123",NAME:"Les saisies ont été enregistrés dans la base suite à online."}) ////Eldeki kayıtlar online a gönderildi.
                
                let tmpConfObj =
                {
                    id:'msgOnlineAlert',showTitle:true,title:this.lang.t("msgOnlineAlert.title"),showCloseButton:true,width:'650px',height:'220px',
                    button:[{id:"btn01",caption:this.lang.t("msgOnlineAlert.btn01"),location:'after'}],
                    content:(
                        <div>
                            <div className="row">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOnlineAlert.msg1")}</div>
                            </div>
                            <div className="row">
                                <div style={{textAlign:"center",fontSize:"20px",fontWeight:"bold",color:"red"}}>{this.lang.t("msgOnlineAlert.msg2")}</div>
                            </div>
                        </div>
                    )
                }
                await dialog(tmpConfObj);

                window.location.reload()
            }
            this.setState({isConnected:true})            
        })
        this.core.socket.on('connect_error',async(error) => 
        {
            this.setState({isConnected:false})
            this.transferStop()
        });
        this.core.socket.on('disconnect',async () => 
        {
            this.setState({isConnected:false})        
            //OFFLINE MODA DÖNDÜĞÜNDE EĞER EKRANDA KAYITLAR VARSA LOCAL DB YE GÖNDERİLİYOR
            for (let i = 0; i < this.posObj.dt("POS").length; i++) 
            {
                let tmpCtrl = await this.core.local.select({query:"SELECT * FROM POS_VW_01 WHERE GUID = ?;",values:[this.posObj.dt("POS")[i].GUID]})
                if(tmpCtrl.result.recordset.length > 0)
                {
                    Object.setPrototypeOf(this.posObj.dt("POS")[i],{stat:'edit'})
                }
                else
                {
                    Object.setPrototypeOf(this.posObj.dt("POS")[i],{stat:'new'})
                }
            }
            for (let i = 0; i < this.posObj.dt("POS_SALE").length; i++) 
            {
                if(this.posObj.dt("POS_SALE")[i].GUID != '00000000-0000-0000-0000-000000000000')
                {
                    let tmpCtrl = await this.core.local.select({query:"SELECT * FROM POS_SALE_VW_01 WHERE GUID = ?;",values:[this.posObj.dt("POS_SALE")[i].GUID]})
                
                    if(tmpCtrl.result.recordset.length > 0)
                    {
                        Object.setPrototypeOf(this.posObj.dt("POS_SALE")[i],{stat:'edit'})
                    }
                    else
                    {
                        Object.setPrototypeOf(this.posObj.dt("POS_SALE")[i],{stat:'new'})
                    }
                }
                else
                {
                    Object.setPrototypeOf(this.posObj.dt("POS_SALE")[i],{stat:''})
                }
            }
            for (let i = 0; i < this.posObj.dt("POS_PAYMENT").length; i++) 
            {
                let tmpCtrl = await this.core.local.select({query:"SELECT * FROM POS_PAYMENT_VW_01 WHERE GUID = ?;",values:[this.posObj.dt("POS_PAYMENT")[i].GUID]})
                if(tmpCtrl.result.recordset.length > 0)
                {
                    Object.setPrototypeOf(this.posObj.dt("POS_PAYMENT")[i],{stat:'edit'})
                }
                else
                {
                    Object.setPrototypeOf(this.posObj.dt("POS_PAYMENT")[i],{stat:'new'})
                }
            }
            for (let i = 0; i < this.posObj.dt("POS_EXTRA").length; i++) 
            {
                let tmpCtrl = await this.core.local.select({query:"SELECT * FROM POS_EXTRA_VW_01 WHERE GUID = ?;",values:[this.posObj.dt("POS_EXTRA")[i].GUID]})
                if(tmpCtrl.result.recordset.length > 0)
                {
                    Object.setPrototypeOf(this.posObj.dt("POS_EXTRA")[i],{stat:'edit'})
                }
                else
                {
                    Object.setPrototypeOf(this.posObj.dt("POS_EXTRA")[i],{stat:'new'})
                }
            }
            await this.posObj.save()
            //CHEQPAY AKTARIMI İÇİN ÖZEL YAPILDI.
            for (let i = 0; i < this.cheqDt.length; i++) 
            {
                let tmpCtrl = await this.core.local.select({query:`SELECT * FROM CHEQPAY_VW_01 WHERE GUID = '${this.cheqDt[i].GUID}'`})
                
                this.cheqDt.insertCmd = 
                {
                    local : 
                    {
                        type : "insert",
                        query : `INSERT INTO CHEQPAY_VW_01 (GUID, CDATE, CUSER, CUSER_NAME, LDATE, LUSER, LUSER_NAME, TYPE, DOC, CODE, AMOUNT, STATUS, REFERENCE, RANDOM1, 
                                PRICE, TICKET_TYPE, TICKET_NAME, RANDOM2, YEAR, EXDAY, TRANSFER)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                        values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                                LUSER_NAME : {map:'LUSER_NAME'},TYPE : {map:'TYPE'},DOC : {map:'DOC'},CODE : {map:'CODE'},AMOUNT : {map:'AMOUNT'},STATUS : {map:'STATUS'},REFERENCE : {map:'REFERENCE'},
                                RANDOM1 : {map:'RANDOM1'},PRICE : {map:'PRICE'},TICKET_TYPE : {map:'TICKET_TYPE'},TICKET_NAME : {map:'TICKET_NAME'},RANDOM2 : {map:'RANDOM2'},YEAR : {map:'YEAR'},
                                EXDAY : {map:'EXDAY'},TRANSFER : 1}]
                    }
                }
                this.cheqDt.updateCmd = 
                {
                    local : 
                    {
                        type : "update",
                        query : `UPDATE CHEQPAY_VW_01 SET CDATE=?, CUSER=?, CUSER_NAME=?, LDATE=?, LUSER=?, LUSER_NAME=?, TYPE=?, DOC=?, CODE=?, AMOUNT=?, STATUS=?, REFERENCE=?, 
                                RANDOM1=?, PRICE=?, TICKET_TYPE=?, TICKET_NAME=?, RANDOM2=?, YEAR=?, EXDAY=?, TRANSFER=? WHERE GUID=?;`,
                        values : [{CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                                 LUSER_NAME : {map:'LUSER_NAME'},TYPE : {map:'TYPE'},DOC : {map:'DOC'},CODE : {map:'CODE'},AMOUNT : {map:'AMOUNT'},STATUS : {map:'STATUS'},
                                 REFERENCE : {map:'REFERENCE'},RANDOM1 : {map:'RANDOM1'},PRICE : {map:'PRICE'},TICKET_TYPE : {map:'TICKET_TYPE'},TICKET_NAME : {map:'TICKET_NAME'},
                                 RANDOM2 : {map:'RANDOM2'},YEAR : {map:'YEAR'},EXDAY : {map:'EXDAY'},TRANSFER : 1,GUID : {map:'GUID'}}],
                    }
                }

                if(tmpCtrl.result.length > 0)
                {
                    let tmpQuery = 
                    {
                        type :  "update",
                        query : `UPDATE CHEQPAY_VW_01 SET GUID=?, CDATE=?, CUSER=?, CUSER_NAME=?, LDATE=?, LUSER=?, LUSER_NAME=?, TYPE=?, DOC=?, CODE=?, AMOUNT=?, STATUS=?, REFERENCE=?, RANDOM1=?, 
                                PRICE=?, TICKET_TYPE=?, TICKET_NAME=?, RANDOM2=?, YEAR=?, EXDAY=?, TRANSFER=? WHERE GUID=?;`,
                        values : [this.cheqDt[i].GUID,moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),this.cheqDt[i].CUSER,this.cheqDt[i].CUSER_NAME,moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),this.cheqDt[i].LUSER,
                                 this.cheqDt[i].LUSER_NAME,this.cheqDt[i].TYPE,this.cheqDt[i].DOC,this.cheqDt[i].CODE,this.cheqDt[i].AMOUNT,this.cheqDt[i].STATUS,
                                 this.cheqDt[i].REFERENCE,this.cheqDt[i].RANDOM1,this.cheqDt[i].PRICE,this.cheqDt[i].TICKET_TYPE,this.cheqDt[i].TICKET_NAME,
                                 this.cheqDt[i].RANDOM2,this.cheqDt[i].YEAR,this.cheqDt[i].EXDAY,0,this.cheqDt[i].GUID]
                    }
                    await this.core.local.update(tmpQuery)
                }
                else
                {
                    let tmpQuery = 
                    {
                        type : "insert",
                        query : `INSERT INTO CHEQPAY_VW_01 (GUID, CDATE, CUSER, CUSER_NAME, LDATE, LUSER, LUSER_NAME, TYPE, DOC, CODE, AMOUNT, STATUS, REFERENCE, RANDOM1, PRICE, TICKET_TYPE, 
                                TICKET_NAME, RANDOM2, YEAR, EXDAY, TRANSFER) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                        values : [this.cheqDt[i].GUID,moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),this.cheqDt[i].CUSER,this.cheqDt[i].CUSER_NAME,moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),this.cheqDt[i].LUSER,
                                this.cheqDt[i].LUSER_NAME,this.cheqDt[i].TYPE,this.cheqDt[i].DOC,this.cheqDt[i].CODE,this.cheqDt[i].AMOUNT,this.cheqDt[i].STATUS,
                                this.cheqDt[i].REFERENCE,this.cheqDt[i].RANDOM1,this.cheqDt[i].PRICE,this.cheqDt[i].TICKET_TYPE,this.cheqDt[i].TICKET_NAME,
                                this.cheqDt[i].RANDOM2,this.cheqDt[i].YEAR,this.cheqDt[i].EXDAY,0]                        
                    }
                    await this.core.local.insert(tmpQuery)
                }
            }
            await this.cheqDt.update()

            let tmpConfObj =
            {
                id:'msgOfflineAlert',showTitle:true,title:this.lang.t("msgOfflineAlert.title"),showCloseButton:true,width:'650px',height:'220px',
                button:[{id:"btn01",caption:this.lang.t("msgOfflineAlert.btn01"),location:'after'}],
                content:(
                    <div>
                        <div className="row">
                            <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOfflineAlert.msg1")}</div>
                        </div>
                        <div className="row">
                            <div style={{textAlign:"center",fontSize:"20px",fontWeight:"bold",color:"red"}}>{this.lang.t("msgOfflineAlert.msg2")}</div>
                        </div>
                    </div>
                )
            }
            await dialog(tmpConfObj);

            setTimeout(()=>{window.location.reload()},500)
            //*************************************************************************** */
        })
        this.core.socket.on('msgService',async(pParam,pCallback) =>
        {
            if(pParam.tag == 'msgPosDevice')
            {
                if(pParam.devices.length > 0 && typeof pParam.devices.find((item) => item == this.device.value) != 'undefined')
                {
                    let tmpConfObj =
                    {
                        id:'msgAdminMessage',showTitle:true,title:this.lang.t("msgAdminMessage.title"),showCloseButton:true,width:'500px',height:'250px',
                        button:[{id:"btn01",caption:this.lang.t("msgAdminMessage.btn01"),location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{pParam.msg}</div>)
                    }
                    
                    await dialog(tmpConfObj);
                }
            }
        })

        document.body.addEventListener('touchmove', function(e) 
        {
            e.preventDefault(); // Dokunmatik kaydırma olayını önle
        }, { passive: false });
        
        if(this.core.offline)
        {
            this.sendJet({CODE:"120",NAME:"Le système est offline."}) ///Kasa online dan offline a döndü.    
        }
    }
    async componentDidMount()
    {
        this.init();
    }
    toggleKeyboardVisibility()
    {
        this.setState(prevState => (
        {
            keyboardVisibility: !prevState.keyboardVisibility
        }));
    }
    async init()
    {
        this.loadingPay.current.instance.show()
        setInterval(()=>
        {
            this.lblTime.value = moment(new Date(),"HH:mm:ss").format("HH:mm:ss")
            this.lblDate.value = new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' })
        },1000)
        
        this.posObj.clearAll()        

        if(this.state.isFormation)
        {
            this.posObj.dt().selectCmd.query = "SELECT * FROM [dbo].[POS_FRM_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))"
        }
        else
        {
            this.posObj.dt().selectCmd.query = "SELECT * FROM [dbo].[POS_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))"
        }

        this.posObj.addEmpty()

        this.posObj.dt()[this.posObj.dt().length - 1].DOC_TYPE = 0
        this.posObj.dt()[this.posObj.dt().length - 1].DEPOT_GUID = '00000000-0000-0000-0000-000000000000'
        this.posObj.dt()[this.posObj.dt().length - 1].DEVICE = this.state.isFormation ? '9999' : window.localStorage.getItem('device') == null ? '' : window.localStorage.getItem('device')
        this.device.value = this.posObj.dt()[this.posObj.dt().length - 1].DEVICE
        
        if(this.posObj.dt()[this.posObj.dt().length - 1].DEVICE != '9999')
        {
            await this.posDevice.load({CODE:this.posObj.dt()[this.posObj.dt().length - 1].DEVICE})

            this.posObj.dt()[this.posObj.dt().length - 1].DEPOT_GUID = this.posDevice.dt()[0].DEPOT_GUID
            if(this.posDevice.dt().where({MACID:localStorage.getItem('macId') == null ? undefined : localStorage.getItem('macId')}).length > 0)
            {
                this.posScale = new posScaleCls(this.posDevice.dt()[0].SCALE_PORT)
                this.posLcd = new posLcdCls(this.posDevice.dt()[0].LCD_PORT)
            }
            else
            {
                if(this.core.util.isElectron())
                {
                    let tmpConfObj =
                    {
                        id:'msgMacIdFailed',showTitle:true,title:this.lang.t("msgMacIdFailed.title"),showCloseButton:true,width:'400px',height:'200px',
                        button:[{id:"btn01",caption:this.lang.t("msgMacIdFailed.btn01"),location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMacIdFailed.msg")}</div>)
                    }
                    
                    await dialog(tmpConfObj);
                    
                    this.core.auth.logout()
                    window.location.reload()
                }
            }
        }
        this.posDevice.scanner();

        //SON REF_NO VE SIGNATURE LOCALSTORE A YENIDEN SET EDILIYOR.
        this.nf525.lastSaleSignData(this.posObj.dt()[0]) 
        this.nf525.lastSaleFactSignData(this.posObj.dt()[0]) 
        //*********************************************************/
        //** CHEQ GETIR ********************************************/
        this.cheqDt.selectCmd = 
        {
            query : "SELECT *,ROW_NUMBER() OVER (ORDER BY LDATE ASC) AS NO FROM CHEQPAY_VW_01 WHERE DOC = @DOC ORDER BY CDATE DESC",
            param : ['DOC:string|50'], 
            value : [this.posObj.dt()[0].GUID],
            local : 
            {
                type : "select",
                query : "SELECT * FROM CHEQPAY_VW_01 WHERE DOC = ?;",
                values : [this.posObj.dt()[0].GUID]
            }
        }
        this.cheqDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_CHEQPAY_DELETE] @GUID = @PGUID, @DOC = @PDOC" ,
            param : ['PGUID:string|50','PDOC:string|50'], 
            dataprm : ['GUID','DOC'],
            local : 
            {
                type : "delete",
                query : "DELETE FROM CHEQPAY_VW_01 WHERE GUID = ? AND DOC = ?;",
                values : [{GUID : {map:'GUID'},DOC : {map:'DOC'}}]
            }
        }
        await this.cheqDt.refresh();  
        //******************************************************** */
        if(!this.isFirstOpen)
        {
            //********************************************************* */
            //** FIRMA GETIR ********************************************/
            this.firm.selectCmd = 
            {
                query : "SELECT TOP 1 * FROM COMPANY_VW_01",
                local : 
                {
                    type : "select",
                    query : "SELECT * FROM COMPANY_VW_01 LIMIT 1;",
                    values : []
                }
            }
            await this.firm.refresh();
            //******************************************************** */
           

            this.pricingListNo = this.prmObj.filter({ID:'PricingListNo',TYPE:0}).getValue()
            //ALMANYA TSE USB CİHAZLAR İÇİN YAPILDI
            if(this.prmObj.filter({ID:'TSEUsb',TYPE:0}).getValue() == true)
            {
                this.posUsbTSE = new posUsbTSECls();
                this.posUsbTSE.deviceId = this.posObj.dt()[this.posObj.dt().length - 1].DEVICE
                this.posUsbTSE.init()
                this.posUsbTSE.on('status',async(pStatus)=>
                {
                    if(!pStatus)
                    {
                        let tmpConfObj =
                        {
                            id:'msgTSENotFound',
                            showTitle:true,
                            title:this.lang.t("msgTSENotFound.title"),
                            showCloseButton:true,
                            width:'500px',
                            height:'200px',
                            button:[{id:"btn01",caption:this.lang.t("msgTSENotFound.btn01"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgTSENotFound.msg")}</div>)
                        }
                        await dialog(tmpConfObj);
                    }
                })
            }
            //*********************************** */
            this.isFirstOpen = true
            let tmpDetect = await this.posDevice.detectPort()
            if(tmpDetect.isElectron && tmpDetect.isData)
            {
                let tmpConfObj =
                {
                    id:'msgDeviceDetectAlert',showTitle:true,title:this.lang.t("msgDeviceDetectAlert.title"),showCloseButton:true,width:'400px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgDeviceDetectAlert.btn01"),location:'before'}],
                }

                if(!tmpDetect.isLcdPort)
                {
                    tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDeviceDetectAlert.msgLcd")}</div>)
                    await dialog(tmpConfObj);
                }
                else if(!tmpDetect.isPayPort)
                {
                    tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDeviceDetectAlert.msgPay")}</div>)
                    await dialog(tmpConfObj);
                }
                else if(!tmpDetect.isScalePort)
                {
                    tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDeviceDetectAlert.msgScale")}</div>)
                    await dialog(tmpConfObj);
                }
                else if(!tmpDetect.isScanPort)
                {
                    tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDeviceDetectAlert.msgScan")}</div>)
                    await dialog(tmpConfObj);
                }                
            }
            //DATA TRANSFER İŞLEMİ
            this.transfer = new transferCls();
            this.interval = null;
            
            this.transferStart();
            //DATA TRANSFER İÇİN EVENT.
            this.transfer.on('onState',(pParam)=>
            {
                if(pParam.tag == 'progress')
                {
                    this.transProgress.value = pParam.index + " / " + pParam.count
                }
                else
                {
                    this.msgTransfer2.value = pParam.text + " " + this.lang.t("popTransfer.msg3")
                }
            })
            //****************************** */
            this.sendJet({CODE:"80",NAME:"Démarrage terminal lancé."}) ////Kasa işleme başladı.
            //LOCAL DB DE KAYIT KONTROL EDİLİYOR.EĞER KAYIT VARSA ONLINE DB YE GÖNDERİLİYOR
            if(!this.core.offline && this.core.util.isElectron())
            {
                let tmpData = await this.core.local.select({name : "POS_VW_01",type : "select",query : "SELECT * FROM POS_VW_01"})
                if(tmpData.result.recordset.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'msgDataTransferAlert',showTitle:true,title:this.lang.t("msgDataTransferAlert.title"),showCloseButton:false,width:'650px',height:'220px',
                        button:[{id:"btn01",caption:this.lang.t("msgDataTransferAlert.btn01"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDataTransferAlert.msg1").replace('{0}',tmpData.result.recordset.length)}</div>)
                    }
                    await dialog(tmpConfObj);
                    this.loading.current.instance.show()
                    let tmpTransferResult = await this.transferLocal();
                    this.loading.current.instance.hide()
                    if(tmpTransferResult)
                    {
                        tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDataTransferAlert.msg2")}</div>)
                        await dialog(tmpConfObj);
                    }
                    else
                    {
                        tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDataTransferAlert.msg3")}</div>)
                        await dialog(tmpConfObj);
                    }
                    window.location.reload()
                }
            }
            //***************************************************************************** */
            this.core.util.logPath = "\\www\\log\\pos_" + this.posObj.dt()[this.posObj.dt().length - 1].DEVICE + ".txt"
            
            await this.grdList.dataRefresh({source:this.posObj.posSale.dt()});
            await this.grdPay.dataRefresh({source:this.posObj.posPay.dt()});
            await this.grdLastPos.dataRefresh({source:this.lastPosDt});
        }
        
        if(this.firm.length > 0)
        {
            this.posObj.dt()[this.posObj.dt().length - 1].FIRM = this.firm[0].GUID
            this.posObj.dt()[this.posObj.dt().length - 1].PRINT_DESCRIPTION = this.firm[0].PRINT_DESCRIPTION
        }      

        this.parkDt.selectCmd =
        {
            query : "SELECT GUID,LUSER_NAME,CONVERT(NVARCHAR,LDATE,104) + '-' + CONVERT(NVARCHAR,LDATE,108) AS LDATE,TOTAL, " + 
                    "ISNULL((SELECT TOP 1 DESCRIPTION FROM POS_EXTRA WHERE POS_GUID = POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01.GUID AND TAG = 'PARK DESC'),'') AS DESCRIPTION " +
                    "FROM POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01 WHERE STATUS = 0 AND (LUSER = @LUSER OR (@LUSER = '')) ORDER BY LDATE DESC",
            param : ["LUSER:string|25"],
            value : [this.core.auth.data.CODE],
            local : 
            {
                type : "select",
                query : "SELECT * FROM POS_VW_01 WHERE STATUS = ? AND LUSER = ? AND DELETED = ? ORDER BY LDATE DESC;",
                values : [0,this.core.auth.data.CODE,0]
            }
        }
        await this.parkDt.refresh();     
        
        setTimeout(() => 
        {
            this.posLcd.print
            ({
                blink : 0,
                text :  "Bonjour".space(20) + (moment(new Date()).format("DD.MM.YYYY") + '-' + 'PIQSOFT').space(20)
            })    
        }, 1000);
        this.core.util.writeLog("calcGrandTotal : 01")
        await this.calcGrandTotal(false) 

        if(this.posObj.dt()[this.posObj.dt().length - 1].DEVICE == '')
        {
            this.deviceEntry()
        }
        //PROMOSYON GETİR.
        await this.getPromoDb()
        //************************************************** */        
        this.loadingPay.current.instance.hide()
        for (let i = 0; i < this.parkDt.length; i++) 
        {            
            if(typeof this.parkDt[i].DESCRIPTION == 'undefined' || this.parkDt[i].DESCRIPTION == null || this.parkDt[i].DESCRIPTION == '')
            {         
                this.cheqDt.selectCmd.value = [this.parkDt[i].GUID] 
                this.cheqDt.selectCmd.local.values = [this.parkDt[i].GUID]
                await this.cheqDt.refresh();  
                await this.getDoc(this.parkDt[i].GUID)                 
                return
            }
        }             
    }
    async deviceEntry()
    {
        let tmpResult = await this.popNumber.show(this.lang.t("popTitleDevice"),window.localStorage.getItem('device') == null ? '' : window.localStorage.getItem('device'),false)
        if(typeof tmpResult == 'undefined' || tmpResult == '')
        {
            let tmpConfObj =
            {
                id:'msgDeviceEntryAlert',showTitle:true,title:this.lang.t("msgDeviceEntryAlert.title"),showCloseButton:true,width:'400px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgDeviceEntryAlert.btn01"),location:'before'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDeviceEntryAlert.msg")}</div>)
            }
            await dialog(tmpConfObj);
            this.deviceEntry()
            return
        }
        window.localStorage.setItem('device',tmpResult)
        window.location.reload()
    }
    async getDoc(pGuid)
    {
        return new Promise(async resolve => 
        {
            this.posObj.clearAll()
            await this.posObj.load({GUID:pGuid})
            if(this.posObj.posPay.dt().length > 0 && this.posObj.dt()[0].DEVICE != window.localStorage.getItem('device'))
            {
                let tmpConfObj =
                {
                    id:'msgDeviceChange',
                    showTitle:true,
                    title:this.lang.t("msgDeviceChange.title"),
                    showCloseButton:true,
                    width:'500px',
                    height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgDeviceChange.btn01"),location:'before'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDeviceChange.msg")  + ' ' + this.posObj.dt()[0].DEVICE}</div>)
                }
                
                await dialog(tmpConfObj);
                this.init()
                return
            }
            this.posObj.dt()[0].DEVICE = this.state.isFormation ? '9999' : window.localStorage.getItem('device')
            this.posObj.dt()[0].DOC_DATE =  moment(new Date()).format("YYYY-MM-DD"),            
            //PROMOSYON GETİR.
            await this.getPromoDb()
            this.promoApply()
            //************************************************** */
            this.cheqDt.selectCmd.value = [pGuid] 
            await this.cheqDt.refresh(); 
            this.core.util.writeLog("calcGrandTotal : 02")
            await this.calcGrandTotal(false)
            resolve();
        });        
    }
    getItemDb(pCode)
    {
        return new Promise(async resolve => 
        {
            console.log(pCode)
            if(pCode.replace(/^\s+/, '').replace(/\s+$/, '') == '')
            {
                resolve([])
                return
            } 
            let tmpDt = new datatable(); 
            tmpDt.selectCmd = 
            {
                query : "SELECT TOP 1 *,@CODE AS INPUT FROM ITEMS_POS_VW_01 WHERE CODE = @CODE OR BARCODE = @CODE AND STATUS = 1 ORDER BY UNIT_TYPE ASC",
                param : ['CODE:string|25'],
                value: [pCode],
                local : 
                {
                    type : "select",
                    query : "SELECT *, ? AS INPUT FROM ITEMS_POS_VW_01 WHERE CODE = ? OR BARCODE = ? AND STATUS = 1 LIMIT 1;",
                    values : [pCode,pCode,pCode]
                }
            }
            await tmpDt.refresh();            
            //UNIQ BARKOD
            if(tmpDt.length == 0)
            {
                tmpDt.selectCmd = 
                {
                    query : "SELECT TOP 1 *,@CODE AS INPUT FROM ITEMS_POS_VW_01 WHERE UNIQ_CODE = @CODE AND STATUS = 1 ORDER BY UNIT_FACTOR",
                    param : ['CODE:string|25'],
                    value: [pCode],
                    local : 
                    {
                        type : "select",
                        query : "SELECT *, ? AS INPUT FROM ITEMS_POS_VW_01 WHERE UNIQ_CODE = ? AND STATUS = 1 LIMIT 1;",
                        values : [pCode,pCode]
                    }
                }
                await tmpDt.refresh();
                //BURASI 7 HANELI UNIQLER BİTTİĞİNDE KALDIRILACAK //BAK
                if(tmpDt.length == 0 && pCode.length > 6)
                {
                    tmpDt.selectCmd = 
                    {
                        query : "SELECT TOP 1 *,@CODE AS INPUT FROM ITEMS_POS_VW_01 WHERE UNIQ_CODE = @CODE AND STATUS = 1",
                        param : ['CODE:string|25'],
                        value: [pCode.substring(pCode.lastIndexOf('F') + 1,pCode.length - 1)],
                        local : 
                        {
                            type : "select",
                            query : "SELECT *, ? AS INPUT FROM ITEMS_POS_VW_01 WHERE UNIQ_CODE = ? AND STATUS = 1 LIMIT 1;",
                            values : [pCode.substring(pCode.lastIndexOf('F') + 1,pCode.length - 1),pCode.substring(pCode.lastIndexOf('F') + 1,pCode.length - 1)]
                        }
                    }
                    await tmpDt.refresh();
                }
            }
            resolve(tmpDt)
        });
    }
    async getItem(pCode)
    {
        //SATIŞ İÇERİSİNDE ÜRÜN BUL
        if(this.btnItemSearch.lock)
        {
            let tmpItemSrcData = this.posObj.posSale.dt().where({INPUT:pCode})
            if(tmpItemSrcData.length > 0)
            {
                this.grdList.devGrid.navigateToRow(tmpItemSrcData[0])
                await this.core.util.waitUntil(200)
                this.grdList.devGrid.selectRowsByIndexes(this.grdList.devGrid.getRowIndexByKey(tmpItemSrcData[0]))    
            }

            this.txtBarcode.value = "";
            this.btnItemSearch.setUnLock({backgroundColor:"#0dcaf0",borderColor:"#0dcaf0",height:"100%",width:"100%"})
            return
        }

        this.txtBarcode.value = ""; 
        let tmpQuantity = 1
        let tmpPrice = 0
        let tmpPriceListNo = this.pricingListNo
        let tmpPriceListName = ""
        let tmpPriceListTag = ""
        //PARAMETREDE TANIMLI ÜRÜNLER İÇİN UYARI.
        await this.getItemWarning(pCode)
        
        if(pCode == '')
        {
            return
        }
        if(pCode.substring(0,1) == 'F')
        {
            pCode = pCode.substring(1,pCode.length)
        }
        if(pCode.substring(0,1) == '#')
        {
            pCode = pCode.substring(1,pCode.length)
        }
        
        //EĞER CARİ SEÇ BUTONUNA BASILDIYSA CARİ BARKODDAN SEÇİLECEK.
        if(this.btnGetCustomer.lock)
        {       
            //PRODORPLUS İÇİN YAPILDI. #CUSTOM1453# 
            // if(pCode.toString().substring(0,6) == "202012")
            // {
            //     pCode = pCode.toString().substring(0,6) + pCode.toString().substring(7,pCode.toString().length -1) 
            // }
            //************************ */

            let tmpCustomerDt = new datatable(); 
            tmpCustomerDt.selectCmd = 
            {
                query : "SELECT GUID,CUSTOMER_TYPE,NAME,LAST_NAME,CODE,TITLE,ADRESS,ZIPCODE,CITY,COUNTRY_NAME,STATUS,CUSTOMER_POINT,EMAIL,POINT_PASSIVE,PHONE1,TAX_NO,SIRET_ID, " +
                        "ISNULL((SELECT COUNT(TYPE) FROM CUSTOMER_POINT WHERE TYPE = 0 AND CUSTOMER = CUSTOMER_VW_02.GUID AND CONVERT(DATE,LDATE) = CONVERT(DATE,GETDATE())),0) AS POINT_COUNT " + 
                        "FROM [dbo].[CUSTOMER_VW_02] WHERE CODE LIKE SUBSTRING(@CODE,0,14) + '%' AND STATUS = 1",
                param : ['CODE:string|50'],
                local : 
                {
                    type : "select",
                    query : "SELECT * FROM CUSTOMER_VW_02 WHERE CODE LIKE SUBSTR(?, 0, 15) || '%' LIMIT 1;",
                    values : [pCode]
                }
            }
            tmpCustomerDt.selectCmd.value = [pCode]
            await tmpCustomerDt.refresh();

            if(tmpCustomerDt.length > 0)
            {
                if(tmpCustomerDt[0].POINT_COUNT > 3)
                {
                    let tmpConfObj =
                    {
                        id:'msgCustomerPointCount',showTitle:true,title:this.lang.t("msgCustomerPointCount.title"),showCloseButton:true,width:'450px',height:'250px',
                        button:[{id:"btn01",caption:this.lang.t("msgCustomerPointCount.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgCustomerPointCount.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCustomerPointCount.msg")}</div>)
                    }
                    let tmpConfResult = await dialog(tmpConfObj)
                    if(tmpConfResult == 'btn01')
                    {
                        let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:0})

                        if(!tmpResult)
                        {
                            return
                        }
                    }
                    else
                    {
                        return
                    }
                }
                this.posObj.dt()[0].CUSTOMER_GUID = tmpCustomerDt[0].GUID
                this.posObj.dt()[0].CUSTOMER_TYPE = tmpCustomerDt[0].CUSTOMER_TYPE
                this.posObj.dt()[0].CUSTOMER_CODE = tmpCustomerDt[0].CODE
                this.posObj.dt()[0].CUSTOMER_NAME = tmpCustomerDt[0].TITLE
                this.posObj.dt()[0].CUSTOMER_ADRESS = tmpCustomerDt[0].ADRESS
                this.posObj.dt()[0].CUSTOMER_ZIPCODE = tmpCustomerDt[0].ZIPCODE
                this.posObj.dt()[0].CUSTOMER_CITY = tmpCustomerDt[0].CITY
                this.posObj.dt()[0].CUSTOMER_COUNTRY = tmpCustomerDt[0].COUNTRY_NAME
                this.posObj.dt()[0].CUSTOMER_POINT = tmpCustomerDt[0].CUSTOMER_POINT
                this.posObj.dt()[0].CUSTOMER_POINT_PASSIVE = tmpCustomerDt[0].POINT_PASSIVE
                this.posObj.dt()[0].CUSTOMER_MAIL = tmpCustomerDt[0].EMAIL
                this.posObj.dt()[0].CUSTOMER_TAX_NO = tmpCustomerDt[0].TAX_NO
                this.posObj.dt()[0].CUSTOMER_SIRET = tmpCustomerDt[0].SIRET_ID

                if(this.prmObj.filter({ID:'mailControl',TYPE:0}).getValue() == true)
                {
                    if(this.posObj.dt()[0].CUSTOMER_MAIL == '')
                    {
                        await this.popAddMail.show()
                        this.txtNewCustomerName.value = tmpCustomerDt[0].NAME,
                        this.txtNewCustomerLastName.value = tmpCustomerDt[0].LAST_NAME,
                        this.txtNewPhone.value = tmpCustomerDt[0].PHONE1
                        this.txtNewMail.value = ''
                    }
                }

                let tmpLotteryDt = new datatable(); 
                tmpLotteryDt.selectCmd = 
                {
                    query : "SELECT * FROM " +
                            "(SELECT *, " +
                            "ISNULL((SELECT CUSTOMER_CODE FROM POS_VW_01 WHERE GUID = POS_GUID),'') AS CODE " +
                            "FROM POS_EXTRA_VW_01 WHERE TAG = 'LOTTERY') AS TMP " +
                            "WHERE CODE = @CODE AND DESCRIPTION = '' " ,
                    param : ['CODE:string|50'],
                    value : [this.posObj.dt()[0].CUSTOMER_CODE]
                }
                tmpLotteryDt.updateCmd = 
                {
                    query : "UPDATE POS_EXTRA SET DESCRIPTION = @DESCRIPTION WHERE GUID = @GUID",
                    param : ['DESCRIPTION:string|10','GUID:string|50'],
                    dataprm : ['DESCRIPTION','GUID']
                }
                
                await tmpLotteryDt.refresh()
                if(tmpLotteryDt.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'msgPreLottery',showTitle:true,title:this.lang.t("msgPreLottery.title"),showCloseButton:true,width:'450px',height:'200px',
                        button:[{id:"btn01",caption:this.lang.t("msgPreLottery.btn01"),location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPreLottery.msg")}</div>)
                    }
                    let tmpConfObjResult = await dialog(tmpConfObj)
                    if(tmpConfObjResult == 'btn01')
                    {
                        let tmpConfObj =
                        {
                            id:'msgPostLottery',showTitle:true,title:this.lang.t("msgPostLottery.title"),showCloseButton:true,width:'450px',height:'200px',
                            button:[{id:"btn01",caption:this.lang.t("msgPostLottery.btn01"),location:'before'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px", color:"red"}}>{this.lang.t("msgPostLottery.msg")}</div>)
                        }                       
                        await dialog(tmpConfObj)         
                    }
                    tmpLotteryDt[0].DESCRIPTION = '1'
                    await tmpLotteryDt.update()
                }
                //PROMOSYON GETİR.
                await this.getPromoDb()
                this.promoApply()
                //***************************************************/

                this.core.util.writeLog("calcGrandTotal : 03")
                await this.calcGrandTotal(true);
                this.btnGetCustomer.setUnLock({backgroundColor:"#0dcaf0",borderColor:"#0dcaf0",height:"100%",width:"100%"})
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgCustomerNotFound',
                    showTitle:true,
                    title:this.lang.t("msgCustomerNotFound.title"),
                    showCloseButton:true,
                    width:'500px',
                    height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgCustomerNotFound.btn01"),location:'before'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCustomerNotFound.msg")}</div>)
                }
                
                await dialog(tmpConfObj);
            }
            return;
        }
        //******************************************************** */
        //BARKOD X MİKTAR İŞLEMİ.
        if(pCode.indexOf("*") != -1)
        {
            if(pCode.split("*")[0] == "" || pCode.split("*")[0] == 0)
            {
                document.getElementById("Sound").play();
                let tmpConfObj =
                {
                    id:'msgZeroValidation',
                    showTitle:true,
                    title:this.lang.t("msgZeroValidation.title"),
                    showCloseButton:true,
                    width:'500px',
                    height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgZeroValidation.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgZeroValidation.msg")}</div>)
                }
                await dialog(tmpConfObj);
                return
            }
            tmpQuantity = pCode.split("*")[0];
            pCode = pCode.split("*")[1];

            if(pCode.substring(0,1) == 'F')
            {
                pCode = pCode.substring(1,pCode.length)
            }
        }
        //******************************************************** */
        //BARKOD DESENİ
        let tmpBarPattern = this.getBarPattern(pCode)
        console.log(tmpBarPattern)
        tmpPrice = typeof tmpBarPattern.price == 'undefined' || tmpBarPattern.price == 0 ? tmpPrice : tmpBarPattern.price
        tmpQuantity = typeof tmpBarPattern.quantity == 'undefined' || tmpBarPattern.quantity == 0 ? tmpQuantity : tmpBarPattern.quantity
        pCode = tmpBarPattern.barcode     
        //console.log("1 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))    
        this.loading.current.instance.show()
        //ÜRÜN GETİRME    
        let tmpItemsDt = await this.getItemDb(pCode)
        if(tmpItemsDt.length > 0)
        {     
            //TERAZİ DEN VERİ GELMEZ İSE KULLANICI ELLE MİKTAR GİRDİĞİNİ TUTAN ALAN
            tmpItemsDt[0].SCALE_MANUEL = false;
            //*********************************************************/
            //UNIQ BARKODU
            if(tmpItemsDt[0].UNIQ_CODE == tmpItemsDt[0].INPUT)
            {
                tmpQuantity = tmpItemsDt[0].UNIQ_QUANTITY
                tmpPrice = tmpItemsDt[0].UNIQ_PRICE
            }
            //*********************************************************/
            //BİRDEN FAZLA FİYAT LİSTESİ VARSA LİSTE SEÇİMİ SORULUYOR
            if(this.prmObj.filter({ID:'PricingListNoChoice',TYPE:0}).getValue())
            {
                let tmpPriceChoice = await this.priceListChoice(tmpItemsDt[0].GUID)
                if(tmpPriceChoice == -1)
                {
                    this.loading.current.instance.hide()
                    return;
                }
                else
                {
                    tmpPriceListNo = tmpPriceChoice
                }
            }
            //FIYAT GETİRME
            let tmpPriceDt = new datatable()
            tmpPriceDt.selectCmd = 
            {
                query : "SELECT dbo.FN_PRICE(@GUID,@QUANTITY,GETDATE(),@CUSTOMER,@DEPOT,@LIST_NO,0,1) AS PRICE, " + 
                        "ISNULL((SELECT TOP 1 NO FROM ITEM_PRICE_LIST WHERE NO = @LIST_NO),0) AS LIST_NO, " + 
                        "ISNULL((SELECT TOP 1 NAME FROM ITEM_PRICE_LIST WHERE NO = @LIST_NO),'') AS LIST_NAME, " +
                        "ISNULL((SELECT TOP 1 TAG FROM ITEM_PRICE_LIST WHERE NO = @LIST_NO),'') AS LIST_TAG",
                param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50','DEPOT:string|50','LIST_NO:int','GUID1:string|50'],
                local : 
                {
                    type : "select",
                    query : "SELECT * FROM ITEMS_POS_VW_01 AS ITEM " + 
                            "WHERE ITEM.GUID = ? LIMIT 1;",
                    values : [tmpItemsDt[0].GUID]
                }
            }
            tmpPriceDt.selectCmd.value = [tmpItemsDt[0].GUID,tmpQuantity * tmpItemsDt[0].UNIT_FACTOR,this.posObj.dt()[0].CUSTOMER_GUID,this.posObj.dt()[0].DEPOT_GUID,tmpPriceListNo,tmpItemsDt[0].GUID]
            await tmpPriceDt.refresh();  
            
            if(tmpPriceDt.length > 0 && tmpPrice == 0)
            {
                tmpPrice = tmpPriceDt[0].PRICE
                tmpPriceListName = tmpPriceDt[0].LIST_NAME
                tmpPriceListTag = tmpPriceDt[0].LIST_TAG
                //FİYAT GÖR
                if(this.btnInfo.lock)
                {
                    //PROMOSYON FIYATINI GETİRMEK İÇİN YAPILDI ********************************************************
                    let tmpInfoPrice = tmpPrice
                    let tmpPromoCond = this.promoObj.cond.dt().where({ITEM_GUID : tmpItemsDt[0].GUID})
                    if(tmpPromoCond.length > 0)
                    {
                        let tmpPromoApp = this.promoObj.app.dt().where({PROMO : tmpPromoCond[0].PROMO}).where({TYPE:5})
                        if(tmpPromoApp.length > 0)
                        {
                            tmpInfoPrice = tmpPromoApp[0].AMOUNT
                        }
                    }
                    //************************************************************************************************ */
                    let tmpConfObj =
                    {
                        id:'msgAlert',
                        showTitle:true,
                        title:this.lang.t("info"),
                        showCloseButton:true,
                        width:'500px',
                        height:'250px',
                        button:[{id:"btn01",caption:this.lang.t("btnOk"),location:'after'}],
                        content:(<div><h3 className="text-primary text-center">{tmpItemsDt[0].NAME}</h3><h3 className="text-danger text-center">{Number(tmpInfoPrice).round(2) + " " + Number.money.sign}</h3></div>)
                    }
                    await dialog(tmpConfObj);
                    this.btnInfo.setUnLock({backgroundColor:"#0dcaf0",borderColor:"#0dcaf0",height:"100%",width:"100%"})
                    this.loading.current.instance.hide()
                    return;
                }
                //**************************************************** */
            }
            //**************************************************** */
            //EĞER ÜRÜN TERAZİLİ İSE
            if(tmpItemsDt[0].WEIGHING)
            {
                this.loading.current.instance.hide()
                if(tmpPrice > 0)
                {
                    //TERAZİYE İSTEK YAPILIYOR.
                    let tmpWResult = await this.getWeighing(tmpPrice)
                    if(typeof tmpWResult != 'undefined')
                    {
                        if(typeof tmpWResult.Result == 'undefined')
                        {
                            tmpItemsDt[0].SCALE_MANUEL = true;
                            tmpQuantity = tmpWResult;
                        }
                        else
                        {
                            if(tmpWResult.Type == "02")
                            {
                                if(tmpWResult.Result.Scale > 0)
                                {
                                    tmpQuantity = tmpWResult.Result.Scale
                                }
                                else
                                {
                                    document.getElementById("Sound").play();
                                    let tmpConfObj =
                                    {
                                        id:'msgNotWeighing',showTitle:true,title:this.lang.t("msgNotWeighing.title"),showCloseButton:true,width:'400px',height:'200px',
                                        button:[{id:"btn01",caption:this.lang.t("msgNotWeighing.btn01"),location:'before'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgNotWeighing.msg")}</div>)
                                    }
                                    await dialog(tmpConfObj);
                                    return
                                }
                            }
                            else
                            {
                                document.getElementById("Sound").play();
                                let tmpConfObj =
                                {
                                    id:'msgNotWeighing',showTitle:true,title:this.lang.t("msgNotWeighing.title"),showCloseButton:true,width:'400px',height:'200px',
                                    button:[{id:"btn01",caption:this.lang.t("msgNotWeighing.btn01"),location:'before'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgNotWeighing.msg")}</div>)
                                }
                                await dialog(tmpConfObj);
                                return
                            }
                        }
                    }
                    else
                    {
                        return
                    }
                }
                else
                {   
                    //EĞER OKUTULAN BARKODUN FİYAT SIFIR İSE KULLANICIYA FİYAT 
                    let tmpResult = await this.popNumber.show(this.lang.t("price"),0,undefined,tmpItemsDt[0].NAME)
                    if(typeof tmpResult != 'undefined' && tmpResult != '')
                    {
                        //FIYAT DURUM KONTROLÜ
                        if(!(await this.priceCheck(tmpItemsDt[0],tmpResult)))
                        {
                            
                            if(typeof tmpWResult.Result == 'undefined')
                            {
                                tmpItemsDt[0].SCALE_MANUEL = true;
                                tmpQuantity = tmpWResult;
                            }
                            else
                            {
                                if(tmpWResult.Type == "02")
                                {
                                    if(tmpWResult.Result.Scale > 0)
                                    {
                                        tmpQuantity = tmpWResult.Result.Scale
                                    }
                                    else
                                    {
                                        document.getElementById("Sound").play();
                                        let tmpConfObj =
                                        {
                                            id:'msgNotWeighing',showTitle:true,title:this.lang.t("msgNotWeighing.title"),showCloseButton:true,width:'400px',height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("msgNotWeighing.btn01"),location:'before'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgNotWeighing.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                        return
                                    }
                                }
                                else
                                {
                                    document.getElementById("Sound").play();
                                    let tmpConfObj =
                                    {
                                        id:'msgNotWeighing',showTitle:true,title:this.lang.t("msgNotWeighing.title"),showCloseButton:true,width:'400px',height:'200px',
                                        button:[{id:"btn01",caption:this.lang.t("msgNotWeighing.btn01"),location:'before'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgNotWeighing.msg")}</div>)
                                    }
                                    await dialog(tmpConfObj);
                                    return
                                }
                            }
                        }

                        tmpPrice = tmpResult
                        //FİYAT GİRİLMİŞ İSE TERAZİYE İSTEK YAPILIYOR.
                        let tmpWResult = await this.getWeighing(tmpPrice)
                        if(typeof tmpWResult != 'undefined')
                        {
                            if(typeof tmpWResult.Result == 'undefined')
                            {
                                tmpItemsDt[0].SCALE_MANUEL = true;
                                tmpQuantity = tmpWResult;
                            }
                            else
                            {
                                if(tmpWResult.Type == "02")
                                {
                                    if(tmpWResult.Result.Scale > 0)
                                    {
                                        tmpQuantity = tmpWResult.Result.Scale
                                    }
                                    else
                                    {
                                        document.getElementById("Sound").play();
                                        let tmpConfObj =
                                        {
                                            id:'msgNotWeighing',showTitle:true,title:this.lang.t("msgNotWeighing.title"),showCloseButton:true,width:'400px',height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("msgNotWeighing.btn01"),location:'before'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgNotWeighing.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                        return
                                    }
                                }
                                else
                                {
                                    document.getElementById("Sound").play();
                                    let tmpConfObj =
                                    {
                                        id:'msgNotWeighing',showTitle:true,title:this.lang.t("msgNotWeighing.title"),showCloseButton:true,width:'400px',height:'200px',
                                        button:[{id:"btn01",caption:this.lang.t("msgNotWeighing.btn01"),location:'before'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgNotWeighing.msg")}</div>)
                                    }
                                    await dialog(tmpConfObj);
                                    return
                                }
                            }
                        }
                        else
                        {
                            
                            return
                        }
                    }
                    else
                    {
                        //POPUP KAPATILMIŞ İSE YADA FİYAT BOŞ GİRİLMİŞ İSE...
                        return
                    }
                }
            }
            //*****************************************************/
            //FİYAT TANIMSIZ YADA SIFIR İSE
            //*****************************************************/
            if(tmpPrice == 0)
            {
                this.loading.current.instance.hide()

                let tmpMsgResult = "btn01"
                if(this.prmObj.filter({ID:'PriceNotFoundAlert',TYPE:0}).getValue())
                {
                    let tmpConfObj =
                    {
                        id:'msgPriceNotFound',
                        showTitle:true,
                        title:this.lang.t("msgPriceNotFound.title"),
                        showCloseButton:false,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:this.lang.t("msgPriceNotFound.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgPriceNotFound.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPriceNotFound.msg")}</div>)
                    }
                    tmpMsgResult = await dialog(tmpConfObj);
                }
                
                if(tmpMsgResult == 'btn01')
                {
                    let tmpResult = await this.popNumber.show(this.lang.t("price"),0,undefined,tmpItemsDt[0].NAME)
                    if(typeof tmpResult != 'undefined' && tmpResult != '')
                    {
                        if(tmpResult == 0)
                        {
                            
                            return
                        }
                        //FIYAT DURUM KONTROLÜ
                        if(!(await this.priceCheck(tmpItemsDt[0],tmpResult)))
                        {
                            
                            return
                        }
                        tmpPrice = tmpResult
                    }
                    else
                    {
                        return
                    }
                }
                else if(tmpMsgResult == 'btn02')
                {
                    return
                }
            }
            //*****************************************************/
            tmpItemsDt[0].QUANTITY = tmpQuantity
            tmpItemsDt[0].PRICE = tmpPrice
            tmpItemsDt[0].LIST_NO = tmpPriceListNo
            tmpItemsDt[0].LIST_NAME = tmpPriceListName
            tmpItemsDt[0].LIST_TAG = tmpPriceListTag
            this.loading.current.instance.hide()
            this.saleAdd(tmpItemsDt[0])
        }
        else
        {
            this.loading.current.instance.hide()
            document.getElementById("Sound").play(); 
            let tmpConfObj =
            {
                id:'msgBarcodeNotFound',
                showTitle:true,
                title:this.lang.t("msgBarcodeNotFound.title"),
                showCloseButton:true,
                width:'500px',
                height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgBarcodeNotFound.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgBarcodeNotFound.msg")}</div>)
            }
            await dialog(tmpConfObj);
        }
        //*********************************************************/    
    }
    getWeighing(pPrice)
    {
        return new Promise(async resolve => 
        {                        
            this.msgWeighing.show().then(async (e) =>
            {
                if(e == 'btn01')
                {
                    let tmpResult = await this.popNumber.show(this.lang.t("quantity"),0)
                    if(typeof tmpResult != 'undefined' && tmpResult != '')
                    {
                        if(tmpResult <= 0)
                        {
                            let tmpConfObj =
                            {
                                id:'msgZeroValidation',
                                showTitle:true,
                                title:this.lang.t("msgZeroValidation.title"),
                                showCloseButton:true,
                                width:'500px',
                                height:'200px',
                                button:[{id:"btn01",caption:this.lang.t("msgZeroValidation.btn01"),location:'after'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgZeroValidation.msg")}</div>)
                            }
                            await dialog(tmpConfObj);
                            resolve()
                        }
                        else if(tmpResult >= 1000)
                        {
                            let tmpConfObj =
                            {
                                id:'msgMaxQuantity',
                                showTitle:true,
                                title:this.lang.t("msgMaxQuantity.title"),
                                showCloseButton:true,
                                width:'500px',
                                height:'200px',
                                button:[{id:"btn01",caption:this.lang.t("msgMaxQuantity.btn01"),location:'after'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMaxQuantity.msg")}</div>)
                            }
                            await dialog(tmpConfObj);
                            resolve()
                        }

                        resolve(tmpResult)
                    }
                    else
                    {
                        resolve()
                    }
                }
                else if(e == 'btn02')
                {
                    resolve()
                }
            })
            let tmpWeigh = await this.posScale.mettlerScaleSend(pPrice)
            if(typeof tmpWeigh != 'undefined' && tmpWeigh != null)
            {
                this.msgWeighing.hide()
                resolve(tmpWeigh)
            } 
            else
            {
                this.msgWeighing.hide()
                resolve()
            }
        });
    }
    getBarPattern(pBarcode)
    {
        pBarcode = pBarcode.toString().trim()
        let tmpPrm = this.prmObj.filter({ID:'BarcodePattern',TYPE:0}).getValue();
        
        if(typeof tmpPrm == 'undefined' || tmpPrm.length == 0)
        {               
            return {barcode:pBarcode}
        }
        //201234012550 0211234012550
        for (let i = 0; i < tmpPrm.length; i++) 
        {
            let tmpFlag = tmpPrm[i].substring(0,tmpPrm[i].indexOf('N'))
            console.log(tmpFlag)
            if(tmpFlag != '' && tmpPrm[i].length == pBarcode.length && pBarcode.substring(0,tmpFlag.length) == tmpFlag)
            {
                let tmpMoney = pBarcode.substring(tmpPrm[i].indexOf('M'),tmpPrm[i].lastIndexOf('M') + 1)
                let tmpMoneyFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('M'),tmpPrm[i].lastIndexOf('M') + 1)
                let tmpCent = pBarcode.substring(tmpPrm[i].indexOf('C'),tmpPrm[i].lastIndexOf('C') + 1)
                let tmpCentFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('C'),tmpPrm[i].lastIndexOf('C') + 1)
                let tmpKg = pBarcode.substring(tmpPrm[i].indexOf('K'),tmpPrm[i].lastIndexOf('K') + 1)
                let tmpKgFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('K'),tmpPrm[i].lastIndexOf('K') + 1)
                let tmpGram = pBarcode.substring(tmpPrm[i].indexOf('G'),tmpPrm[i].lastIndexOf('G') + 1)
                let tmpGramFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('G'),tmpPrm[i].lastIndexOf('G') + 1)
                let tmpCode = pBarcode.substring(tmpPrm[i].indexOf('N'),tmpPrm[i].lastIndexOf('N') + 1)

                console.log(tmpCode)
                let tmpSumFlag = ""
                let tmpSum = ""
                if(tmpPrm[i].indexOf('F') > -1)
                {
                    tmpSumFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('F'),tmpPrm[i].lastIndexOf('F') + 1)
                    tmpSum = pBarcode.substring(tmpPrm[i].indexOf('E'),tmpPrm[i].lastIndexOf('E') + 1)
                }
                else if(tmpPrm[i].indexOf('E') > -1)
                {
                    tmpSumFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('E'),tmpPrm[i].lastIndexOf('E') + 1)
                    tmpSum = pBarcode.substring(tmpPrm[i].indexOf('E'),tmpPrm[i].lastIndexOf('E') + 1)
                }
                
                let tmpFactory = 1
                if(tmpSumFlag == 'F')
                {
                    tmpFactory =  this.prmObj.filter({ID:'ScalePriceFactory',TYPE:0}).getValue()
                }

                if(this.prmObj.filter({ID:'BalanceUpdate',TYPE:0}).getValue())
                {
                    console.log(tmpSum)
                    let tmpQuery = {
                        query :"EXEC [dbo].[PRD_BALANCE_TRASFER] " +
                                "@T_CUSER = @P_CUSER, " + 
                                "@T_POS = @P_POS, " +
                                "@T_TICKET_NO = @P_TICKET_NO " ,
                        param : ['P_CUSER:string|50','P_POS:string|50','P_TICKET_NO:int',],
                        value : [this.core.auth.data.CODE,this.posObj.dt()[0].GUID,tmpSum]
                    }
                    console.log(tmpQuery.value)
                    this.core.sql.execute(tmpQuery)
                }

                let tmpBarkod = pBarcode.substring(0,tmpPrm[i].lastIndexOf('N') + 1) + tmpMoneyFlag + tmpCentFlag + tmpKgFlag + tmpGramFlag + tmpSumFlag

                if(pBarcode.length == 24)
                {
                    tmpBarkod = tmpCode
                    tmpBarkod = 'B'+tmpCode
                }
                console.log(tmpBarkod)
                return {
                    barcode : tmpBarkod,
                    price : parseFloat((tmpMoney == '' ? "0" : tmpMoney) + "." + (tmpCent == '' ? "0" : tmpCent)) * tmpFactory,
                    quantity : parseFloat((tmpKg == '' ? "0" : tmpKg) + "." + (tmpGram == '' ? "0" : tmpGram))
                }
            }
        }

        return {barcode : pBarcode}
    }
    getItemWarning(pBarcode)
    {
        return new Promise(async resolve => 
        {
            let tmpPrm = this.prmObj.filter({ID:'ItemsWarning',TYPE:0}).getValue();
            if(typeof tmpPrm == 'undefined' || tmpPrm.length == 0)
            {            
                resolve()
            }
            
            for(let i = 0; i < tmpPrm.length; i++) 
            {
                let tmpBar = tmpPrm[i].items.replace('M','').replace('M','').replace('M','')
                tmpBar = tmpBar.replace('C','').replace('C','').replace('C','')                
                tmpBar = tmpBar.replace('K','').replace('K','').replace('K','')
                tmpBar = tmpBar.replace('G','').replace('G','').replace('G','')
                tmpBar = tmpBar.replace('F','').replace('F','').replace('F','')
                
                if(tmpPrm[i].items.length == pBarcode.length && tmpBar == pBarcode.substring(0,tmpBar.length))
                {
                    let tmpConfObj =
                    {
                        id:'msgItemsWarningAlert',showTitle:true,title:tmpPrm[i].title,showCloseButton:true,width:'500px',height:'250px',
                        button:[{id:"btn01",caption:this.lang.t("btnOk"),location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"25px"}}>{tmpPrm[i].msg}</div>)
                    }
                    await dialog(tmpConfObj);
                    resolve()
                }
            }
            resolve()
        })
    }
    async calcGrandTotal(pSave)
    {
        return new Promise(async resolve => 
        {    
            clearTimeout(this.scaleTimeout)
            let tmpPayRest = 0;
            let tmpPayChange = 0;
            
            if(this.posObj.dt().length > 0)
            {   
                await this.core.util.waitUntil()
                               
                let tmpPosSale = this.posObj.posSale.dt().where({GUID:{'<>' : '00000000-0000-0000-0000-000000000000'}})  

                this.posObj.dt()[0].CDATE = moment(new Date()).utcOffset(0, true)
                this.posObj.dt()[0].LDATE = moment(new Date()).utcOffset(0, true)
                this.posObj.dt()[0].FAMOUNT = Number(parseFloat(tmpPosSale.sum('FAMOUNT',2)).round(2))
                this.posObj.dt()[0].AMOUNT = Number(parseFloat(tmpPosSale.sum('AMOUNT',2)).round(2))
                this.posObj.dt()[0].DISCOUNT = Number(parseFloat(tmpPosSale.sum('DISCOUNT',2)).round(2))
                this.posObj.dt()[0].LOYALTY = Number(parseFloat(tmpPosSale.sum('LOYALTY',2)).round(2))
                this.posObj.dt()[0].VAT = Number(parseFloat(tmpPosSale.sum('VAT',2)).round(2))
                this.posObj.dt()[0].TOTAL = Number(parseFloat(tmpPosSale.sum('TOTAL',2)).round(2))
                
                tmpPayRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).round(2)); 
                tmpPayChange = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) >= 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).round(2)) * -1
                
                this.core.util.writeLog("calcGrandTotal : " + tmpPayRest + " - " + tmpPayChange)
                
                this.customerName.value = this.posObj.dt()[0].CUSTOMER_NAME.toString()
                this.customerPoint.value = this.posObj.dt()[0].CUSTOMER_POINT
                this.popCustomerPoint.value = this.posObj.dt()[0].CUSTOMER_POINT
                this.popCustomerUsePoint.value = Number(parseFloat(this.posObj.dt()[0].LOYALTY * 100).round(0))
                this.popCustomerGrowPoint.value = Number(parseInt(this.customerPoint.value - Number(parseFloat(this.posObj.dt()[0].LOYALTY * 100).round(0))))                

                this.totalRowCount.value = tmpPosSale.length
                this.totalItemCount.value = tmpPosSale.sum('QUANTITY',2)
                this.totalLoyalty.value = this.posObj.dt()[0].LOYALTY
                this.totalSub.value = this.posObj.dt()[0].FAMOUNT
                this.totalVat.value = this.posObj.dt()[0].VAT
                this.totalDiscount.value = Number(this.posObj.dt()[0].DISCOUNT) * -1
                this.totalGrand.value = tmpPayRest
                this.disTotalSub.value = this.posObj.dt()[0].FAMOUNT
                this.disTotalVat.value = this.posObj.dt()[0].VAT
                this.disTotalDiscount.value = Number(this.posObj.dt()[0].DISCOUNT) * -1
                this.disTotalGrand.value = tmpPayRest
                this.popTotalGrand.value = this.posObj.dt()[0].TOTAL
                this.popCardTotalGrand.value = this.posObj.dt()[0].TOTAL
                this.popCashTotalGrand.value = this.posObj.dt()[0].TOTAL
                
                this.txtPopTotal.value = tmpPayRest
                this.txtPopCardPay.value = tmpPayRest
                this.txtPopCashPay.value = tmpPayRest
                
                this.payChange.value = tmpPayChange
                this.payRest.value = tmpPayRest
                this.payRest1.value = tmpPayRest
                this.payRest2.value = tmpPayRest
                this.payRest3.value = tmpPayRest

                this.cheqTotalAmount.value = this.cheqDt.sum('AMOUNT',2)
                this.txtTicRest.value = this.cheqDt.length + '/' + parseFloat(this.cheqTotalAmount.value).round(2) + ' ' + Number.money.sign
                this.cheqLastAmount.value = this.cheqDt.length > 0 ? this.cheqDt[0].AMOUNT : 0
                
                if(tmpPosSale.length > 0)
                {
                    setTimeout(() => 
                    {
                        if(this.grdList.devGrid.getKeyByRowIndex(0).WEIGHING)
                        {
                            let tmpLcdStr = ((this.grdList.devGrid.getKeyByRowIndex(0).SCALE_MANUEL ? 'M' : '') + parseFloat(Number(this.grdList.devGrid.getKeyByRowIndex(0).QUANTITY)).round(3).toFixed(3)).toString().space(7) + "kg" +
                            (parseFloat(Number(this.grdList.devGrid.getKeyByRowIndex(0).PRICE) - (Number(this.grdList.devGrid.getKeyByRowIndex(0).DISCOUNT) / Number(this.grdList.devGrid.getKeyByRowIndex(0).QUANTITY))).round(2).toFixed(2) + Number.money.code + "/kg").space(11,"s") +
                            this.grdList.devGrid.getKeyByRowIndex(0).ITEM_NAME.toString().space(9) + "=" +  (parseFloat(Number(this.grdList.devGrid.getKeyByRowIndex(0).TOTAL)).round(2).toFixed(2) + Number.money.code).space(10,"s")

                            this.posLcd.print({blink:0,text:tmpLcdStr})
                            App.instance.electronSend({tag:"lcd",digit:tmpLcdStr})
                        }
                        else
                        {
                            let tmpLcdStr = this.grdList.devGrid.getKeyByRowIndex(0).ITEM_NAME.toString().space(7) + Number(this.grdList.devGrid.getKeyByRowIndex(0).QUANTITY).toString().space(3,"s") + "X" +
                            (parseFloat(Number(this.grdList.devGrid.getKeyByRowIndex(0).PRICE) - (Number(this.grdList.devGrid.getKeyByRowIndex(0).DISCOUNT) / Number(this.grdList.devGrid.getKeyByRowIndex(0).QUANTITY))).round(2).toFixed(2) + Number.money.code).space(9,"s") +
                            ("TOTAL : " + (parseFloat(Number(this.grdList.devGrid.getKeyByRowIndex(0).TOTAL)).round(2).toFixed(2) + Number.money.code)).space(20,"s")

                            this.posLcd.print({blink:0,text:tmpLcdStr})
                            App.instance.electronSend({tag:"lcd",digit:tmpLcdStr})
                        }

                        this.scaleTimeout = setTimeout(() => 
                        {
                            let tmpLcdStr = this.grdList.devGrid.getKeyByRowIndex(0).ITEM_NAME.toString().space(9) + "=" +  (parseFloat(Number(this.grdList.devGrid.getKeyByRowIndex(0).TOTAL)).round(2).toFixed(2) + Number.money.code).space(10,"s") + 
                            ("TOTAL : " + (parseFloat(tmpPayRest).round(2).toFixed(2) + Number.money.code)).space(20,"s")

                            this.posLcd.print({blink:0,text:tmpLcdStr})
                            App.instance.electronSend({tag:"lcd",digit:tmpLcdStr})
                        }, 3000);
                    }, 100);                    
                }
            }            
            //HER EKLEME İŞLEMİNDEN SONRA İLK SATIR SEÇİLİYOR.
            await this.core.util.waitUntil(300)
            this.grdList.devGrid.getDataSource().store().load().done((res)=>
            {
                let tmpRes = res.data.sort(function(a, b) 
                {
                    var dateA = new Date(a.LDATE);
                    var dateB = new Date(b.LDATE);
                    return dateB - dateA;
                });
                
                this.grdList.devGrid.navigateToRow(tmpRes[0])
                this.grdList.devGrid.selectRows(tmpRes[0],false)
            })
            //**********************************************/
            //MÜŞTERİ BİLGİ EKRANINA VERİ GÖNDERİMİ.
            App.instance.electronSend(
            {
                tag : "lcd",
                data :
                {
                    posObj : JSON.parse(JSON.stringify(this.posObj.dt().toArray())),
                    posSaleObj : JSON.parse(JSON.stringify(this.posObj.dt("POS_SALE").toArray())),
                    grandTotal : tmpPayRest,
                    cheqLength : this.cheqDt.length,
                    cheqTotal : this.cheqTotalAmount.value,
                    totalItemQ : this.posObj.posSale.dt().where({GUID:{'<>' : '00000000-0000-0000-0000-000000000000'}}).sum('QUANTITY',2)
                }
            })
            //**********************************************/
            if(typeof pSave == 'undefined' || pSave)
            {
                let tmpClose = await this.saleClosed(true,tmpPayRest,tmpPayChange)
                let tmpSaveResult = await this.posObj.save()
                if(tmpSaveResult == 0)
                {
                    if(tmpClose)
                    {
                        if(!this.core.offline)
                        {
                            //KAYDIN DOĞRULUĞU KONTROL EDİLİYOR.EĞER BAŞARISIZ İSE STATUS SIFIR OLARAK UPDATE EDİLİYOR.
                            let tmpCheckResult = await this.checkSaleClose(this.posObj.dt()[0].GUID)
                            if(tmpCheckResult == false)
                            {
                                this.sendJet({CODE:"90",NAME:"Enregistrement échoué."}) /// Kayıt işlemi başarısız.
                                //KAYIT BAŞARISIZ İSE UYARI AÇILIYOR VE KULLANICI İSTERSE KAYIT İŞLEMİNİ TEKRARLIYOR
                                let tmpConfObj =
                                {
                                    id:'msgSaveFailAlert',showTitle:true,title:this.lang.t("msgSaveFailAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                                    button:[{id:"btn01",caption:this.lang.t("msgSaveFailAlert.btn01"),location:'before'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgSaveFailAlert.msg")}</div>)
                                }
                                await dialog(tmpConfObj)
                                window.location.reload()
                                resolve(false)
                                return
                            }
                            else
                            {
                                this.saleCloseSucces()
                                resolve(true)
                                return
                            }
                        }
                        else
                        {
                            this.saleCloseSucces()
                            resolve(true)
                            return
                        }
                    } 
                }
                else
                {
                    this.sendJet({CODE:"90",NAME:"Enregistrement échoué."}) /// Kayıt işlemi başarısız.
                    //KAYIT BAŞARISIZ İSE UYARI AÇILIYOR VE KULLANICI İSTERSE KAYIT İŞLEMİNİ TEKRARLIYOR
                    let tmpConfObj =
                    {
                        id:'msgSaveFailAlert',showTitle:true,title:this.lang.t("msgSaveFailAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                        button:[{id:"btn01",caption:this.lang.t("msgSaveFailAlert.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgSaveFailAlert.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgSaveFailAlert.msg")}</div>)
                    }
                    await dialog(tmpConfObj)
                    window.location.reload()
                    // if((await dialog(tmpConfObj)) == 'btn02')
                    // {
                    //     this.core.util.writeLog("calcGrandTotal : 04")
                    //     await this.calcGrandTotal()
                    // }
                    resolve(false)
                    return
                }
            }    
            resolve(true)
        });
    }
    calcSaleTotal(pPrice,pQuantity,pDiscount,pLoyalty,pVatRate)
    {
        let tmpAmount = isNaN(Number(Number(Number(pPrice) * Number(pQuantity)).round(5)).round(2)) ? 0 : Number(Number(Number(pPrice) * Number(pQuantity)).round(5)).round(2)
        let tmpFAmount = isNaN(Number(Number(Number(tmpAmount)) - Number(Number(pDiscount)).round(2))) ? 0 : Number(Number(Number(tmpAmount)) - Number(Number(pDiscount)).round(2))
        //let tmpFAmount = Number(parseFloat((pPrice * pQuantity) - (pDiscount)).round(2))
        tmpFAmount = isNaN(Number(Number(tmpFAmount - pLoyalty).round(2))) ? 0 : Number(Number(tmpFAmount - pLoyalty).round(2)) 
        let tmpVat = isNaN(Number(parseFloat(tmpFAmount - (tmpFAmount / ((pVatRate / 100) + 1))))) ? 0 : Number(parseFloat(tmpFAmount - (tmpFAmount / ((pVatRate / 100) + 1))))
        
        return {
            QUANTITY:pQuantity,
            PRICE:pPrice,
            FAMOUNT:Number(parseFloat(tmpFAmount - tmpVat)),
            AMOUNT:Number(parseFloat(tmpAmount).round(2)),
            DISCOUNT:Number(parseFloat(pDiscount).round(2)),
            LOYALTY:Number(parseFloat(pLoyalty).round(2)),
            VAT:tmpVat,
            TOTAL:Number(parseFloat(tmpFAmount).round(2))
        }
    }
    isRowMerge(pType,pData)
    {
        if(pType == 'SALE')
        {
            let tmpData = this.posObj.posSale.dt().where({ITEM_GUID:pData.GUID}).where({SUBTOTAL:0}).where({QUANTITY:{'>':0}}).where({PRICE:pData.PRICE}).where({PROMO_TYPE:{'<>':1}}).where({UNIT_FACTOR:pData.UNIT_FACTOR})
            if(tmpData.length > 0)
            {
                //UNIQ ÜRÜN İÇİN pData.INPUT == pData.UNIQ_CODE
                if(pData.SALE_JOIN_LINE == 0 && pData.WEIGHING == 0 && pData.INPUT != pData.UNIQ_CODE)
                {
                    return tmpData[0]
                }
            }
        }
        else if(pType == "PAY")
        {
            let tmpData = this.posObj.posPay.dt().where({PAY_TYPE:pData.TYPE})
            if(tmpData.length > 0)
            {
                return tmpData[0]
            }
        }

        return
    }    
    async saleAdd(pItemData)
    {
        let tmpRowData = this.isRowMerge('SALE',pItemData)
        //SATIR BİRLEŞTİR        
        if(typeof tmpRowData != 'undefined')
        {
            pItemData.QUANTITY = Number(parseFloat((pItemData.QUANTITY * pItemData.UNIT_FACTOR) + Number(tmpRowData.QUANTITY)).round(3))
            this.saleRowUpdate(tmpRowData,pItemData)
        }
        else
        {            
            pItemData.QUANTITY = Number(parseFloat(pItemData.QUANTITY * pItemData.UNIT_FACTOR).round(3))
            this.saleRowAdd(pItemData)                  
        }
    }
    async saleRowAdd(pItemData)
    {                
        let tmpCalc = this.calcSaleTotal(pItemData.PRICE,pItemData.QUANTITY,0,0,pItemData.VAT)
        let tmpMaxLine = this.posObj.posSale.dt().where({SUBTOTAL:{'<>':-1}}).max('LINE_NO')
        
        this.posObj.posSale.addEmpty()
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].NO = this.posObj.posSale.dt().length + 1
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].LDATE = moment(new Date()).utcOffset(0, true)
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].SAFE = ''
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DEPOT_GUID = this.posObj.dt()[0].DEPOT_GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DEPOT_CODE = ''
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DEPOT_NAME = ''
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].TYPE = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].CUSTOMER_GUID = this.posObj.dt()[0].CUSTOMER_GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].CUSTOMER_CODE = this.posObj.dt()[0].CUSTOMER_CODE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].CUSTOMER_NAME = this.posObj.dt()[0].CUSTOMER_NAME
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].LINE_NO = tmpMaxLine + 1
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ITEM_GUID = pItemData.GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ITEM_CODE = pItemData.CODE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ITEM_NAME = pItemData.NAME
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ITEM_SNAME = pItemData.SNAME
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].MIN_PRICE = pItemData.MIN_PRICE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].MAX_PRICE = pItemData.MAX_PRICE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].COST_PRICE = pItemData.COST_PRICE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].TICKET_REST = pItemData.TICKET_REST
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].WEIGHING = pItemData.WEIGHING
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].INPUT = pItemData.INPUT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].BARCODE_GUID = pItemData.BARCODE_GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].BARCODE = pItemData.BARCODE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_GUID = pItemData.UNIT_GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_NAME = pItemData.UNIT_NAME
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_SHORT = pItemData.UNIT_SHORT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_FACTOR = pItemData.UNIT_FACTOR,
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].LIST_NO = pItemData.LIST_NO
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].LIST_NAME = pItemData.LIST_NAME
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].LIST_TAG = pItemData.LIST_TAG
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].QUANTITY = pItemData.QUANTITY
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].PRICE = pItemData.PRICE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].FAMOUNT = tmpCalc.FAMOUNT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].AMOUNT = tmpCalc.AMOUNT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DISCOUNT = typeof pItemData.DISCOUNT == 'undefined' ? 0 : pItemData.DISCOUNT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].LOYALTY = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].VAT = tmpCalc.VAT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].VAT_RATE = pItemData.VAT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].VAT_TYPE = pItemData.VAT_TYPE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].TOTAL = tmpCalc.TOTAL
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].SUBTOTAL = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].PROMO_TYPE = (pItemData.INPUT == pItemData.UNIQ_CODE) ? 1 : 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].GRAND_AMOUNT = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].GRAND_DISCOUNT = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].GRAND_LOYALTY = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].GRAND_VAT = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].GRAND_TOTAL = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ORDER_GUID = typeof pItemData.POS_SALE_ORDER == 'undefined' ? '00000000-0000-0000-0000-000000000000' : pItemData.POS_SALE_ORDER
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].SCALE_MANUEL = pItemData.SCALE_MANUEL
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DELETED = false
        
        this.promoApply()
        this.core.util.writeLog("calcGrandTotal : 05")
        await this.calcGrandTotal();
    }
    async saleRowUpdate(pRowData,pItemData)
    { 
        //* MIKTARLI FİYAT GETİRME İŞLEMİ */
        if(pRowData.QUANTITY != pItemData.QUANTITY)
        {
            let tmpPriceDt = new datatable()
            tmpPriceDt.selectCmd = 
            {
                query : "SELECT dbo.FN_PRICE(@GUID,@QUANTITY,GETDATE(),@CUSTOMER,@DEPOT,@LIST_NO,0,1) AS PRICE, " + 
                        "ISNULL((SELECT TOP 1 NO FROM ITEM_PRICE_LIST WHERE NO = @LIST_NO),0) AS LIST_NO, " + 
                        "ISNULL((SELECT TOP 1 NAME FROM ITEM_PRICE_LIST WHERE NO = @LIST_NO),'') AS LIST_NAME, " +
                        "ISNULL((SELECT TOP 1 TAG FROM ITEM_PRICE_LIST WHERE NO = @LIST_NO),'') AS LIST_TAG",
                param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50','DEPOT:string|50','LIST_NO:int'],
                local : 
                {
                    type : "select",
                    query : "SELECT * FROM ITEMS_POS_VW_01 WHERE GUID = ? LIMIT 1;",
                    values : [pRowData.ITEM_GUID]
                }
            }     
            tmpPriceDt.selectCmd.value = [pRowData.ITEM_GUID,pItemData.QUANTITY,pRowData.CUSTOMER_GUID,pRowData.DEPOT_GUID,pRowData.LIST_NO]
            await tmpPriceDt.refresh();  
    
            pItemData.PRICE = tmpPriceDt.length > 0 && tmpPriceDt[0].PRICE > 0 ? tmpPriceDt[0].PRICE : pItemData.PRICE
            /************************************************************************************ */
        }

        let tmpCalc = this.calcSaleTotal(pItemData.PRICE,pItemData.QUANTITY,pRowData.DISCOUNT,pRowData.LOYALTY,pRowData.VAT_RATE)
        
        if(pRowData.PROMO_TYPE == 1)
        {
            let tmpConfObj =
            {
                id:'msgSpecialTicketAlert',showTitle:true,title:this.lang.t("msgSpecialTicketAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                button:[{id:"btn01",caption:this.lang.t("msgSpecialTicketAlert.btn01"),location:'before'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgSpecialTicketAlert.msg")}</div>)
            }
            await dialog(tmpConfObj);
            return
        }

        pRowData.LDATE = moment(new Date()).utcOffset(0, true)
        pRowData.QUANTITY = tmpCalc.QUANTITY
        pRowData.PRICE = tmpCalc.PRICE
        pRowData.FAMOUNT = tmpCalc.FAMOUNT
        pRowData.AMOUNT = tmpCalc.AMOUNT
        pRowData.DISCOUNT = tmpCalc.DISCOUNT
        pRowData.VAT = tmpCalc.VAT
        pRowData.TOTAL = tmpCalc.TOTAL
        pRowData.SCALE_MANUEL = pItemData.SCALE_MANUEL

        this.promoApply()
        this.core.util.writeLog("calcGrandTotal : 06")
        await this.calcGrandTotal();
    } 
    async saleClosed(pPrint,pPayRest,pPayChange)
    {               
        return new Promise(async resolve => 
        {
            await this.core.util.waitUntil()
            this.core.util.writeLog("saleClosed : " + pPayRest + " - " + this.posObj.dt().length + " - " + this.posObj.dt()[0].AMOUNT)
            if(pPayRest == 0 && this.posObj.dt().length > 0 && this.posObj.dt()[0].AMOUNT > 0 && this.posObj.dt()[0].AMOUNT > this.posObj.dt()[0].DISCOUNT) //FIYATSIZ VE MİKTAR SIFIR ÜRÜNLER İÇİN KONTROL EKLENDİ. BU ŞEKİLDE SATIŞIN KAPANMASI ENGELLENDİ.
            {
                setTimeout(() => 
                {
                    this.posLcd.print
                    ({
                        blink : 0,
                        text :  "A tres bientot".space(20) + "PIQSOFT".space(20)
                    })
                }, 500);
                
                this.posObj.dt()[0].STATUS = 1
                
                //***** TICKET İMZALAMA NF525 *****/
                let tmpSignedData = await this.nf525.signatureSale(this.posObj.dt()[0],this.posObj.posSale.dt())                
                this.posObj.dt()[0].REF = tmpSignedData.REF
                this.posObj.dt()[0].DOC_DATE = moment(new Date()).format("YYYY-MM-DD")
                this.posObj.dt()[0].SIGNATURE = tmpSignedData.SIGNATURE
                this.posObj.dt()[0].SIGNATURE_SUM = tmpSignedData.SIGNATURE_SUM
                let tmpSigned = "-"
                if(this.posObj.dt()[0].SIGNATURE != '')
                {
                    tmpSigned = this.posObj.dt()[0].SIGNATURE.substring(2,3) + this.posObj.dt()[0].SIGNATURE.substring(6,7) + this.posObj.dt()[0].SIGNATURE.substring(12,13) + this.posObj.dt()[0].SIGNATURE.substring(18,19)
                }
                this.posObj.dt()[this.posObj.dt().length - 1].CERTIFICATE = this.core.appInfo.name + " version : " + this.core.appInfo.version + " - " + this.core.appInfo.certificate + " - " + tmpSigned;
                //************************* */

                //ALMANYA TSE USB CİHAZLAR İÇİN YAPILDI.
                if(this.prmObj.filter({ID:'TSEUsb',TYPE:0}).getValue() == true)
                {
                    await this.posUsbTSE.transaction(tmpSignedData.SIGNATURE_SUM)
                    if(typeof this.posUsbTSE.lastTransaction != 'undefined' && this.posUsbTSE.lastTransaction.status)
                    {
                        this.posObj.dt()[0].SIGNATURE = this.posUsbTSE.lastTransaction.signature
                        //this.posObj.dt()[0].SIGNATURE_SUM = JSON.stringify(this.posObj.dt().toArray())
                    }
                    else
                    {
                        return
                    }
                }
                //***************************************/
                
                if(this.posObj.posPay.dt().length > 0)
                {
                    //this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT - pPayChange
                    this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = pPayChange
                    if(this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE == 3)
                    {
                        this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].TICKET_PLUS = pPayChange
                    }                    
                }
                
                this.popTotal.hide();
                this.popCashPay.hide();
                this.popExchangePay.hide();
                this.popCardPay.hide();
                this.popCheqpay.hide();
                this.popCardTicketPay.hide()
                //PROMOSYONDA HEDİYE ÇEKİ VARSA UYGULANIYOR
                if(this.posPromoObj.dt().where({APP_TYPE:2}).length > 0)
                {
                    this.posObj.dt()[0].REBATE_CHEQPAY = 'Q' + new Date().toISOString().substring(2, 10).replace('-','').replace('-','') + Math.round(Number(parseFloat(this.posPromoObj.dt().where({APP_TYPE:2})[0].APP_AMOUNT).round(2)) * 100).toString().padStart(5,'0') + Date.now().toString().substring(7,12);
                    await this.cheqpaySave(this.posObj.dt()[0].REBATE_CHEQPAY,this.posPromoObj.dt().where({APP_TYPE:2})[0].APP_AMOUNT,0,1);
                }
                //*****************************/
                if(pPayChange > 0)
                {
                    if(this.posObj.posPay.dt().length > 0 && this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE == 4)
                    {
                        this.posObj.dt()[0].REBATE_CHEQPAY = 'Q' + new Date().toISOString().substring(2, 10).replace('-','').replace('-','') + Math.round(Number(parseFloat(pPayChange).round(2)) * 100).toString().padStart(5,'0') + Date.now().toString().substring(7,12);
                        await this.cheqpaySave(this.posObj.dt()[0].REBATE_CHEQPAY,pPayChange,0,1);
                    }
                    else if(this.posObj.posPay.dt().where({TYPE:0}).length > 0)
                    {
                        if(this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE == 0 || this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE == 8)
                        {
                            let tmpConfObj =
                            {
                                id:'msgMoneyChange',
                                timeout:20000,
                                showTitle:true,
                                title:this.lang.t("msgMoneyChange.title"),
                                showCloseButton:true,
                                width:'500px',
                                height:'250px',
                                button:[{id:"btn01",caption:this.lang.t("msgMoneyChange.btn01"),location:'after'}],
                                content:(<div><h3 className="text-danger text-center">{Number(pPayChange).toFixed(2) + " " + Number.money.sign}</h3><h3 className="text-primary text-center">{this.lang.t("msgMoneyChange.msg")}</h3></div>)
                            }
                            dialog(tmpConfObj);
                        }
                    }
                } 
                if((typeof pPrint == 'undefined' || pPrint) && this.prmObj.filter({ID:'SaleClosePrint',TYPE:0}).getValue() == true)
                {       
                    if(this.prmObj.filter({ID:'SaleClosePrint',TYPE:0}).getValue() == true)
                    {
                        let tmpType = 'Fis'  
                        let tmpFactCert = ''                  
                        //FİŞ Mİ FATURAMI SORULUYOR
                        if(this.posObj.dt()[0].CUSTOMER_CODE != '' && this.posObj.dt()[0].CUSTOMER_TYPE == 1)
                        {
                            let tmpConfObj =
                            {
                                id:'msgPrintFacAlert',showTitle:true,title:this.lang.t("msgPrintFacAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                                button:[{id:"btn01",caption:this.lang.t("msgPrintFacAlert.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgPrintFacAlert.btn02"),location:'after'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPrintFacAlert.msg")}</div>)
                            }
                            if((await dialog(tmpConfObj)) == 'btn01')
                            {
                                tmpType = 'Fatura'
    
                                let tmpLastSignature = await this.nf525.signaturePosFactDuplicate(this.posObj.dt()[0])
    
                                let tmpInsertQuery = 
                                {
                                    query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                                            "@CUSER = @PCUSER, " + 
                                            "@TAG = @PTAG, " +
                                            "@POS_GUID = @PPOS_GUID, " +
                                            "@LINE_GUID = @PLINE_GUID, " +
                                            "@DATA =@PDATA, " +
                                            "@DATA_EXTRA1 = @PDATA_EXTRA1, " +
                                            "@APP_VERSION = @PAPP_VERSION, " +
                                            "@DESCRIPTION = @PDESCRIPTION ", 
                                    param : ['PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|max','PDATA_EXTRA1:string|max','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                                    value : [this.posObj.dt()[0].CUSER,"REPRINTFACT",this.posObj.dt()[0].GUID,"00000000-0000-0000-0000-000000000000",tmpLastSignature.SIGNATURE,tmpLastSignature.SIGNATURE_SUM,this.core.appInfo.version,'']
                                }
    
                                await this.core.sql.execute(tmpInsertQuery)
    
                                let tmpFactData = await this.factureInsert(this.posObj.dt(),this.posObj.posSale.dt())
                                let tmpSigned = "-"
    
                                if(tmpFactData.length > 0)
                                {
                                    if(tmpFactData[0].SIGNATURE != '')
                                    {
                                        tmpSigned = tmpFactData[0].SIGNATURE.substring(2,3) + tmpFactData[0].SIGNATURE.substring(6,7) + tmpFactData[0].SIGNATURE.substring(12,13) + tmpFactData[0].SIGNATURE.substring(18,19)
                                    }
    
                                    tmpFactCert = this.core.appInfo.name + " version : " + tmpFactData[0].APP_VERSION + " - " + this.core.appInfo.certificate + " - " + tmpSigned
                                }
                            }
                        }                    
                        //***************************************************/
                        let tmpData = 
                        {
                            pos : this.posObj.dt(),
                            possale : this.posObj.posSale.dt(),
                            pospay : this.posObj.posPay.dt(),
                            pospromo : this.posPromoObj.dt(),
                            firm : this.firm,
                            special : 
                            {
                                type: tmpType,
                                ticketCount:0,
                                reprint: 1,
                                repas: 0,
                                factCertificate : tmpFactCert,
                                dupCertificate : '',
                                customerUsePoint:this.popCustomerUsePoint.value,
                                customerPoint:this.customerPoint.value,
                                customerGrowPoint:this.popCustomerGrowPoint.value,
                                customerPointFactory : this.prmObj.filter({ID:'CustomerPointFactory',TYPE:0}).getValue()
                            }
                        }
                        //YAZDIRMA İŞLEMİNDEN ÖNCE KULLANICIYA SORULUYOR
                        if(this.prmObj.filter({ID:'PrintAlert',TYPE:0}).getValue() == true)
                        {
                            let tmpConfObj =
                            {
                                id:'msgPrintAlert',showTitle:true,title:this.lang.t("msgPrintAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                                button:[{id:"btn01",caption:this.lang.t("msgPrintAlert.btn01"),location:'before'},{id:"btn03",caption:this.lang.t("msgPrintAlert.btn03"),location:'before'},{id:"btn02",caption:this.lang.t("msgPrintAlert.btn02"),location:'after'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPrintAlert.msg")}</div>)
                            }
                            let pResult = await dialog(tmpConfObj);
                            if(pResult == 'btn01')
                            {
                                //POS_EXTRA TABLOSUNA YAZDIRMA BİLDİRİMİ GÖNDERİLİYOR                    
                                let tmpInsertQuery = 
                                {
                                    query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                                            "@CUSER = @PCUSER, " + 
                                            "@TAG = @PTAG, " +
                                            "@POS_GUID = @PPOS_GUID, " +
                                            "@LINE_GUID = @PLINE_GUID, " +
                                            "@DATA = @PDATA, " +
                                            "@DATA_EXTRA1 = @PDATA_EXTRA1, " +
                                            "@APP_VERSION = @PAPP_VERSION, " +
                                            "@DESCRIPTION = @PDESCRIPTION ", 
                                    param : ['PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|max','PDATA_EXTRA1:string|max','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                                    value : [this.posObj.dt()[0].CUSER,"REPRINT",this.posObj.dt()[0].GUID,"00000000-0000-0000-0000-000000000000","","",this.core.appInfo.version,""],
                                    local : 
                                    {
                                        type : "insert",
                                        query : `INSERT INTO POS_EXTRA_VW_01 (GUID, CUSER, TAG, POS_GUID, LINE_GUID, DATA, APP_VERSION, DESCRIPTION) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                                        values : [datatable.uuidv4(),this.posObj.dt()[0].CUSER,"REPRINT",this.posObj.dt()[0].GUID,"00000000-0000-0000-0000-000000000000","",this.core.appInfo.version,""]
                                    }
                                }
                                await this.core.sql.execute(tmpInsertQuery)
                                //***************************************************/
                                await this.print(tmpData,0)
                                if(this.posObj.dt()[0].CUSTOMER_MAIL != '')
                                {
                                    await this.print(tmpData,2)
                                }
                            }
                            else if(pResult == 'btn03')
                            {
                                    
                                this.mailPopup.tmpData = tmpData;
                                await this.mailPopup.show()
                            }
                        }
                        else
                        {
                            //POS_EXTRA TABLOSUNA YAZDIRMA BİLDİRİMİ GÖNDERİLİYOR                    
                            let tmpInsertQuery = 
                            {
                                query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                                        "@CUSER = @PCUSER, " + 
                                        "@TAG = @PTAG, " +
                                        "@POS_GUID = @PPOS_GUID, " +
                                        "@LINE_GUID = @PLINE_GUID, " +
                                        "@DATA = @PDATA, " +
                                        "@DATA_EXTRA1 = @PDATA_EXTRA1, " +
                                        "@APP_VERSION = @PAPP_VERSION, " +
                                        "@DESCRIPTION = @PDESCRIPTION ", 
                                param : ['PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|max','PDATA_EXTRA1:string|max','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                                value : [this.posObj.dt()[0].CUSER,"REPRINT",this.posObj.dt()[0].GUID,"00000000-0000-0000-0000-000000000000","","",this.core.appInfo.version,""],
                                local : 
                                {
                                    type : "insert",
                                    query : `INSERT INTO POS_EXTRA_VW_01 (GUID, CUSER, TAG, POS_GUID, LINE_GUID, DATA, APP_VERSION, DESCRIPTION) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                                    values : [datatable.uuidv4(),this.posObj.dt()[0].CUSER,"REPRINT",this.posObj.dt()[0].GUID,"00000000-0000-0000-0000-000000000000","",this.core.appInfo.version,""]
                                }
                            }
                            await this.core.sql.execute(tmpInsertQuery)
                            //***************************************************/
                            await this.print(tmpData,0)
                            if(this.posObj.dt()[0].CUSTOMER_MAIL != '')
                            {
                                await this.print(tmpData,2)
                            }
                        }
                        //***************************************************/
                    }
                }
                else
                {
                    if(this.posObj.dt()[0].CUSTOMER_GUID != '00000000-0000-0000-0000-000000000000' && this.posObj.dt()[0].CUSTOMER_MAIL != '')
                    {
                        let tmpData = 
                        {
                            pos : this.posObj.dt(),
                            possale : this.posObj.posSale.dt(),
                            pospay : this.posObj.posPay.dt(),
                            pospromo : this.posPromoObj.dt(),
                            firm : this.firm,
                            special : 
                            {
                                type: 'Fis',
                                ticketCount:0,
                                reprint: 1,
                                repas: 0,
                                factCertificate : '',
                                dupCertificate : '',
                                customerUsePoint:this.popCustomerUsePoint.value,
                                customerPoint:this.customerPoint.value,
                                customerGrowPoint:this.popCustomerGrowPoint.value,
                                customerPointFactory : this.prmObj.filter({ID:'CustomerPointFactory',TYPE:0}).getValue()
                            }
                        }
                        await this.print(tmpData,1,this.posObj.dt()[0].CUSTOMER_MAIL)
                    }
                }
                //TICKET REST. ALDIĞINDA KASA AÇMA İŞLEMİ 
                if(this.posObj.posPay.dt().where({PAY_TYPE:3}).length > 0)
                {
                    await this.posDevice.caseOpen();
                }
                //***************************************************/
                //POS_SALE DEKİ TÜM KAYITLARI TEKRAR SQL E DURUMU NEW OLARAK GÖNDERİYORUZ. PRD_POS_SALE_INSERT PROSEDÜRÜNÜN İÇERİSİNE UPDATE İŞLEMİNİ DE YERLEŞTİRDİK.
                // if (!this.core.offline)
                // {
                //     for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
                //     {
                //         Object.setPrototypeOf(this.posObj.posSale.dt()[i],{stat:'new'})
                //     }
                // }
                resolve(true)
            }
            else
            {
                resolve(false)
            }
        });
    }
    async saleCloseSucces()
    {
        localStorage.setItem('REF_SALE',this.posObj.dt()[0].REF)
        localStorage.setItem('SIG_SALE',this.posObj.dt()[0].SIGNATURE)

        //EĞER MÜŞTERİ KARTI İSE PUAN KAYIT EDİLİYOR.
        if(this.posObj.dt()[0].CUSTOMER_GUID != '00000000-0000-0000-0000-000000000000' && this.posObj.dt()[0].CUSTOMER_POINT_PASSIVE == false)
        {
            let tmpCustFact = (Number(this.prmObj.filter({ID:'CustomerPointFactory',TYPE:0}).getValue()) / 100)
            if(this.posObj.dt()[0].TYPE == 0)
            {
                if(Math.floor(this.posObj.dt()[0].TOTAL) > 0)
                {
                    let tmpPoint = Math.floor(Number(this.posObj.dt()[0].TOTAL) * tmpCustFact)
                    //PROMOSYONDA MÜŞTERİ PUANI VARSA EKLENİYOR.
                    if(this.posPromoObj.dt().where({APP_TYPE:1}).length > 0)
                    {
                        tmpPoint += this.posPromoObj.dt().where({APP_TYPE:1})[0].APP_AMOUNT
                    }
                    //**************************************** */
                    await this.customerPointSave(0,tmpPoint)
                }
                if(this.popCustomerUsePoint.value > 0)
                {
                    await this.customerPointSave(1,Number(parseFloat(this.posObj.dt()[0].LOYALTY * 100).round(0)))
                }
            }
            else
            {
                await this.customerPointSave(1,Math.floor(this.posObj.dt()[0].TOTAL * tmpCustFact))
            }                    
        }
        //POS_PROMO TABLOSUNA KAYIT EDİLİYOR.
        await this.posPromoObj.save()
        //******************************** */
        this.init()
    }
    async payAdd(pType,pAmount)
    {
        if(Number(this.payRest.value) > 0)
        {                    
            if(isNaN(Number(pAmount)) || Number(pAmount) == 0)
            {
                let tmpConfObj =
                {
                    id:'msgPayAmountAlert',showTitle:true,title:this.lang.t("msgPayAmountAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                    button:[{id:"btn01",caption:this.lang.t("msgPayAmountAlert.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPayAmountAlert.msg")}</div>)
                }
                await dialog(tmpConfObj);
                return
            }
            //KREDİ KARTI YADA TICKET REST. KARTI İSE
            if(pType == 1 || pType == 9)
            {
                if(pAmount > Number(this.payRest.value))
                {
                    let tmpConfObj =
                    {
                        id:'msgBigAmount',showTitle:true,title:this.lang.t("msgBigAmount.title"),showCloseButton:true,width:'500px',height:'250px',
                        button:[{id:"btn01",caption:this.lang.t("msgBigAmount.btn01"),location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgBigAmount.msg")}</div>)
                    }
                    await dialog(tmpConfObj);
                    this.txtPopCardPay.newStart = true;
                    this.txtPopCardPay.focus()
                    return
                }

                this.popCardPay.hide()
                this.popCardTicketPay.hide()
                let tmpPayCard = await this.payCard(pAmount)

                if(typeof tmpPayCard != 'undefined')
                {
                    if(tmpPayCard == 1) //Başarılı
                    {
                        this.msgCardPayment.hide()
                    }
                    else if(tmpPayCard == 2) //Zorla
                    {
                        let tmpConfObj =
                        {
                            id:'msgPayCheck',showTitle:true,title:this.lang.t("msgPayCheck.title"),showCloseButton:true,width:'500px',height:'250px',
                            button:[{id:"btn01",caption:this.lang.t("msgPayCheck.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgPayCheck.btn02"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPayCheck.msg")}</div>)
                        }
                        let tmpResult = await dialog(tmpConfObj);
                        if(tmpResult == "btn01")
                        {
                            this.msgCardPayment.hide()
                            //EĞER ALINAN ÖDEME TOPLAM TUTAR KADAR İSE KALAN ÖDEME SORULMUYOR.
                            if((Number(this.payRest.value) - pAmount) > 0)
                            {
                                let tmpResult2 = await this.msgRePaymentType.show()
                                if(tmpResult2 == "btn01")
                                {
                                    this.msgCardPayment.hide()
                                    this.popCashPay.show();
                                    this.txtPopCashPay.newStart = true;
                                }
                                else if(tmpResult2 == "btn02")
                                {
                                    this.msgCardPayment.hide()
                                    this.popCardPay.show();
                                    this.txtPopCardPay.newStart = true;
                                }
                                else if(tmpResult2 == "btn03")
                                {
                                    this.msgCardPayment.hide()
                                    this.popTotal.show();
                                    this.rbtnPayType.value = 2
                                }
                                else if(tmpResult2 == "btn04")
                                {
                                    this.msgCardPayment.hide()
                                    this.popCheqpay.show();
                                    this.txtPopCheqpay.focus()
                                }
                            }
                        }
                        else
                        {
                            this.payAdd(pType,pAmount)
                            return
                        }
                    }
                    else if(tmpPayCard == 3) //iptal
                    {
                        this.msgCardPayment.hide()
                        return                    
                    }
                    else //Başarısız veya İptal
                    {
                        this.msgCardPayment.hide()
                        return
                    }
                }
                else
                {
                    this.msgCardPayment.hide()
                    return
                }
            }

            this.loading.current.instance.show()
            let tmpRowData = this.isRowMerge('PAY',{TYPE:pType})
            //NAKİT ALDIĞINDA KASA AÇMA İŞLEMİ 
            if(pType == 0 || pType == 8)
            {
                this.posDevice.caseOpen();
            }            
            //SATIR BİRLEŞTİR        
            if(typeof tmpRowData != 'undefined')
            {    
                await this.payRowUpdate(tmpRowData,{AMOUNT:Number(parseFloat(Number(pAmount) + tmpRowData.AMOUNT).round(2)),CHANGE:0})
            }
            else
            {
                await this.payRowAdd({PAY_TYPE:pType,AMOUNT:pAmount,CHANGE:0})
            }            
            this.loading.current.instance.hide()
        }        
    }
    payRowAdd(pPayData)
    {
        return new Promise(async resolve => 
        {
            let tmpTypeName = ""
            let tmpMaxLine = this.posObj.posPay.dt().max('LINE_NO')

            if(this.payType.where({TYPE:pPayData.PAY_TYPE}).length > 0)
            {
                tmpTypeName = this.payType.where({TYPE:pPayData.PAY_TYPE})[0].NAME
            }
            
            this.posObj.posPay.addEmpty()
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE = pPayData.PAY_TYPE
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE_NAME = tmpTypeName
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].LINE_NO = tmpMaxLine + 1
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = Number(parseFloat(pPayData.AMOUNT).round(2))
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = pPayData.CHANGE
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].DELETED = false
            this.core.util.writeLog("calcGrandTotal : 07")
            await this.calcGrandTotal();
            resolve()
        });
    }
    payRowUpdate(pRowData,pPayData)
    {
        return new Promise(async resolve => 
        {
            pRowData.AMOUNT = pPayData.AMOUNT
            pRowData.CHANGE = pPayData.CHANGE
            this.core.util.writeLog("calcGrandTotal : 08")
            await this.calcGrandTotal();
            resolve()
        });
    }
    payCard(pAmount,pType)
    {
        return new Promise(async resolve => 
        {
            let tmpFn = () =>
            {
                this.txtPaymentPopTotal.value = pAmount
                
                this.msgCardPayment.show().then(async (e) =>
                {                    
                    if(e == 'btn01')
                    {
                        if(this.posDevice.payPort != null && this.posDevice.payPort.isOpen)
                        {
                            await this.posDevice.payPort.close()
                        }
                        this.msgCardPayment.hide();
                        resolve(await this.payCard(pAmount,pType)) // Tekrar
                    }
                    else if(e == 'btn02')
                    {
                        //HER TURLU CEVAP DÖNDÜÜ 0Ç0N POPUP KAPANIYOR YEN0DEN ACINCA 2. KEZ GÖNDERMEYE CALISIYOR BURAYA IPTAL DEYINCE CIHAZDANDA IPTAL ETMEYI YAPMAK LAZIM
                        let tmpAcsVal = this.acsObj.filter({ID:'btnDeviceEntry',USERS:this.user.CODE})
                                        
                        if(typeof tmpAcsVal.getValue().dialog != 'undefined' && tmpAcsVal.getValue().dialog.type != -1)
                        {   
                            let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:tmpAcsVal.getValue().dialog.type})

                            if(tmpResult)
                            {
                                if(this.posDevice.payPort != null && this.posDevice.payPort.isOpen)
                                {
                                    await this.posDevice.payPort.close()
                                }
                                this.msgCardPayment.hide();
                                resolve(3) // İptal
                            }
                            else
                            {
                                tmpFn()
                            }
                        }
                    }
                    else if(e == 'btn03')
                    {       
                        if(this.posDevice.payPort != null && this.posDevice.payPort.isOpen)
                        {
                            await this.posDevice.payPort.close()
                        }
                        this.msgCardPayment.hide();             
                        resolve(2) // Zorla
                    }
                })
            }
            
            tmpFn()
            
            let tmpCardPay = await this.posDevice.cardPayment(pAmount,pType)
            
            if(typeof tmpCardPay != 'undefined' && this.msgCardPayment.isShowed)
            {
                if(tmpCardPay.tag == "response")
                {
                    if(JSON.parse(tmpCardPay.msg).transaction_result != 0)
                    {
                        this.msgCardPayment.hide()
                        let tmpConfObj =
                        {
                            id:'msgPayFailed',showTitle:true,title:this.lang.t("msgPayFailed.title"),showCloseButton:true,width:'500px',height:'250px',
                            button:[{id:"btn01",caption:this.lang.t("msgPayFailed.btn01"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPayFailed.msg")}</div>)
                        }
                        await dialog(tmpConfObj);
                        resolve(0) // Başarısız
                    }
                    else
                    {
                        resolve(1) // Başarılı
                    }
                }
                // else if(tmpCardPay.tag == "net_error")
                // {
                //     let tmpConfObj =
                //     {
                //         id:'msgPayProcessFailed',showTitle:true,title:this.lang.t("msgPayProcessFailed.title"),showCloseButton:true,width:'500px',height:'250px',
                //         button:[{id:"btn01",caption:this.lang.t("msgPayProcessFailed.btn01"),location:'after'}],
                //         content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPayProcessFailed.msg")}</div>)
                //     }
                //     await dialog(tmpConfObj);
                // }
                else
                {
                    resolve(0) // Başarısız
                }
            }
            else
            {
                resolve()
            }
        });
    }
    descSave(pTag,pDesc,pLineGuid,pData)
    {
        if(typeof pData == 'undefined')
        {
            pData = ''
        }
        return new Promise(async resolve => 
        {
            let tmpDt = this.posObj.posExtra.dt().where({TAG:pTag})
            //LOCAL DB İÇİN YAPILDI
            if(this.core.offline)
            {
                this.posObj.dt()[0].DESCRIPTION = pDesc
                this.core.util.writeLog("calcGrandTotal : 09")
                await this.calcGrandTotal()
            }
            
            if(tmpDt.length > 0 && pTag == 'PARK DESC')
            {

                tmpDt[0].DESCRIPTION = pDesc
            }
            else
            {
                this.posObj.posExtra.addEmpty()
                this.posObj.posExtra.dt()[this.posObj.posExtra.dt().length - 1].TAG = pTag
                this.posObj.posExtra.dt()[this.posObj.posExtra.dt().length - 1].POS_GUID = this.posObj.dt()[this.posObj.dt().length - 1].GUID
                this.posObj.posExtra.dt()[this.posObj.posExtra.dt().length - 1].LINE_GUID = pLineGuid
                this.posObj.posExtra.dt()[this.posObj.posExtra.dt().length - 1].DESCRIPTION = pDesc
                this.posObj.posExtra.dt()[this.posObj.posExtra.dt().length - 1].DATA = pData
            }
            await this.posObj.save()
            resolve()
        });
    }
    async delete()
    {
        return new Promise(async resolve => 
        {
            this.posObj.dt().removeAt(0)
            let tmpSaveResult = await this.posObj.save()
            if(tmpSaveResult == 0)
            {
                this.init()
                resolve(true)
            }
            else
            {
                //KAYIT BAŞARISIZ İSE UYARI AÇILIYOR VE KULLANICI İSTERSE KAYIT İŞLEMİNİ TEKRARLIYOR
                let tmpConfObj =
                {
                    id:'msgSaveFailAlert',showTitle:true,title:this.lang.t("msgSaveFailAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                    button:[{id:"btn01",caption:this.lang.t("msgSaveFailAlert.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgSaveFailAlert.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgSaveFailAlert.msg")}</div>)
                }
                if((await dialog(tmpConfObj)) == 'btn02')
                {
                    resolve(await this.delete())
                }
            }
        })
    }
    async rowDelete()
    {
        return new Promise(async resolve => 
        {
            if(this.posObj.posSale.dt().length > 1)
            {
                let tmpData = this.grdList.devGrid.getSelectedRowKeys()[0]

                if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
                {                
                    this.grdList.devGrid.deleteRow(this.grdList.devGrid.getRowIndexByKey(this.grdList.devGrid.getSelectedRowKeys()[0]))
                }
                await this.posObj.posSale.dt().delete()
                this.promoApply()
                this.core.util.writeLog("calcGrandTotal : 10")
                await this.calcGrandTotal(true)

                let tmpLcdStr = tmpData.ITEM_NAME.toString().space(9) + "-" +  (parseFloat(Number(tmpData.TOTAL)).round(2).toFixed(2) + Number.money.code).space(10,"s") +
                ( "TOTAL : " + parseFloat(Number(this.posObj.dt()[0].TOTAL)).round(2).toFixed(2) + Number.money.code).space(20,"s")

                this.posLcd.print({blink : 0,text : tmpLcdStr})
                App.instance.electronSend({tag:"lcd",digit:tmpLcdStr})
                resolve()
            }
            else
            {
                resolve(await this.delete())
            }
        })
    }
    async cheqpayAdd(pCode)
    {
        let tmpDt = new datatable();
        let tmpType = 0
        let tmpStatus = 0
        let tmpAmount = 0
        let tmpPayType = 0;

        if(pCode == "")
        {
            return;
        }
        
        if(pCode.substring(0,1) == 'Q')         
        {
            tmpType = 1
            tmpStatus = 1
            tmpPayType = 4
            tmpAmount = Number(parseFloat(pCode.substring(7,12) / 100).round(2))

            tmpDt.selectCmd = 
            {
                query : "SELECT *,DATEDIFF(DAY,CDATE,GETDATE()) AS EXDAY FROM CHEQPAY_VW_01 WHERE CODE = @CODE AND TYPE = 1",
                param : ['CODE:string|50'],
                value : [pCode],
                local : 
                {
                    type : "select",
                    query : "SELECT * FROM CHEQPAY_VW_01 WHERE CODE = ? AND TYPE = 1;",
                    values: [pCode]
                }
            }     

            if(this.posObj.posPay.dt().where({TYPE:0}).length > 0)
            {
                this.txtPopCheqpay.value = "";
                document.getElementById("Sound").play(); 
                this.txtPopCheqpay.focus();

                let tmpConfObj =
                {
                    id:'msgBonDavoir',showTitle:true,title:this.lang.t("msgBonDavoir.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgBonDavoir.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgBonDavoir.msg")}</div>)
                }
                await dialog(tmpConfObj);                
                return;
            }
        }
        else if(pCode.length >= 20 && pCode.length <= 24)
        {   
            tmpType = 0
            tmpStatus = 0            
            tmpPayType = 3

            let tmpTicket = pCode.substring(11,16)
            let tmpYear = pCode.substring(pCode.length - 1, pCode.length);
            let tmpCtrlCode = pCode.substring(16,17)

            if(tmpCtrlCode != '1' && tmpCtrlCode != '2' && tmpCtrlCode != '3' && tmpCtrlCode != '4')
            {
                this.txtPopCheqpay.value = "";
                document.getElementById("Sound").play(); 
                this.txtPopCheqpay.focus();

                let tmpConfObj =
                {
                    id:'msgInvalidTicket',showTitle:true,title:this.lang.t("msgInvalidTicket.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgInvalidTicket.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgInvalidTicket.msg")}</div>)
                }
                await dialog(tmpConfObj);
                return
            }

            if(pCode.length == 22)
            {
                tmpTicket = pCode.substring(9,14)
            }    
            tmpAmount = Number(parseFloat(tmpTicket / 100).round(2))
            tmpYear = (parseInt(parseFloat(moment(new Date(),"YY").format("YY")) / 10) * 10) + parseInt(tmpYear)

            if(moment(new Date()).diff(moment('20' + tmpYear + '0101'),"day") > 416 || moment(new Date()).diff(moment('20' + tmpYear + '0101'),"day") < -365)
            {
                this.txtPopCheqpay.value = "";
                document.getElementById("Sound").play(); 
                this.txtPopCheqpay.focus(); 

                let tmpConfObj =
                {
                    id:'msgInvalidTicket',showTitle:true,title:this.lang.t("msgInvalidTicket.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgInvalidTicket.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgInvalidTicket.msg")}</div>)
                }
                await dialog(tmpConfObj);
                return;
            }

            if(tmpAmount > 21)
            {
                this.txtPopCheqpay.value = "";
                document.getElementById("Sound").play(); 
                this.txtPopCheqpay.focus();

                let tmpConfObj =
                {
                    id:'msgInvalidTicket',showTitle:true,title:this.lang.t("msgInvalidTicket.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgInvalidTicket.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgInvalidTicket.msg")}</div>)
                }
                await dialog(tmpConfObj);
                return;
            }

            tmpDt.selectCmd = 
            {
                query : "SELECT * FROM CHEQPAY_VW_01 WHERE REFERENCE = @REFERENCE AND TYPE = 0",
                param : ['REFERENCE:string|50'],
                value : [pCode.substring(0,9)],
                local : 
                {
                    type : "select",
                    query : "SELECT * FROM CHEQPAY_VW_01 WHERE REFERENCE = ? AND TYPE = 0;",
                    value : [pCode.substring(0,9)]
                }
            }                                            
        }
        else
        {
            this.txtPopCheqpay.value = "";
            document.getElementById("Sound").play(); 
            this.txtPopCheqpay.focus();

            let tmpConfObj =
            {
                id:'msgInvalidTicket',showTitle:true,title:this.lang.t("msgInvalidTicket.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgInvalidTicket.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgInvalidTicket.msg")}</div>)
            }
            await dialog(tmpConfObj);
            return;
        }
        
        await tmpDt.refresh()
        if(tmpDt.length > 0)
        {
            if(tmpDt[0].STATUS == '2')
            {
                this.txtPopCheqpay.value = "";
                document.getElementById("Sound").play(); 
                this.txtPopCheqpay.focus();

                let tmpConfObj =
                {
                    id:'msgStolenTicket',showTitle:true,title:this.lang.t("msgStolenTicket.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgStolenTicket.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgStolenTicket.msg")}</div>)
                }
                await dialog(tmpConfObj);
                return;
            }
            else if((tmpDt[0].STATUS == '0' && tmpDt[0].TYPE == '0') || (tmpDt.where({STATUS:1}).length > 0 && tmpDt[0].TYPE == '1'))
            {
                this.txtPopCheqpay.value = "";
                document.getElementById("Sound").play(); 
                this.txtPopCheqpay.focus();

                let tmpConfObj =
                {
                    id:'msgUsedTicket',showTitle:true,title:this.lang.t("msgUsedTicket.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgUsedTicket.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgUsedTicket.msg")}</div>)
                }
                await dialog(tmpConfObj);                
                return;                                                
            }
            else if(tmpDt[0].TYPE == '1' && tmpDt.where({EXDAY:{'>':90}}).length > 0)
            {
                this.txtPopCheqpay.value = "";
                document.getElementById("Sound").play(); 
                this.txtPopCheqpay.focus();

                let tmpConfObj =
                {
                    id:'msgOldTicket',showTitle:true,title:this.lang.t("msgOldTicket.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgOldTicket.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOldTicket.msg")}</div>)
                }
                await dialog(tmpConfObj);                
                return;     
            }
        }
        else if(tmpDt.length == 0 && tmpType == 1)
        {
            this.txtPopCheqpay.value = "";
            document.getElementById("Sound").play(); 
            this.txtPopCheqpay.focus();

            let tmpConfObj =
            {
                id:'msgInvalidTicket',showTitle:true,title:this.lang.t("msgInvalidTicket.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgInvalidTicket.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgInvalidTicket.msg")}</div>)
            }
            await dialog(tmpConfObj);
            return;
        }
        await this.cheqpaySave(pCode,tmpAmount,tmpStatus,tmpType)
        await this.cheqDt.refresh()

        this.payAdd(tmpPayType,tmpAmount)
        this.txtPopCheqpay.value = "";
    }
    async cheqpaySave(pCode,pAmount,pStatus,pType)
    {
        return new Promise(async resolve => 
        {
            let tmpQuery = 
            {
                query : "EXEC [dbo].[PRD_CHEQPAY_INSERT] " + 
                        "@CUSER = @PCUSER, " + 
                        "@TYPE = @PTYPE, " +                      
                        "@DOC = @PDOC, " + 
                        "@CODE = @PCODE, " + 
                        "@AMOUNT = @PAMOUNT, " + 
                        "@STATUS = @PSTATUS ", 
                param : ['PCUSER:string|25','PTYPE:int','PDOC:string|50','PCODE:string|25','PAMOUNT:float','PSTATUS:int'],
                value : [this.core.auth.data.CODE,pType,this.posObj.dt()[0].GUID,pCode,pAmount,pStatus],
                local : 
                {
                    type : "insert",
                    query : `INSERT INTO CHEQPAY_VW_01 (GUID, CUSER, TYPE, DOC, CODE, AMOUNT, STATUS, TRANSFER) VALUES (?, ?, ?, ?, ?, ?, ?, 1);`,
                    values : [datatable.uuidv4(),this.core.auth.data.CODE,pType,this.posObj.dt()[0].GUID,pCode,pAmount,pStatus]
                }
            }
            await this.core.sql.execute(tmpQuery)
            resolve()
        });
    }
    async customerPointSave(pType,pPoint)
    {
        return new Promise(async resolve => 
        {
            let tmpQuery = 
            {
                query : "EXEC [dbo].[PRD_CUSTOMER_POINT_INSERT] " + 
                        "@CUSER = @PCUSER, " + 
                        "@TYPE = @PTYPE, " +     
                        "@CUSTOMER = @PCUSTOMER, " +                  
                        "@DOC = @PDOC, " + 
                        "@POINT = @PPOINT, " + 
                        "@DESCRIPTION = @PDESCRIPTION ", 
                param : ['PCUSER:string|25','PTYPE:int','PCUSTOMER:string|50','PDOC:string|50','PPOINT:float','PDESCRIPTION:string|250'],
                value : [this.core.auth.data.CODE,pType,this.posObj.dt()[0].CUSTOMER_GUID,this.posObj.dt()[0].GUID,pPoint,''],
                local : 
                {
                    type : "insert",
                    query : `INSERT INTO CUSTOMER_POINT_VW_01 (GUID, CUSER, TYPE, CUSTOMER, DOC, POINT, DESCRIPTION) VALUES (?, ?, ?, ?, ?, ?, '');`,
                    values : [datatable.uuidv4(),this.core.auth.data.CODE,pType,this.posObj.dt()[0].CUSTOMER_GUID,this.posObj.dt()[0].GUID,pPoint]
                }
            }
            await this.core.sql.execute(tmpQuery)
            resolve()
        });
    }
    async ticketCheck(pTicket)
    {
        if(pTicket != "")
        {
            let tmpDt = new datatable();
            tmpDt.selectCmd = 
            {
                //query : "SELECT *,ISNULL((SELECT TOP 1 TICKET FROM POS_VW_01 WHERE TICKET = @GUID),'') AS REBATE_TICKET FROM POS_SALE_VW_01 WHERE SUBSTRING(CONVERT(NVARCHAR(50),POS_GUID),20,17) = @GUID",
                query : `SELECT 
                        ITEM_CODE AS ITEM_CODE,
                        SUM(QUANTITY) AS QUANTITY 
                        FROM 
                        (SELECT 
                        ITEM_CODE,
                        QUANTITY 
                        FROM POS_SALE_VW_01 WHERE SUBSTRING(CONVERT(NVARCHAR(50),POS_GUID),20,17) = @GUID  
                        UNION ALL 
                        SELECT 
                        ITEM_CODE,
                        QUANTITY * -1 
                        FROM POS_SALE_VW_01 WHERE POS_GUID IN (SELECT GUID FROM POS_VW_01 WHERE TICKET = @GUID)
                        ) AS TMP 
                        GROUP BY ITEM_CODE`,
                param : ['GUID:string|50'], 
                value : [pTicket] 
            }
            await tmpDt.refresh();
            
            if(tmpDt.length > 0)
            {
                // if(tmpDt[0].REBATE_TICKET != '')
                // {
                //     let tmpConfObj =
                //     {
                //         id:'msgDoubleRebate',showTitle:true,title:this.lang.t("msgDoubleRebate.title"),showCloseButton:true,width:'500px',height:'200px',
                //         button:[{id:"btn01",caption:this.lang.t("msgDoubleRebate.btn01"),location:'after'}],
                //         content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDoubleRebate.msg")}</div>)
                //     }
                //     await dialog(tmpConfObj);
                //     this.msgItemReturnTicket.hide()
                //     return
                // }

                for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
                {
                    let tmpItem = tmpDt.where({ITEM_CODE:this.posObj.posSale.dt()[i].ITEM_CODE})
                    if(tmpItem.length == 0)
                    {
                        let tmpConfObj =
                        {
                            id:'msgRebateNotMatch',showTitle:true,title:this.lang.t("msgRebateNotMatch.title"),showCloseButton:true,width:'500px',height:'200px',
                            button:[{id:"btn01",caption:this.lang.t("msgRebateNotMatch.btn01"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgRebateNotMatch.msg")}</div>)
                        }
                        await dialog(tmpConfObj);
                        return
                    }
                }

                for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
                {
                    let tmpItem = tmpDt.where({ITEM_CODE:this.posObj.posSale.dt()[i].ITEM_CODE})
                    if(tmpItem.length > 0 && this.posObj.posSale.dt()[i].QUANTITY <= tmpItem[0].QUANTITY)
                    {
                        this.msgItemReturnTicket.hide()
                        this.popItemReturnDesc.show()
                        return
                    }
                }

                let tmpConfObj =
                {
                    id:'msgItemOrQuantityNotMatch',showTitle:true,title:this.lang.t("msgItemOrQuantityNotMatch.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgItemOrQuantityNotMatch.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgItemOrQuantityNotMatch.msg")}</div>)
                }
                await dialog(tmpConfObj);
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgInvalidSafeTicket',showTitle:true,title:this.lang.t("msgInvalidSafeTicket.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgInvalidSafeTicket.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgInvalidSafeTicket.msg")}</div>)
                }
                await dialog(tmpConfObj);
            }
        }
    }
    priceCheck(pData,pPrice)
    {
        return new Promise(async resolve => 
        {
            if(this.prmObj.filter({ID:'PriceCheckZero',TYPE:0}).getValue() == true && pPrice == 0)
            {
                let tmpConfObj =
                {
                    id:'msgPriceNotDoesZero',showTitle:true,title:this.lang.t("msgPriceNotDoesZero.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgPriceNotDoesZero.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPriceNotDoesZero.msg")}</div>)
                }
                await dialog(tmpConfObj);
                resolve(false)
                return
            }
            if(this.prmObj.filter({ID:'MinPriceCheck',TYPE:0}).getValue() == true && Number(pPrice) < Number(parseFloat(pData.MIN_PRICE).round(2)))
            {
                let tmpConfObj =
                {
                    id:'msgMinPrice',showTitle:true,title:this.lang.t("msgMinPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgMinPrice.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMinPrice.msg")}</div>)
                }
                await dialog(tmpConfObj);
                resolve(false)
                return
            }
            if(this.prmObj.filter({ID:'CostPriceCheck',TYPE:0}).getValue() == true && Number(pPrice) < Number(parseFloat(pData.COST_PRICE).round(2)))
            {
                let tmpConfObj =
                {
                    id:'msgCostPrice',showTitle:true,title:this.lang.t("msgCostPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgCostPrice.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCostPrice.msg")}</div>)
                }
                await dialog(tmpConfObj);
                resolve(false)
                return
            }
            resolve(true)
        });        
    }
    print(pData,pType,pMail)
    {
        // SUB TOTAL İÇİN SATIRLAR TEKRARDAN DÜZENLENİYOR.
        this.posObj.posSale.subTotalBuild(pData.possale)
        return new Promise(async resolve => 
        {
            let prmPrint = this.posDevice.dt().length > 0 ? this.posDevice.dt()[0].PRINT_DESING : ""

            import("../meta/print/" + prmPrint).then(async(e)=>
            {
                let tmpPrint = e.print(pData)

                // let tmpArr = [];
                // for (let i = 0; i < tmpPrint.length; i++) 
                // {
                //     let tmpObj = tmpPrint[i]
                //     if(typeof tmpPrint[i] == 'function')
                //     {
                //         tmpObj = tmpPrint[i]()
                //     }
                //     if(Array.isArray(tmpObj))
                //     {
                //         tmpArr.push(...tmpObj)
                //     }
                //     else if(typeof tmpObj == 'object')
                //     {
                //         tmpArr.push(tmpObj)
                //     }
                // }
                // console.log(JSON.stringify(tmpArr))
                
                if(pType == 0)
                {
                    await this.posDevice.escPrinter(tmpPrint)
                }
                else if(pType == 1)
                {
                    let tmpMail = pMail
                    if(typeof pMail == 'undefined')
                    {
                        this.mailPopup._onClick()
                        tmpMail = this.txtMail.value
                    }

                    await this.posDevice.pdfPrint(tmpPrint,tmpMail)
                }
                else if(pType == 2)
                {
                    await this.posDevice.pdfPrint(tmpPrint,this.posObj.dt()[0].CUSTOMER_MAIL)
                }
                resolve()
            })
        });
    }
    async transferStart(pTime,pClear)
    {
        let tmpCounter = 0
        let tmpPrmTime = typeof pTime != 'undefined' ? pTime : this.prmObj.filter({ID:'TransferTime',TYPE:0}).getValue()
        this.interval = setInterval(async ()=>
        {
            this.msgTransfer1.value = this.lang.t("popTransfer.msg1") + (tmpPrmTime - tmpCounter).toString() + " Sn."
            this.msgTransfer2.value = ""

            tmpCounter += 1
            if(tmpCounter == tmpPrmTime)
            {
                this.setState({msgTransfer1:this.lang.t("popTransfer.msg2")})
                this.transferStop()
                await this.transfer.transferSql(pClear)
                this.transferStart()                
            }
        },1000)
    }
    transferStop()
    {
        clearInterval(this.interval)
    }
    async transferLocal()
    {
        return new Promise(async resolve => 
        {
            let tmpResult = await this.transfer.transferLocal()
            if(tmpResult)
            {
                await this.transfer.clearTbl("POS_VW_01")
                await this.transfer.clearTbl("POS_SALE_VW_01")
                await this.transfer.clearTbl("POS_PAYMENT_VW_01")
                await this.transfer.clearTbl("POS_EXTRA_VW_01")
                await this.core.local.remove({query:"DELETE FROM CHEQPAY_VW_01 WHERE TRANSFER = 1"})
                resolve(true)
            }
            else
            {
                resolve(false)
            }
        });
    }
    getPromoDb(pFirstDate,pLastDate)
    {
        return new Promise(async resolve => 
        {
            let tmpFirstDate = new Date()
            let tmpLastDate = new Date()
            //this.posPromoObj.clearAll()
            if(typeof pFirstDate != 'undefined')
            {
                tmpFirstDate = pFirstDate
                tmpLastDate = pLastDate
            }
            this.promoObj.clearAll()
            await this.promoObj.load({START_DATE:moment(tmpFirstDate).format("YYYY-MM-DD"),FINISH_DATE:moment(tmpLastDate).format("YYYY-MM-DD"),CUSTOMER_GUID:this.posObj.dt()[0].CUSTOMER_GUID,DEPOT_GUID:this.posObj.dt()[0].DEPOT_GUID})
            resolve()
        })
    }
    promoApply()
    {
        let isCond = (pGuid)=>
        {
            let tmpWithal = this.promoObj.cond.dt().where({PROMO : pGuid}).groupBy('WITHAL')
            let tmpSale = this.posObj.posSale.dt().where({PROMO_TYPE : 0})
            let tmpResult = new datatable()
            
            tmpWithal.forEach((withal)=>
            {
                tmpResult.push({WITHAL : false,COUNT : 0,ITEMS : []})                
                if(withal.TYPE == 0) //STOK KOŞULU
                {
                    let tmpCond = this.promoObj.cond.dt().where({PROMO : pGuid}).where({TYPE:0}).where({WITHAL:withal.WITHAL})
                    //MIKTAR KRITERLİ
                    if(tmpCond.length > 0 && tmpCond[0].QUANTITY > 0)
                    {
                        
                        if(tmpSale.where({ITEM_GUID : {'in' : tmpCond.toColumnArr('ITEM_GUID')}}).sum('QUANTITY') >= tmpCond[0].QUANTITY)
                        {
                            //POS_SALE TABLOSUNDAKİ ÜRÜNLERİN HANGİLERİNİN PROMOSYON KOŞULUNA UYDUĞU GETİRİLİYOR.BUNUN İÇİN KOŞULDAKİ ITEM_GUID LİSTESİ POS_SALE TABLOSUNA "IN" ŞEKLİNDE VERİLİYOR.
                            let tmpCondCount = Math.floor(tmpSale.where({ITEM_GUID : {'in' : tmpCond.toColumnArr('ITEM_GUID')}}).sum('QUANTITY') / tmpCond.sum('QUANTITY'))
                            tmpResult[tmpResult.length - 1].WITHAL = true
                            tmpResult[tmpResult.length - 1].COUNT = tmpCondCount
                            tmpResult[tmpResult.length - 1].ITEMS = tmpCond.toColumnArr('ITEM_GUID')
                        }
                    }
                    else if(tmpCond.length > 0 && tmpCond[0].AMOUNT > 0) //STOK TOPLAM TUTAR
                    {
                        if(tmpSale.where({ITEM_GUID : {'in' : tmpCond.toColumnArr('ITEM_GUID')}}).sum('AMOUNT') >= tmpCond[0].AMOUNT)
                        {
                            //POS_SALE TABLOSUNDAKİ ÜRÜNLERİN HANGİLERİNİN PROMOSYON KOŞULUNA UYDUĞU GETİRİLİYOR.BUNUN İÇİN KOŞULDAKİ ITEM_GUID LİSTESİ POS_SALE TABLOSUNA "IN" ŞEKLİNDE VERİLİYOR.
                            let tmpCondCount = Math.floor(tmpSale.where({ITEM_GUID : {'in' : tmpCond.toColumnArr('ITEM_GUID')}}).sum('AMOUNT') / tmpCond[0].AMOUNT)
                            tmpResult[tmpResult.length - 1].WITHAL = true
                            tmpResult[tmpResult.length - 1].COUNT = tmpCondCount
                            tmpResult[tmpResult.length - 1].ITEMS = tmpCond.toColumnArr('ITEM_GUID')
                        }
                    }
                }
                else if(withal.TYPE == 1) //GENEL TUTAR KOŞULU
                {
                    if(tmpSale.sum('TOTAL') >= withal.AMOUNT)
                    {
                        tmpResult[tmpResult.length - 1].WITHAL = true
                        tmpResult[tmpResult.length - 1].COUNT = 0
                        tmpResult[tmpResult.length - 1].ITEMS = []
                    }
                }
            });

            let tmpItems = []
            tmpResult.forEach((e)=>
            {
                e.ITEMS.forEach((items)=>
                {
                    tmpItems.push(items)
                })
            })
            
            if(tmpResult.where({WITHAL:false}).length > 0)
            {
                return {result : false}
            }
            else
            {
                //return {result : true,count : tmpResult.sum('COUNT'),items : tmpItems} - X VE Y ÜRÜNÜNDEN ALANA X VE YE ÜRÜNÜ XXX İNDİRİMLİ ŞEKLİNDE ÇALŞIŞMIYORDU DEĞİŞTİRİLDİ.
                return {result : true,count : tmpResult.groupBy('COUNT').min('COUNT'),items : tmpItems}
            }
        }

        let addPosPromo = (pType,pAmount,pPromoGuid,pPosGuid,pPosSaleGuid) => 
        {
            let tmpPosPromoDt = {...this.posPromoObj.empty}
            tmpPosPromoDt.APP_TYPE = pType
            tmpPosPromoDt.APP_AMOUNT = pAmount
            tmpPosPromoDt.PROMO_GUID = pPromoGuid
            tmpPosPromoDt.POS_GUID = pPosGuid
            tmpPosPromoDt.POS_SALE_GUID = pPosSaleGuid

            this.posPromoObj.addEmpty(tmpPosPromoDt)
        }
                
        //PROMOTION RESET
        this.posPromoObj.clearAll()
        this.posObj.posSale.dt().where({PROMO_TYPE : {'>' : 1}}).forEach((item)=>
        {
            let tmpCalc = this.calcSaleTotal(item.PRICE,item.QUANTITY,0,item.LOYALTY,item.VAT_RATE)
    
            item.QUANTITY = tmpCalc.QUANTITY
            item.PRICE = tmpCalc.PRICE
            item.FAMOUNT = tmpCalc.FAMOUNT
            item.AMOUNT = tmpCalc.AMOUNT
            item.DISCOUNT = tmpCalc.DISCOUNT
            item.VAT = tmpCalc.VAT
            item.TOTAL = tmpCalc.TOTAL
            item.PROMO_TYPE = 0
        })
        //******************************************************************** */
        let tmpSale = this.posObj.posSale.dt().where({PROMO_TYPE : 0})
        
        this.promoObj.dt('PROMO').forEach(promoItem => 
        {
            let tmpIsCond = isCond(promoItem.GUID)
            if(tmpIsCond.result)
            {
                let tmpWithal = this.promoObj.app.dt().where({PROMO : promoItem.GUID}).groupBy('WITHAL')
                tmpWithal.forEach((withal)=>
                {
                    let tmpApp = this.promoObj.app.dt().where({PROMO : promoItem.GUID}).where({WITHAL : withal.WITHAL})
                    //İNDİRİM ORAN UYGULAMA
                    tmpApp.where({TYPE : 0}).forEach(itemApp =>
                    {
                        tmpSale.where({ITEM_GUID : {'in' : tmpIsCond.items}}).where({PROMO_TYPE : 0}).forEach(itemSale => 
                        {
                            let tmpDisc = Number(Number(itemSale.PRICE * itemSale.QUANTITY).rateInc(itemApp.AMOUNT,2))
                            let tmpCalc = this.calcSaleTotal(itemSale.PRICE,itemSale.QUANTITY,tmpDisc,itemSale.LOYALTY,itemSale.VAT_RATE)

                            itemSale.QUANTITY = tmpCalc.QUANTITY
                            itemSale.PRICE = tmpCalc.PRICE
                            itemSale.FAMOUNT = tmpCalc.FAMOUNT
                            itemSale.AMOUNT = tmpCalc.AMOUNT
                            itemSale.DISCOUNT = tmpCalc.DISCOUNT
                            itemSale.VAT = tmpCalc.VAT
                            itemSale.TOTAL = tmpCalc.TOTAL
                            itemSale.PROMO_TYPE = 2

                            addPosPromo(0,itemApp.AMOUNT,promoItem.GUID,this.posObj.dt()[0].GUID,itemSale.GUID)
                        });
                    })
                    //PARA PUAN UYGULAMA
                    tmpApp.where({TYPE : 1}).forEach(itemApp =>
                    {
                        addPosPromo(1,itemApp.AMOUNT,promoItem.GUID,this.posObj.dt()[0].GUID,'00000000-0000-0000-0000-000000000000')
                    })
                    //HEDİYE ÇEKİ UYGULAMA
                    tmpApp.where({TYPE : 2}).forEach(itemApp =>
                    {
                        addPosPromo(2,itemApp.AMOUNT,promoItem.GUID,this.posObj.dt()[0].GUID,'00000000-0000-0000-0000-000000000000')
                    })
                    //STOK İNDİRİMİ UYGULAMA
                    tmpApp.where({TYPE : 3}).forEach(itemApp =>
                    {
                        if(tmpSale.where({ITEM_GUID : itemApp.ITEM_GUID}).sum('QUANTITY') >= itemApp.QUANTITY)
                        {   
                            let tmpAppCount = Math.floor(tmpSale.where({ITEM_GUID : itemApp.ITEM_GUID}).sum('QUANTITY') / itemApp.QUANTITY)

                            tmpSale.where({ITEM_GUID : itemApp.ITEM_GUID}).where({PROMO_TYPE : 0}).forEach(itemSale => 
                            {   
                                let tmpDisc = (Number(Number(itemSale.PRICE).rateInc(itemApp.AMOUNT,2)) * (tmpIsCond.count <= tmpAppCount ? tmpIsCond.count : tmpAppCount)) / tmpSale.where({ITEM_GUID : itemApp.ITEM_GUID}).length
                                let tmpCalc = this.calcSaleTotal(itemSale.PRICE,itemSale.QUANTITY,tmpDisc,itemSale.LOYALTY,itemSale.VAT_RATE)
                                
                                itemSale.QUANTITY = tmpCalc.QUANTITY
                                itemSale.PRICE = tmpCalc.PRICE
                                itemSale.FAMOUNT = tmpCalc.FAMOUNT
                                itemSale.AMOUNT = tmpCalc.AMOUNT
                                itemSale.DISCOUNT = tmpCalc.DISCOUNT
                                itemSale.VAT = tmpCalc.VAT
                                itemSale.TOTAL = tmpCalc.TOTAL
                                itemSale.PROMO_TYPE = 3

                                addPosPromo(3,itemApp.AMOUNT,promoItem.GUID,this.posObj.dt()[0].GUID,itemSale.GUID)
                            });
                        }
                    })
                    //GENEL İNDİRİM UYGULAMA
                    tmpApp.where({TYPE : 4}).forEach(itemApp =>
                    {
                        tmpSale.where({PROMO_TYPE : 0}).forEach(itemSale => 
                        {              
                            let tmpDisc = Number(Number(itemSale.PRICE * itemSale.QUANTITY).rateInc(itemApp.AMOUNT,2))
                            let tmpCalc = this.calcSaleTotal(itemSale.PRICE,itemSale.QUANTITY,tmpDisc,itemSale.LOYALTY,itemSale.VAT_RATE)
                            
                            itemSale.QUANTITY = tmpCalc.QUANTITY
                            itemSale.PRICE = tmpCalc.PRICE
                            itemSale.FAMOUNT = tmpCalc.FAMOUNT
                            itemSale.AMOUNT = tmpCalc.AMOUNT
                            itemSale.DISCOUNT = tmpCalc.DISCOUNT
                            itemSale.VAT = tmpCalc.VAT
                            itemSale.TOTAL = tmpCalc.TOTAL
                            itemSale.PROMO_TYPE = 4

                            addPosPromo(4,itemApp.AMOUNT,promoItem.GUID,this.posObj.dt()[0].GUID,itemSale.GUID)
                        });
                    })
                    //İNDİRİM TUTAR UYGULAMA
                    tmpApp.where({TYPE : 5}).forEach(itemApp =>
                    {
                        tmpSale.where({ITEM_GUID : {'in' : tmpIsCond.items}}).where({PROMO_TYPE : 0}).forEach(itemSale => 
                        {
                            let tmpDisc = Number(Number(itemSale.PRICE - itemApp.AMOUNT) * itemSale.QUANTITY)
                            let tmpCalc = this.calcSaleTotal(itemSale.PRICE,itemSale.QUANTITY,tmpDisc,itemSale.LOYALTY,itemSale.VAT_RATE)

                            itemSale.QUANTITY = tmpCalc.QUANTITY
                            itemSale.PRICE = tmpCalc.PRICE
                            itemSale.FAMOUNT = tmpCalc.FAMOUNT
                            itemSale.AMOUNT = tmpCalc.AMOUNT
                            itemSale.DISCOUNT = tmpCalc.DISCOUNT
                            itemSale.VAT = tmpCalc.VAT
                            itemSale.TOTAL = tmpCalc.TOTAL
                            itemSale.PROMO_TYPE = 5

                            addPosPromo(0,itemApp.AMOUNT,promoItem.GUID,this.posObj.dt()[0].GUID,itemSale.GUID)
                        });
                    })
                })
            }            
        });
    }
    async sendJet(pData)
    {
        if(this.core.offline)
        {
            let tmpQuery = 
            {
                type : "insert",
                query : `INSERT INTO NF525_JET (CUSER, CDATE, CODE, NAME, DESCRIPTION, APP_VERSION)
                        VALUES (?, ?, ?, ?, ?, ?);`,
                values : [this.core.auth.data.CODE,moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),typeof pData.CODE != 'undefined' ? pData.CODE : '',
                          typeof pData.NAME != 'undefined' ? pData.NAME : '',typeof pData.DESCRIPTION != 'undefined' ? pData.DESCRIPTION : '',this.core.appInfo.version]                        
            }
            await this.core.local.insert(tmpQuery)
        }
        else
        {
            let tmpJetData =
            {
                CUSER:this.core.auth.data.CODE,      
                CDATE: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                DEVICE:window.localStorage.getItem('device') == null ? '' : window.localStorage.getItem('device'),
                CODE:typeof pData.CODE != 'undefined' ? pData.CODE : '',
                NAME:typeof pData.NAME != 'undefined' ? pData.NAME : '',
                DESCRIPTION:typeof pData.DESCRIPTION != 'undefined' ? pData.DESCRIPTION : '',
                APP_VERSION:this.core.appInfo.version
            }
            this.core.socket.emit('nf525',{cmd:"jet",data:tmpJetData})
        }
    }
    async factureInsert(pData,pSaleData)
    {    
        return new Promise(async resolve => 
        {
            if(pData[0].FACT_REF == 0)
            {
                //***** FACTURE İMZALAMA *****/
                let tmpSignedData = await this.nf525.signatureSaleFact(pData[0],pSaleData)  
                pData[0].FACT_REF = tmpSignedData.REF
    
                let tmpInsertQuery = 
                {
                    query : "EXEC [dbo].[PRD_POS_FACTURE_INSERT] " + 
                            "@CUSER = @PCUSER, " + 
                            "@POS = @PPOS, " +
                            "@REF = @PREF, " +
                            "@SIGNATURE = @PSIGNATURE, " +
                            "@SIGNATURE_SUM = @PSIGNATURE_SUM, " +
                            "@APP_VERSION = @PAPP_VERSION ", 
                    param : ['PCUSER:string|25','PPOS:string|50','PREF:int','PSIGNATURE:string|max','PSIGNATURE_SUM:string|max','PAPP_VERSION:string|25'],
                    value : [pData[0].CUSER,pData[0].GUID,pData[0].FACT_REF,tmpSignedData.SIGNATURE,tmpSignedData.SIGNATURE_SUM,this.core.appInfo.version],
                }
        
                await this.core.sql.execute(tmpInsertQuery)                                
            }

            let tmpQuery = 
            {
                query : "SELECT * FROM POS_FACTURE_VW_01 WHERE POS = @POS", 
                param : ['POS:string|50'],
                value : [pData[0].GUID],
            }

            let tmpResult = await this.core.sql.execute(tmpQuery)
            
            if(tmpResult.result.recordset.length > 0)
            {
                resolve(tmpResult.result.recordset)
            }        

            resolve([])
        })
    }
    async rePrint(pPosDt,pPosSaleDt,pPosPayDt,pPosPromoDt)
    {
        let tmpQuery = 
        {
            query : "SELECT COUNT(TAG) AS PRINT_COUNT FROM POS_EXTRA WHERE POS_GUID = @POS_GUID AND TAG = @TAG", 
            param : ['POS_GUID:string|50','TAG:string|25'],
            value : [pPosDt[0].GUID,"REPRINT"],
            local : 
            {
                type : "select",
                query : "SELECT COUNT(TAG) AS PRINT_COUNT FROM POS_EXTRA_VW_01 WHERE POS_GUID = ? AND TAG = ?",
                values : [pPosDt[0].GUID,"REPRINT"]
            }
        }
        
        let tmpPrintCount = (await this.core.sql.execute(tmpQuery)).result.recordset[0].PRINT_COUNT
        
        if(tmpPrintCount < 5)
        {
            let tmpRePrintResult = await this.popRePrintDesc.show()

            if(typeof tmpRePrintResult != 'undefined')
            {
                let tmpDupCert = ""
                if(!this.core.offline)
                {
                    let tmpInsertQuery = {}
                    if(tmpPrintCount > 0)
                    {
                        let tmpDupSignature = await this.nf525.signaturePosDuplicate(pPosDt[0])
                        let tmpDupSign = ''
        
                        if(tmpDupSignature != '')
                        {
                            tmpDupSign = tmpDupSignature.SIGNATURE.substring(2,3) + tmpDupSignature.SIGNATURE.substring(6,7) + tmpDupSignature.SIGNATURE.substring(12,13) + tmpDupSignature.SIGNATURE.substring(18,19)
                        }

                        tmpInsertQuery = 
                        {
                            query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                                    "@CUSER = @PCUSER, " + 
                                    "@TAG = @PTAG, " +
                                    "@POS_GUID = @PPOS_GUID, " +
                                    "@LINE_GUID = @PLINE_GUID, " +
                                    "@DATA =@PDATA, " +
                                    "@DATA_EXTRA1 = @PDATA_EXTRA1, " +
                                    "@APP_VERSION = @PAPP_VERSION, " +
                                    "@DESCRIPTION = @PDESCRIPTION ", 
                            param : ['PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|max','PDATA_EXTRA1:string|max','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                            value : [pPosDt[0].CUSER,"REPRINT",pPosDt[0].GUID,"00000000-0000-0000-0000-000000000000",tmpDupSignature.SIGNATURE,tmpDupSignature.SIGNATURE_SUM,this.core.appInfo.version,tmpRePrintResult]
                        }

                        tmpDupCert = this.core.appInfo.name + " version : " + this.core.appInfo.version + " - " + this.core.appInfo.certificate + " - " + tmpDupSign
                    }
                    else
                    {
                        tmpInsertQuery = 
                        {
                            query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                                    "@CUSER = @PCUSER, " + 
                                    "@TAG = @PTAG, " +
                                    "@POS_GUID = @PPOS_GUID, " +
                                    "@LINE_GUID = @PLINE_GUID, " +
                                    "@DATA =@PDATA, " +
                                    "@DATA_EXTRA1 = @PDATA_EXTRA1, " +
                                    "@APP_VERSION = @PAPP_VERSION, " +
                                    "@DESCRIPTION = @PDESCRIPTION ", 
                            param : ['PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|max','PDATA_EXTRA1:string|max','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                            value : [pPosDt[0].CUSER,"REPRINT",pPosDt[0].GUID,"00000000-0000-0000-0000-000000000000","","",this.core.appInfo.version,""]
                        }
                    }

                    await this.core.sql.execute(tmpInsertQuery)
                }
                
                let tmpData = 
                {
                    pos : pPosDt,
                    possale : pPosSaleDt,
                    pospay : pPosPayDt,
                    pospromo : pPosPromoDt,
                    firm : this.firm,
                    special : 
                    {
                        type : 'Fis',
                        ticketCount : 0,
                        reprint : tmpPrintCount + 1,
                        repas : 0,
                        factCertificate : '',
                        dupCertificate : tmpDupCert,
                        customerUsePoint : Math.floor(pPosDt[0].LOYALTY * 100),
                        customerPoint : (pPosDt[0].CUSTOMER_POINT + Math.floor(pPosDt[0].LOYALTY * 100)) - Math.floor(pPosDt[0].TOTAL),
                        customerGrowPoint : pPosDt[0].CUSTOMER_POINT - Math.floor(pPosDt[0].TOTAL),
                        customerPointFactory : this.prmObj.filter({ID:'CustomerPointFactory',TYPE:0}).getValue()
                    }
                }
                
                if(tmpPrintCount > 0 && !this.core.offline)
                {
                    this.sendJet({CODE:"155",NAME:"Duplicata ticket imprimé."}) //// Duplicate fiş yazdırıldı.
                }
                //YAZDIRMA İŞLEMİNDEN ÖNCE KULLANICIYA SORULUYOR
                let tmpConfObj =
                {
                    id:'msgMailPrintAlert',showTitle:true,title:this.lang.t("msgMailPrintAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                    button:[{id:"btn01",caption:this.lang.t("msgMailPrintAlert.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgMailPrintAlert.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMailPrintAlert.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                if(pResult == 'btn01')
                {
                    if(pPosDt[0].CUSTOMER_GUID != '00000000-0000-0000-0000-000000000000')
                    { 
                        let tmpQuery = 
                        {
                            query :"SELECT EMAIL FROM CUSTOMER_VW_02 WHERE GUID = @GUID",
                            param:  ['GUID:string|50'],
                            value:  [pPosDt[0].CUSTOMER_GUID]
                        }
                        let tmpMailData = await this.core.sql.execute(tmpQuery) 
                        if(tmpMailData.result.recordset.length > 0)
                        {
                            this.txtMail.value = tmpMailData.result.recordset[0].EMAIL
                        }
                        else
                        {
                            this.txtMail.value = ""
                        }
                    }
                    else
                    {
                        this.txtMail.value = ""
                    }
                    this.mailPopup.tmpData = tmpData;
                    await this.mailPopup.show()
                    return
                }
                await this.print(tmpData,0)
            } 
        }
        else
        {
            let tmpConfObj =
            {
                id:'msgRePrint',showTitle:true,title:this.lang.t("msgRePrint.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgRePrint.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgRePrint.msg")}</div>)
            }
            await dialog(tmpConfObj);
        }
    }
    async ZReport()
    {
        import("../meta/print/" + this.prmObj.filter({ID:'ZReportPrintDesign',TYPE:0}).getValue()).then(async(e)=>
        {
            let tmpSaleDt = new datatable()
            tmpSaleDt.selectCmd = 
            {
                query : "SELECT * FROM POS_SALE_VW_01 WHERE DEVICE = @DEVICE AND DOC_DATE = @DOC_DATE",
                param : ['DEVICE:string|10','DOC_DATE:date'],
                value : [window.localStorage.getItem('device'),moment(new Date()).format("YYYY-MM-DD")]
            }
            await tmpSaleDt.refresh()
            
            let tmpPayDt = new datatable()
            tmpPayDt.selectCmd = 
            {
                query : "SELECT PAY_TYPE_NAME,SUM(AMOUNT - CHANGE) AS AMOUNT FROM POS_PAYMENT_VW_01 WHERE DEVICE = @DEVICE AND DOC_DATE = @DOC_DATE GROUP BY PAY_TYPE_NAME,PAY_TYPE ORDER BY PAY_TYPE ASC",
                param : ['DEVICE:string|10','DOC_DATE:date'],
                value : [window.localStorage.getItem('device'),moment(new Date()).format("YYYY-MM-DD")]
            }
            await tmpPayDt.refresh()

            let tmpData =
            {
                firm : this.firm,
                possale : tmpSaleDt,
                pospay : tmpPayDt,
                special : 
                {
                    user : this.user.CODE,
                    device : window.localStorage.getItem('device')
                }
            }

            let tmpPrint = e.print(tmpData)
            await this.posDevice.escPrinter(tmpPrint)
        })
    }
    checkSaleClose(pGuid)
    {
        return new Promise(async resolve => 
        {
            let tmpPosDt = new datatable()

            tmpPosDt.selectCmd = 
            {
                query : "SELECT GUID,CUSER,REF,CERTIFICATE,SIGNATURE,SIGNATURE_SUM,ROUND(TOTAL,2) AS TOTAL,ROUND(DISCOUNT,2) AS DISCOUNT,ROUND(LOYALTY,2) AS LOYALTY,ROUND(AMOUNT,2) AS AMOUNT FROM POS WHERE GUID = @GUID",
                param : ['GUID:string|50'],
                value : [pGuid]
            }
            tmpPosDt.updateCmd = 
            {
                query : "EXEC [dbo].[PRD_POS_UPDATE] " + 
                        "@GUID = @PGUID, " +
                        "@CUSER = @PCUSER, " +
                        "@REF = @PREF, " +
                        "@STATUS = @PSTATUS, " +
                        "@CERTIFICATE = @PCERTIFICATE, " +
                        "@SIGNATURE = @PSIGNATURE, " +
                        "@SIGNATURE_SUM = @PSIGNATURE_SUM ",
                param : ['PGUID:string|50','PCUSER:string|25','PREF:int','PSTATUS:int','PCERTIFICATE:string|25','PSIGNATURE:string|25','PSIGNATURE_SUM:string|25'],
                dataprm : ['GUID','CUSER','REF','STATUS','CERTIFICATE','SIGNATURE','SIGNATURE_SUM'],
            }

            await tmpPosDt.refresh()

            tmpPosDt[0].REF = 0
            tmpPosDt[0].STATUS = 0
            tmpPosDt[0].CERTIFICATE = ''
            tmpPosDt[0].SIGNATURE = ''
            tmpPosDt[0].SIGNATURE_SUM = ''

            if(tmpPosDt.length > 0)
            {
                let tmpPosSaleDt = new datatable()
                let tmpPosPayDt = new datatable()
                tmpPosSaleDt.selectCmd = 
                {
                    query : "SELECT ISNULL(ROUND(SUM(TOTAL),2),0) AS TOTAL FROM POS_SALE WHERE POS = @POS AND DELETED = 0",
                    param : ['POS:string|50'],
                    value : [pGuid]
                }
                tmpPosPayDt.selectCmd = 
                {
                    query : "SELECT ISNULL(ROUND(SUM(AMOUNT - CHANGE),2),0) AS TOTAL FROM POS_PAYMENT WHERE POS = @POS AND DELETED = 0",
                    param : ['POS:string|50'],
                    value : [pGuid]
                }
                await tmpPosSaleDt.refresh()
                await tmpPosPayDt.refresh()
                
                if(tmpPosSaleDt.length == 0 || tmpPosPayDt.length == 0)
                {
                    await tmpPosDt.update()
                    resolve(false)
                    return
                }
                if(Number(tmpPosDt[0].AMOUNT - tmpPosDt[0].DISCOUNT).round(2) == Number(tmpPosDt[0].LOYALTY).round(2))
                {
                    resolve(true)
                    return
                }
                if(tmpPosSaleDt[0].TOTAL == 0 || tmpPosPayDt[0].TOTAL == 0)
                {
                    await tmpPosDt.update()
                    resolve(false)
                    return
                }
                if(Number(tmpPosDt[0].TOTAL).toFixed(2) != Number(tmpPosSaleDt[0].TOTAL).toFixed(2) || Number(tmpPosDt[0].TOTAL).toFixed(2) != Number(tmpPosPayDt[0].TOTAL).toFixed(2) || 
                Number(tmpPosSaleDt[0].TOTAL).toFixed(2) != Number(tmpPosPayDt[0].TOTAL).toFixed(2))
                {
                    await tmpPosDt.update()
                    resolve(false)
                    return
                }
                resolve(true)
                return
            }
            else
            {
                await tmpPosDt.update()
                resolve(false)
                return
            }
        });
    }
    isUnitDecimal(pUnit)
    {
        if(pUnit.toLowerCase() == 'kg' || pUnit.toLowerCase() == 'm')
        {
            return true
        }
        return false
    }
    priceListChoice(pItem)
    {
        return new Promise(async resolve => 
        {
            let tmpDt = new datatable()
            tmpDt.selectCmd = 
            {
                query : "SELECT LIST_NO,LIST_NAME,PRICE,ITEM_NAME,LIST_TAG FROM ITEM_PRICE_VW_01 WHERE TYPE = 0 AND ITEM_GUID = @ITEM",
                param : ['ITEM:string|50'],
                value : [pItem]
            }

            await tmpDt.refresh(); 
            
            if(tmpDt.length > 1)
            {
                this.priceListChoicePopUp.onClick = (data) =>
                {
                    if(data.length > 0)
                    {
                        resolve(data[0].LIST_NO)
                    }
                    else
                    {
                        resolve(-1)
                    }
                }
                this.priceListChoicePopUp.onHiding = ()=>
                {
                    resolve(-1)
                }
                await this.priceListChoicePopUp.show()
                await this.priceListChoicePopUp.setData(tmpDt)
            }
            else if(tmpDt.length == 1)
            {
                resolve(tmpDt[0].LIST_NO)
            }
            else
            {
                resolve(0)
            }
        })
    }
    render()
    {
        return(
            <div style={{overflowX:'hidden'}}>
                {/* Ekranda belirli bir süre boş beklediğinde logout olması için yapıldı */}
                <IdleTimer timeout={this.prmObj.filter({ID:'ScreenTimeOut',TYPE:0}).getValue()}
                onIdle={()=>
                {
                    this.posLcd.print
                    ({
                        blink : 0,
                        text :  "Bonjour".space(20) + moment(new Date()).format("DD.MM.YYYY").space(20)
                    })    
                    this.core.auth.logout()
                    window.location.reload()
                }}/>           
                <LoadPanel
                shadingColor="rgba(0,0,0,0.0)"
                position={{ of: '#root' }}
                showIndicator={false}
                shading={true}
                showPane={false}
                message={""}
                ref={this.loading}
                />
                <LoadPanel
                shadingColor="rgba(255,255,255,1.0)"
                position={{ of: '#root' }}
                showIndicator={true}
                shading={true}
                showPane={true}
                message={this.lang.t("pleaseWait")}
                ref={this.loadingPay}
                />
                <div className="top-bar row">
                    <div className="col-12">                    
                        <div className="row m-2">
                            <div className="col-1">
                                <img src="./css/img/logo.png" width="50px" height="50px" onClick={()=>
                                {
                                    if(this.posDevice.dt().length > 0)
                                    {
                                        this.txtPopSettingsLcd.value = this.posDevice.dt()[0].LCD_PORT
                                        this.txtPopSettingsScale.value = this.posDevice.dt()[0].SCALE_PORT
                                        this.txtPopSettingsPayCard.value = this.posDevice.dt()[0].PAY_CARD_PORT
                                        this.txtPopSettingsPrint.value = this.posDevice.dt()[0].PRINT_DESING
                                        this.txtPopSettingsScanner.value = this.posDevice.dt()[0].SCANNER_PORT
                                        this.txtPopSettingsPrinter.value = this.posDevice.dt()[0].PRINTER_PORT
                                    }
                                    this.keyPopSettings.clearInput();
                                    this.popSettings.show();
                                }}/>
                            </div>
                            <div className="col-2">
                                <div className="row" style={{height:"25px"}}  onClick={async()=>
                                {
                                    this.popPasswordChange.show()
                                }}>
                                    <div className="col-12">                                        
                                        <span className="text-white"><i className="text-white fa-solid fa-user pe-2"></i>{this.user.CODE}</span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}} onClick={async()=>
                                {
                                    if(this.posObj.posSale.dt().length > 0)
                                    {
                                    let tmpConfObj =
                                    {
                                        id:'msgDeviceNotChange',showTitle:true,title:this.lang.t("msgDeviceNotChange.title"),showCloseButton:true,width:'500px',height:'200px',
                                        button:[{id:"btn01",caption:this.lang.t("msgDeviceNotChange.btn01"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDeviceNotChange.msg")}</div>)
                                    }
                                    let tmpMsgResult = await dialog(tmpConfObj);
                                    if(tmpMsgResult == 'btn01')
                                    {
                                        return
                                    }
                                    }
                                    let tmpAcsVal = this.acsObj.filter({ID:'btnDeviceEntry',USERS:this.user.CODE})
                                        
                                    if(typeof tmpAcsVal.getValue().dialog != 'undefined' && tmpAcsVal.getValue().dialog.type != -1)
                                    {   
                                        let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:tmpAcsVal.getValue().dialog.type})
                                        if(!tmpResult)
                                        {
                                            return
                                        }
                                    }

                                    this.deviceEntry()
                                }}>
                                    <div className="col-12">
                                        <span className="text-light"><i className="text-light fa-solid fa-tv pe-2"></i><NbLabel id="device" parent={this} value={""}/></span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">                                                                        
                                        <span className="text-white"><i className="text-white fa-solid fa-circle-user pe-2"></i><NbLabel id="customerName" parent={this} value={""}/></span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}} onClick={async()=>
                                {
                                    if(this.btnGetCustomer.lock)
                                    {
                                        this.btnGetCustomer.setUnLock({backgroundColor:"#0dcaf0",borderColor:"#0dcaf0",height:"100%",width:"100%"})
                                    }
                                    else
                                    {
                                        if(this.posObj.dt()[0].CUSTOMER_GUID != '00000000-0000-0000-0000-000000000000')
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgCancelCustomerConfirm',showTitle:true,title:this.lang.t("msgCancelCustomerConfirm.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgCancelCustomerConfirm.btn01"),location:'after'},{id:"btn02",caption:this.lang.t("msgLineDeleteConfirm.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCancelCustomerConfirm.msg")}</div>)
                                            }
                                            let tmpResult = await dialog(tmpConfObj);
                                            if(tmpResult == "btn01")
                                            {
                                                this.posObj.dt()[0].CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000'
                                                this.posObj.dt()[0].CUSTOMER_TYPE = 0
                                                this.posObj.dt()[0].CUSTOMER_CODE = ''
                                                this.posObj.dt()[0].CUSTOMER_NAME = ''
                                                this.posObj.dt()[0].CUSTOMER_ADRESS = ''
                                                this.posObj.dt()[0].CUSTOMER_ZIPCODE = ''
                                                this.posObj.dt()[0].CUSTOMER_CITY = ''
                                                this.posObj.dt()[0].CUSTOMER_COUNTRY = ''
                                                this.posObj.dt()[0].CUSTOMER_POINT = 0
                                                this.posObj.dt()[0].CUSTOMER_POINT_PASSIVE = false
                                                this.posObj.dt()[0].CUSTOMER_MAIL = ''
                                                this.posObj.dt()[0].CUSTOMER_TAX_NO = ''
                                                this.posObj.dt()[0].CUSTOMER_SIRET = ''

                                                this.btnPopLoyaltyDel.props.onClick()

                                                //PROMOSYON GETİR.
                                                await this.getPromoDb()
                                                this.promoApply()
                                                //************************************************** */
                                                this.core.util.writeLog("calcGrandTotal : 11")
                                                await this.calcGrandTotal(true);
                                            }
                                            return
                                        }
                                    }
                                }}>
                                    <div className="col-12">                                        
                                        <span className="text-light"><i className="text-light fa-solid fa-user-plus pe-2"></i><NbLabel id="customerPoint" parent={this} value={""}/></span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">                                        
                                        <span className="text-white"><i className="text-white fa-solid fa-calendar pe-2"></i><NbLabel id="lblDate" parent={this} value={"00.00.0000"}/></span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">                                        
                                        <span className="text-light"><i className="text-light fa-solid fa-clock pe-2"></i><NbLabel id="lblTime" parent={this} value={"00:00:00"}/></span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="row">
                                    <div className="col-3 px-1">
                                        <NbButton id={"btnRefresh"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            document.location.reload()
                                        }}>
                                            <i className="text-white fa-solid fa-arrows-rotate" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                    <div className="col-3 px-1">
                                        <NbButton id={"btnSettings"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                        onClick={async()=>
                                        {   
                                            if(!this.accesComp.editMode)
                                            {
                                                let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:1})
                                                if(!tmpResult)
                                                {
                                                    return
                                                }
                                                this.accesComp.openEdit()
                                            }
                                            else
                                            {
                                                this.accesComp.closeEdit()
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-pencil" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                    <div className="col-3 px-1">
                                        <NbButton id={"btnPluEdit"} parent={this} className={"form-group btn btn-primary btn-block"} style={{height:"55px",width:"100%"}}
                                        onClick={async()=>
                                        {
                                            if(this.core.offline)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgOfflineWarning',showTitle:true,title:this.lang.t("msgOfflineWarning.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("msgOfflineWarning.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOfflineWarning.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return
                                            } 
                                            
                                            if(this.pluBtnGrp.edit)
                                            {
                                                this.pluBtnGrp.edit = false
                                                this.pluBtnGrp.save()                   
                                            }                              
                                            else
                                            {
                                                let tmpAcsVal = this.acsObj.filter({ID:'btnPluEdit',USERS:this.user.CODE})
                                                
                                                if(typeof tmpAcsVal.getValue().dialog != 'undefined' && tmpAcsVal.getValue().dialog.type != -1)
                                                {   
                                                    let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:tmpAcsVal.getValue().dialog.type})
                                                    if(!tmpResult)
                                                    {
                                                        return
                                                    }
                                                }
                                                this.pluBtnGrp.edit = true
                                            }                   
                                            this.setState({isPluEdit:this.pluBtnGrp.edit})
                                        }}>
                                            <FontAwesomeIcon icon={this.state.isPluEdit == true ? "fa-solid fa-lock-open" : "fa-solid fa-lock"} />
                                        </NbButton>
                                    </div>
                                    <div className="col-3 ps-1 pe-3">
                                        <NbButton id={"btnClose"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                        onClick={async()=>
                                        {                   
                                            this.posLcd.print
                                            ({
                                                blink : 0,
                                                text :  "Bonjour".space(20) + moment(new Date()).format("DD.MM.YYYY").space(20)
                                            })
                                            let msgDisconnectWarning =
                                                {
                                                    id:'msgDisconnectWarning',showTitle:true,title:this.lang.t("msgDisconnectWarning.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("msgDisconnectWarning.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgDisconnectWarning.btn02"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDisconnectWarning.msg")}</div>)
                                                }
                                            let tmpWarningResult = await dialog(msgDisconnectWarning);
                                            if(tmpWarningResult === "btn01")
                                            {
                                                this.core.auth.logout()
                                                window.location.reload()
                                            }                                  
                                        }}>
                                            <i className="text-white fa-solid fa-power-off" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>   
                </div>
                <div className="row p-1">
                    <div className="col-12">
                        <NdLayout parent={this} id={"frmBtnGrp"} cols={70} rowHeight={0} margin={[4,4]} preventCollision={true} compactType={null}>
                            {/* txtBarcodeLy */}
                            <NdLayoutItem key={"txtBarcodeLy"} id={"txtBarcodeLy"} parent={this} data-grid={{x:0,y:0,h:10,w:35,minH:2,maxH:10,minW:15,maxW:35}} 
                            access={this.acsObj.filter({ELEMENT:'txtBarcodeLy',USERS:this.user.CODE})}>
                                <NdPosBarBox id="txtBarcode" parent={this} simple={true} selectAll={false}
                                button={
                                [
                                    {
                                        id:"01",
                                        icon:"fa-solid fa-magnifying-glass-plus",
                                        onClick:()=>
                                        {
                                            this.popItemList.show()
                                        }
                                    },
                                    {
                                        id:"02",
                                        icon:"fa-solid fa-barcode",
                                        onClick:async ()=>
                                        {
                                            if(this.txtBarcode.value != '')
                                            {
                                                let tmpDt = new datatable(); 
                                                tmpDt.selectCmd = 
                                                {
                                                    query : "SELECT BARCODE,NAME,PRICE_SALE AS PRICE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE BARCODE LIKE '%' + @BARCODE AND STATUS = 1",
                                                    param : ['BARCODE:string|25'],
                                                    local : 
                                                    {
                                                        type : "select",
                                                        query : "SELECT BARCODE, NAME, PRICE_SALE  AS PRICE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE BARCODE LIKE '%' || ? AND STATUS = 1;",
                                                        values : [this.txtBarcode.value]                                                        
                                                    }
                                                }
                                                tmpDt.selectCmd.value = [this.txtBarcode.value]
                                                await tmpDt.refresh();
                                                this.grdBarcodeList.devGrid.clearSelection()
                                                await this.grdBarcodeList.dataRefresh({source:tmpDt});
                                                this.popBarcodeList.show()
                                                this.txtBarcode.value = ""
                                            }
                                        }
                                    }
                                ]}
                                onKeyUp={(async(e)=>
                                {      
                                    if(e.event.key == 'Enter')
                                    {
                                        this.getItem(this.txtBarcode.dev.option("value"))
                                    }
                                }).bind(this)} 
                                >     
                                </NdPosBarBox>
                            </NdLayoutItem>                            
                            {/* grdListLy */}
                            <NdLayoutItem key={"grdListLy"} id={"grdListLy"} parent={this} data-grid={{x:0,y:10,h:70,w:35,minH:2,maxH:70,minW:20,maxW:35}} 
                            access={this.acsObj.filter({ELEMENT:'grdListLy',USERS:this.user.CODE})}>
                                <div>
                                    <NdGrid parent={this} id={"grdList"} 
                                    showBorders={true} 
                                    columnsAutoWidth={false} 
                                    allowColumnResizing={true} 
                                    allowColumnReordering={false}
                                    height={"100%"} 
                                    width={"100%"}
                                    dbApply={false}
                                    selection={{mode:"single"}}
                                    loadPanel={{enabled:false}}
                                    sorting={{ mode: 'none' }}
                                    onRowPrepared={(e)=>
                                    {                                    
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "15px";
                                        if(e.rowType == "data")
                                        {
                                            if(e.data.PROMO_TYPE > 1)
                                            {
                                                e.rowElement.style.backgroundColor = "#00cec9";
                                            }
                                            else
                                            {
                                                e.rowElement.style.backgroundColor = "white";
                                            }
                                        }
                                    }}
                                    onCellPrepared={(e)=>
                                    {                                    
                                        e.cellElement.style.padding = "4px"                                    
                                        if(e.rowType == 'data' && e.column.dataField == 'AMOUNT')
                                        {
                                            e.cellElement.style.fontWeight = "bold";
                                        }
                                    }}
                                    onCellClick={async (e)=>
                                    {
                                        if(e.column.dataField == "QUANTITY")
                                        {
                                            if(this.prmObj.filter({ID:'QuantityEdit',TYPE:0}).getValue() == true)
                                            {                                
                                                let tmpResult = await this.popNumber.show(this.lang.t("quantity"),Number(e.value) / Number(e.data.UNIT_FACTOR),undefined,e.data.ITEM_NAME)
                                                if(typeof tmpResult != 'undefined' && tmpResult != '')
                                                {
                                                    if(this.prmObj.filter({ID:'QuantityCheckZero',TYPE:0}).getValue() == true && tmpResult == 0)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgZeroValidation',showTitle:true,title:this.lang.t("msgZeroValidation.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.lang.t("msgZeroValidation.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgZeroValidation.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        return
                                                    }

                                                    if(tmpResult >= 1000)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgMaxQuantity',
                                                            showTitle:true,
                                                            title:this.lang.t("msgMaxQuantity.title"),
                                                            showCloseButton:true,
                                                            width:'500px',
                                                            height:'200px',
                                                            button:[{id:"btn01",caption:this.lang.t("msgMaxQuantity.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMaxQuantity.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        return
                                                    }
                                                    let tmpData = {QUANTITY:Number(tmpResult) * Number(e.data.UNIT_FACTOR),PRICE:e.data.PRICE,SCALE_MANUEL:e.data.WEIGHING}
                                                    this.saleRowUpdate(e.data,tmpData)
                                                }
                                            }
                                        }
                                        if(e.column.dataField == "PRICE")
                                        {
                                            if(this.prmObj.filter({ID:'PriceEdit',TYPE:0}).getValue() == true)
                                            {
                                                this.popPriceDesc.show()
                                            }
                                        }
                                    }}
                                    >
                                        <Editing confirmDelete={false}/>
                                        <Scrolling mode="standard" />
                                        <Paging defaultPageSize={9} />
                                        <Column dataField="LDATE" caption={this.lang.t("grdList.LDATE")} width={40} alignment={"center"} dataType={"datetime"} format={"dd-MM-yyyy - HH:mm:ss SSSZ"} defaultSortOrder="desc" visible={false} cssClass={"cell-fontsize"}/>
                                        <Column dataField="NO" caption={""} width={30} cellTemplate={(cellElement,cellInfo)=>
                                        {
                                            cellElement.innerText = this.posObj.posSale.dt().length - cellInfo.rowIndex
                                        }}
                                        alignment={"center"} cssClass={"cell-fontsize"}/>                                    
                                        <Column dataField="ITEM_SNAME" caption={this.lang.t("grdList.ITEM_NAME")} width={220} cssClass={"cell-fontsize"}/>
                                        <Column dataField="QUANTITY" caption={this.lang.t("grdList.QUANTITY")} width={80} cellRender={(e)=>{return (e.data.SCALE_MANUEL == true ? "M-" : "") + (this.isUnitDecimal(e.data.UNIT_SHORT) ? Number(e.value / e.data.UNIT_FACTOR).toFixed(3) : Number(e.value / e.data.UNIT_FACTOR).toFixed(0)) + e.data.UNIT_SHORT}} format={"#,##0.000" } cssClass={"cell-fontsize"}/>
                                        <Column dataField="PRICE" caption={this.lang.t("grdList.PRICE")} width={80} cellRender={(e)=>{return Number(e.value * e.data.UNIT_FACTOR).toFixed(2) + Number.money.sign + '/' + e.data.UNIT_SHORT}} cssClass={"cell-fontsize"}/>
                                        <Column dataField="AMOUNT" alignment={"right"} caption={this.lang.t("grdList.AMOUNT")} width={60} format={"#,##0.00" + Number.money.sign} cssClass={"cell-fontsize"}/>                                                
                                    </NdGrid>
                                </div>
                            </NdLayoutItem>
                            {/* grandTotalLy */}
                            <NdLayoutItem key={"grandTotalLy"} id={"grandTotalLy"} parent={this} data-grid={{x:0,y:80,h:15,w:35,minH:15,maxH:30,minW:35,maxW:35}} 
                            access={this.acsObj.filter({ELEMENT:'grandTotalLy',USERS:this.user.CODE})}>
                                <div>
                                    <div className="row">
                                        <div className="col-7 pe-1">
                                            <div className="row">
                                                <div className="col-5 pe-1">
                                                    <p className="text-primary text-start m-0">{this.lang.t("totalLine")}<span className="text-dark"><NbLabel id="totalRowCount" parent={this} value={"0"}/></span></p>    
                                                </div>
                                                <div className="col-7 ps-1">
                                                    <p className="text-primary text-start m-0">{this.lang.t("totalQuantity")}<span className="text-dark"><NbLabel id="totalItemCount" parent={this} value={"0"}/></span></p>    
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <p className="text-primary text-start m-0">{this.lang.t("loyaltyDiscount")}<span className="text-dark"><NbLabel id="totalLoyalty" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <p className="text-primary text-start m-0">{this.lang.t("ticketRect")}<span className="text-dark"><NbLabel id="txtTicRest" parent={this} value={""}/></span></p>    
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-5 ps-1">
                                            <div className="row">
                                                <div className="col-12">
                                                    <p className="text-primary text-end m-0">{this.lang.t("amount")}<span className="text-dark"><NbLabel id="totalSub" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <p className="text-primary text-end m-0">{this.lang.t("vat")}<span className="text-dark"><NbLabel id="totalVat" parent={this} value={"0.00 " + Number.money.sign} format={"currency"}/></span></p>    
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <p className="text-primary text-end m-0">{this.lang.t("discount")}<span className="text-dark"><NbLabel id="totalDiscount" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </NdLayoutItem>
                            {/* lblTotalLy */}
                            <NdLayoutItem key={"lblTotalLy"} id={"lblTotalLy"} parent={this} data-grid={{x:0,y:100,h:10,w:35,minH:10,maxH:30,minW:5,maxW:35}} 
                            access={this.acsObj.filter({ELEMENT:'lblTotalLy',USERS:this.user.CODE})}>
                                <div>
                                    <div className="row">
                                        <div className="col-12">
                                            <p className="fs-2 fw-bold text-center m-0"><NbLabel id="totalGrand" parent={this} value={"0.00"} format={"currency"}/></p>
                                        </div>
                                    </div>
                                </div>
                            </NdLayoutItem>
                            {/* btnTotalLy */}
                            <NdLayoutItem key={"btnTotalLy"} id={"btnTotalLy"} parent={this} data-grid={{x:0,y:110,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnTotalLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnTotal"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async ()=>
                                    {
                                        if(this.posObj.posSale.dt().length == 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgCollectForSale',showTitle:true,title:this.lang.t("msgCollectForSale.title"),showCloseButton:false,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgCollectForSale.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCollectForSale.msg")}</div>)
                                            }
                                            let tmpMsgResult = await dialog(tmpConfObj);
                                            if(tmpMsgResult == 'btn01')
                                            {
                                                return
                                            }
                                        }  
                                        
                                        let tmpPayRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).round(2));

                                        let tmpLcdStr = ("").space(20,"s") + ("TOTAL : " + (parseFloat(tmpPayRest).round(2).toFixed(2) + Number.money.code)).space(20,"s")
                                        this.posLcd.print({blink:0,text:tmpLcdStr})
                                        App.instance.electronSend({tag:"lcd",digit:tmpLcdStr})

                                        this.rbtnPayType.value = 0                                                                       
                                        this.popTotal.show();
                                        this.txtPopTotal.newStart = true;
                                    }}>
                                        <i className="text-white fa-solid fa-sack-dollar" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnCreditCardLy */}
                            <NdLayoutItem key={"btnCreditCardLy"} id={"btnCreditCardLy"} parent={this} data-grid={{x:5,y:110,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnCreditCardLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnCreditCard"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async ()=>
                                    {                  
                                        if(this.posObj.posSale.dt().length == 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgCollectForSale',showTitle:true,title:this.lang.t("msgCollectForSale.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgCollectForSale.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCollectForSale.msg")}</div>)
                                            }
                                            let tmpMsgResult = await dialog(tmpConfObj);
                                            if(tmpMsgResult == 'btn01')
                                            {
                                                return
                                            }
                                        }
                                        
                                        let tmpPayRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).round(2));
                                        
                                        let tmpLcdStr = ("").space(20,"s") + ("TOTAL : " + (parseFloat(tmpPayRest).round(2).toFixed(2) + Number.money.code)).space(20,"s")
                                        this.posLcd.print({blink : 0,text : tmpLcdStr})
                                        App.instance.electronSend({tag:"lcd",digit:tmpLcdStr})

                                        this.popCardPay.show();
                                        this.txtPopCardPay.newStart = true;
                                    }}>
                                        <i className={"text-white fa-solid " + (this.payType.where({TYPE:1}).length > 0 ? this.payType.where({TYPE:1})[0].ICON : "")} style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKey7Ly */}
                            <NdLayoutItem key={"btnKey7Ly"} id={"btnKey7Ly"} parent={this} data-grid={{x:10,y:110,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKey7Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKey7"} parent={this} keyBtn={{textbox:"txtBarcode",key:"7"}} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-7" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKey8Ly */}
                            <NdLayoutItem key={"btnKey8Ly"} id={"btnKey8Ly"} parent={this} data-grid={{x:15,y:110,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKey8Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKey8"} parent={this} keyBtn={{textbox:"txtBarcode",key:"8"}} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-8" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKey9Ly */}
                            <NdLayoutItem key={"btnKey9Ly"} id={"btnKey9Ly"} parent={this} data-grid={{x:20,y:110,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKey9Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKey9"} parent={this} keyBtn={{textbox:"txtBarcode",key:"9"}} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-9" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnCheckLy */}
                            <NdLayoutItem key={"btnCheckLy"} id={"btnCheckLy"} parent={this} data-grid={{x:25,y:110,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnCheckLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnCheck"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={()=>
                                    {
                                        this.getItem(this.txtBarcode.dev.option("value"))
                                    }}>
                                        <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnSafeOpenLy */}
                            <NdLayoutItem key={"btnSafeOpenLy"} id={"btnSafeOpenLy"} parent={this} data-grid={{x:0,y:126,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnSafeOpenLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnSafeOpen"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    access={this.acsObj.filter({ELEMENT:'btnSafeOpen',USERS:this.user.CODE})}
                                    onClick={async ()=>
                                    {
                                        this.posDevice.caseOpen();
                                    }}
                                    >
                                        <i className="text-white fa-solid fa-inbox" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnCashLy */}
                            <NdLayoutItem key={"btnCashLy"} id={"btnCashLy"} parent={this} data-grid={{x:5,y:126,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnCashLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnCash"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async ()=>
                                    {           
                                        if(this.posObj.posSale.dt().length == 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgCollectForSale',showTitle:true,title:this.lang.t("msgCollectForSale.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgCollectForSale.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCollectForSale.msg")}</div>)
                                            }
                                            let tmpMsgResult = await dialog(tmpConfObj);
                                            if(tmpMsgResult == 'btn01')
                                            {
                                                return
                                            }
                                        }   
                                                    
                                        let tmpPayRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).round(2));
                                        
                                        let tmpLcdStr = ("").space(20,"s") + ("TOTAL : " + (parseFloat(tmpPayRest).round(2).toFixed(2) + Number.money.code)).space(20,"s")
                                        this.posLcd.print({blink : 0,text : tmpLcdStr})
                                        App.instance.electronSend({tag:"lcd",digit:tmpLcdStr})

                                        this.popCashPay.show();
                                        this.txtPopCashPay.newStart = true;
                                    }}>
                                        <i className={"text-white fa-solid " + (this.payType.where({TYPE:0}).length > 0 ? this.payType.where({TYPE:0})[0].ICON : "")} style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnExchangeLy */}
                            <NdLayoutItem key={"btnExchangeLy"} id={"btnExchangeLy"} parent={this} data-grid={{x:5,y:126,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnExchangeLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnExchange"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async ()=>
                                    {           
                                        if(this.posObj.posSale.dt().length == 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgCollectForSale',showTitle:true,title:this.lang.t("msgCollectForSale.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgCollectForSale.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCollectForSale.msg")}</div>)
                                            }
                                            let tmpMsgResult = await dialog(tmpConfObj);
                                            if(tmpMsgResult == 'btn01')
                                            {
                                                return
                                            }
                                        }   
                                                    
                                        let tmpPayRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).round(2));
                                        
                                        let tmpLcdStr = ("").space(20,"s") + ("TOTAL : " + (parseFloat(tmpPayRest).round(2).toFixed(2) + Number.money.code)).space(20,"s")
                                        this.posLcd.print({blink : 0,text : tmpLcdStr})
                                        App.instance.electronSend({tag:"lcd",digit:tmpLcdStr})

                                        let tmpExchangeRate = 1
                                        let tmpTotalGrand = this.posObj.dt()[0].TOTAL
                                        let tmpRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).round(2))
                                        
                                        if(this.payType.where({TYPE:8}).length > 0 && typeof this.payType.where({TYPE:8})[0].RATE != 'undefined')
                                        {
                                            tmpExchangeRate = Number(this.payType.where({TYPE:8})[0].RATE).round(2)
                                        }

                                        this.popExchangeTotalGrand.value = Number(Number(tmpTotalGrand) * Number(tmpExchangeRate)).round(2)
                                        this.payExchangeRest.value = Number(Number(tmpRest) * Number(tmpExchangeRate)).round(2)
                                        
                                        this.popExchangePay.show();
                                        this.txtPopExchangePay.newStart = true;
                                    }}>
                                        <i className={"text-white fa-solid " + (this.payType.where({TYPE:8}).length > 0 ? this.payType.where({TYPE:8})[0].ICON : "")} style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnCardTicketLy */}
                            <NdLayoutItem key={"btnCardTicketLy"} id={"btnCardTicketLy"} parent={this} data-grid={{x:5,y:126,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnCardTicketLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnCardTicket"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async ()=>
                                    {           
                                        if(this.posObj.posSale.dt().length == 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgCollectForSale',showTitle:true,title:this.lang.t("msgCollectForSale.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgCollectForSale.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCollectForSale.msg")}</div>)
                                            }
                                            let tmpMsgResult = await dialog(tmpConfObj);
                                            if(tmpMsgResult == 'btn01')
                                            {
                                                return
                                            }
                                        }   
                                                    
                                        let tmpPayRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).round(2));
                                        
                                        let tmpLcdStr = ("").space(20,"s") + ("TOTAL : " + (parseFloat(tmpPayRest).round(2).toFixed(2) + Number.money.code)).space(20,"s")
                                        this.posLcd.print({blink : 0,text : tmpLcdStr})
                                        App.instance.electronSend({tag:"lcd",digit:tmpLcdStr})

                                        let tmpTotalGrand = this.posObj.dt()[0].TOTAL
                                        let tmpRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).round(2))                                        

                                        this.popCardTotalGrand.value = Number(tmpTotalGrand).round(2)
                                        this.payCardTotalRest.value = Number(tmpRest).round(2)
                                        
                                        this.popCardTicketPay.show();
                                        this.txtPopCardTicketPay.newStart = true;
                                    }}>
                                        <i className={"text-white fa-solid " + (this.payType.where({TYPE:9}).length > 0 ? this.payType.where({TYPE:9})[0].ICON : "")} style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKey4Ly */}
                            <NdLayoutItem key={"btnKey4Ly"} id={"btnKey4Ly"} parent={this} data-grid={{x:10,y:126,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKey4Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKey4"} parent={this} keyBtn={{textbox:"txtBarcode",key:"4"}} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-4" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKey5Ly */}
                            <NdLayoutItem key={"btnKey5Ly"} id={"btnKey5Ly"} parent={this} data-grid={{x:15,y:126,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKey5Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKey5"} parent={this} keyBtn={{textbox:"txtBarcode",key:"5"}} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-5" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKey6Ly */}
                            <NdLayoutItem key={"btnKey6Ly"} id={"btnKey6Ly"} parent={this} data-grid={{x:20,y:126,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKey6Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKey6"} parent={this} keyBtn={{textbox:"txtBarcode",key:"6"}} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-6" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKeyBsLy */}
                            <NdLayoutItem key={"btnKeyBsLy"} id={"btnKeyBsLy"} parent={this} data-grid={{x:25,y:126,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKeyBsLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKeyBs"} parent={this} keyBtn={{textbox:"txtBarcode",key:"Backspace"}} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-delete-left" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnDiscountLy */}
                            <NdLayoutItem key={"btnDiscountLy"} id={"btnDiscountLy"} parent={this} data-grid={{x:0,y:142,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnDiscountLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnDiscount"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    access={this.acsObj.filter({ELEMENT:'btnDiscount',USERS:this.user.CODE})}
                                    onClick={async()=>
                                    {   
                                        await this.grdDiscList.dataRefresh({source:this.posObj.posSale.dt().where({PROMO_TYPE:0}).where({ITEM_NAME:{'<>':'SUB TOTAL'}})});
                                        this.popDiscount.show()
                                    }}>
                                        <i className="text-white fa-solid fa-percent" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnCheqpayLy */}
                            <NdLayoutItem key={"btnCheqpayLy"} id={"btnCheqpayLy"} parent={this} data-grid={{x:5,y:142,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnCheqpayLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnCheqpay"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async ()=>
                                    {
                                        //TICKET REST. SADAKAT PUAN KULLANIMI PARAMETRESI
                                        if(this.prmObj.filter({ID:'UseTicketRestLoyalty',TYPE:0}).getValue() == 0)
                                        {
                                            if(this.customerName.value != '')
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgTicketForNotCustomer',showTitle:true,title:this.lang.t("msgTicketForNotCustomer.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("msgTicketForNotCustomer.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgTicketForNotCustomer.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return
                                            }
                                        }

                                        if(this.posObj.posSale.dt().length == 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgPayForSelling',showTitle:true,title:this.lang.t("msgPayForSelling.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgPayForSelling.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPayForSelling.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        
                                        await this.cheqDt.refresh();
                                        await this.grdPopCheqpayList.dataRefresh({source:this.cheqDt});
                                        this.core.util.writeLog("calcGrandTotal : 12")
                                        await this.calcGrandTotal(false);
                                        await this.core.util.waitUntil(500)
                                        
                                        this.popCheqpay.show();
                                    }}>
                                        <i className={"text-white fa-solid " + (this.payType.where({TYPE:3}).length > 0 ? this.payType.where({TYPE:3})[0].ICON : "")} style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKey1Ly */}
                            <NdLayoutItem key={"btnKey1Ly"} id={"btnKey1Ly"} parent={this} data-grid={{x:10,y:142,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKey1Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKey1"} parent={this} keyBtn={{textbox:"txtBarcode",key:"1"}} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-1" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKey2Ly */}
                            <NdLayoutItem key={"btnKey2Ly"} id={"btnKey2Ly"} parent={this} data-grid={{x:15,y:142,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKey2Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKey2"} parent={this} keyBtn={{textbox:"txtBarcode",key:"2"}} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-2" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKey3Ly */}
                            <NdLayoutItem key={"btnKey3Ly"} id={"btnKey3Ly"} parent={this} data-grid={{x:20,y:142,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKey3Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKey3"} parent={this} keyBtn={{textbox:"txtBarcode",key:"3"}} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-3" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKeyXLy */}
                            <NdLayoutItem key={"btnKeyXLy"} id={"btnKeyXLy"} parent={this} data-grid={{x:25,y:142,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKeyXLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKeyX"} parent={this} keyBtn={{textbox:"txtBarcode",key:"*"}} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnCustomerPointLy */}
                            <NdLayoutItem key={"btnCustomerPointLy"} id={"btnCustomerPointLy"} parent={this} data-grid={{x:0,y:158,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnCustomerPointLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnCustomerPoint"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async ()=>
                                    {
                                        if(this.customerName.value == '')
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgCustomerSelect',showTitle:true,title:this.lang.t("msgCustomerSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgCustomerSelect.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCustomerSelect.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        
                                        if(this.popCustomerUsePoint.value != 0)
                                        {
                                            this.txtPopLoyalty.value = this.popCustomerUsePoint.value
                                        }
                                        else
                                        {
                                            this.txtPopLoyalty.value = this.customerPoint.value
                                        }
                                        
                                        this.popLoyalty.show()
                                        this.txtPopLoyalty.newStart = true;
                                    }}>
                                        <i className="text-white fa-solid fa-gift" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnInfoLy */}
                            <NdLayoutItem key={"btnInfoLy"} id={"btnInfoLy"} parent={this} data-grid={{x:5,y:158,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnInfoLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnInfo"} parent={this} className={"form-group btn btn-info btn-block"} style={{height:"100%",width:"100%"}}
                                    onClick={()=>
                                    {
                                        if(this.btnInfo.lock)
                                        {
                                            this.btnInfo.setUnLock({backgroundColor:"#0dcaf0",borderColor:"#0dcaf0",height:"50px",width:"100%"})
                                        }
                                        else
                                        {
                                            this.btnInfo.setLock({backgroundColor:"#dc3545",borderColor:"#dc3545",height:"50px",width:"100%"})
                                        }
                                    }}>
                                        <i className="text-white fa-solid fa-circle-info" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKeyDotLy */}
                            <NdLayoutItem key={"btnKeyDotLy"} id={"btnKeyDotLy"} parent={this} data-grid={{x:10,y:158,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKeyDotLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKeyDot"} parent={this} keyBtn={{textbox:"txtBarcode",key:"."}} className="form-group btn btn-primary btn-block" 
                                    style={{height:"100%",width:"100%",fontSize:"26pt"}}><div style={{height:"100%",lineHeight:'18px'}}>.</div></NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnKey0Ly */}
                            <NdLayoutItem key={"btnKey0Ly"} id={"btnKey0Ly"} parent={this} data-grid={{x:15,y:158,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnKey0Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnKey0"} parent={this} keyBtn={{textbox:"txtBarcode",key:"0"}} className="form-group btn btn-primary btn-block" 
                                    style={{height:"100%",width:"100%"}}>
                                        <i className="text-white fa-solid fa-0" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnNegative1Ly */}
                            <NdLayoutItem key={"btnNegative1Ly"} id={"btnNegative1Ly"} parent={this} data-grid={{x:20,y:158,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnNegative1Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnNegative1"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%",fontSize:"20pt"}}
                                    onClick={async ()=>
                                    {
                                        if(this.grdList.devGrid.getSelectedRowsData().length > 0)
                                        {
                                            if(this.grdList.devGrid.getSelectedRowsData()[0].QUANTITY > 1)
                                            {
                                                let tmpData = 
                                                {
                                                    QUANTITY:Number(this.grdList.devGrid.getSelectedRowsData()[0].QUANTITY) - Number(this.grdList.devGrid.getSelectedRowsData()[0].UNIT_FACTOR),
                                                    PRICE:this.grdList.devGrid.getSelectedRowsData()[0].PRICE
                                                }
                                                this.saleRowUpdate(this.grdList.devGrid.getSelectedRowsData()[0],tmpData)
                                            }
                                        }
                                    }}><div style={{height:"50px",lineHeight:'35px'}}>-1</div></NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnPlus1Ly */}
                            <NdLayoutItem key={"btnPlus1Ly"} id={"btnPlus1Ly"} parent={this} data-grid={{x:25,y:158,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnPlus1Ly',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnPlus1"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%",fontSize:"20pt"}}
                                    onClick={async ()=>
                                    {
                                        if(this.grdList.devGrid.getSelectedRowsData().length > 0)
                                        {
                                            let tmpData = 
                                            {
                                                QUANTITY:Number(this.grdList.devGrid.getSelectedRowsData()[0].QUANTITY) + Number(this.grdList.devGrid.getSelectedRowsData()[0].UNIT_FACTOR),
                                                PRICE:this.grdList.devGrid.getSelectedRowsData()[0].PRICE
                                            }
                                            this.saleRowUpdate(this.grdList.devGrid.getSelectedRowsData()[0],tmpData)
                                        }
                                    }}><div style={{height:"50px",lineHeight:'35px'}}>+1</div></NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* lblAboutLy */}
                            <NdLayoutItem key={"lblAboutLy"} id={"lblAboutLy"} parent={this} data-grid={{x:35,y:0,h:10,w:35,minH:2,maxH:10,minW:35,maxW:35}} 
                            access={this.acsObj.filter({ELEMENT:'lblAboutLy',USERS:this.user.CODE})}>
                                <div>
                                    <div className="row" style={{backgroundColor:this.state.isFormation ? 'coral' : 'white',marginLeft:'1px',marginRight:'0.5px',borderRadius:'5px'}}>
                                        <div className="col-8 px-1">
                                            <a className="link-primary" onClick={()=>{this.popAbout.show()}} style={{textDecoration:'none'}}>{"Piqsoft " + this.lang.t("about")}  -  </a>
                                            <a className="link-primary" onClick={()=>{this.popBalanceAbout.show()}} style={{textDecoration:'none'}}>{"Balance " + this.lang.t("about")}</a>
                                        </div>
                                        <div className="col-4 text-end">
                                            <NbLabel id="formation" parent={this} value={''}/>
                                        </div>
                                    </div>
                                </div>
                            </NdLayoutItem>
                            {/* btnUpLy */}
                            <NdLayoutItem key={"btnUpLy"} id={"btnUpLy"} parent={this} data-grid={{x:35,y:10,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnUpLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnUp"} parent={this} className="form-group btn btn-success btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
                                        {
                                            let tmpRowIndex = this.posObj.posSale.dt().getIndexByKey(this.grdList.devGrid.getSelectedRowKeys()[0]);
                                                                                                    
                                            if(tmpRowIndex > 0)
                                            {
                                                this.grdList.devGrid.navigateToRow(this.posObj.posSale.dt()[tmpRowIndex - 1])
                                                this.grdList.devGrid.selectRows(this.posObj.posSale.dt()[tmpRowIndex - 1],false)
                                            }
                                        }
                                    }}>
                                        <i className="text-white fa-solid fa-arrow-up" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnDownLy */}
                            <NdLayoutItem key={"btnDownLy"} id={"btnDownLy"} parent={this} data-grid={{x:35,y:26,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnDownLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnDown"} parent={this} className="form-group btn btn-success btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
                                        {
                                            let tmpRowIndex = this.posObj.posSale.dt().getIndexByKey(this.grdList.devGrid.getSelectedRowKeys()[0]);
                                            if(tmpRowIndex < (this.posObj.posSale.dt().length - 1))
                                            {
                                                this.grdList.devGrid.navigateToRow(this.posObj.posSale.dt()[tmpRowIndex + 1])
                                                this.grdList.devGrid.selectRows(this.posObj.posSale.dt()[tmpRowIndex + 1],false)
                                            }
                                        }
                                    }}>
                                        <i className="text-white fa-solid fa-arrow-down" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnDeleteLy */}
                            <NdLayoutItem key={"btnDeleteLy"} id={"btnDeleteLy"} parent={this} data-grid={{x:35,y:42,h:16,w:5,minH:2,maxH:5,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnDeleteLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnDelete"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        let tmpAcsVal = this.acsObj.filter({ID:'btnFullDelete',USERS:this.user.CODE})
                            
                                        if(typeof tmpAcsVal.getValue().dialog != 'undefined' && tmpAcsVal.getValue().dialog.type != -1)
                                        {   
                                            let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:tmpAcsVal.getValue().dialog.type})
                                            if(!tmpResult)
                                            {
                                                return
                                            }
                                        }
                                        if(this.posObj.posSale.dt().length > 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocDeleteConfirm',showTitle:true,title:this.lang.t("msgDocDeleteConfirm.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgLineDeleteConfirm.btn01"),location:'after'},{id:"btn02",caption:this.lang.t("msgLineDeleteConfirm.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDocDeleteConfirm.msg")}</div>)
                                            }
                                            let tmpResult = await dialog(tmpConfObj);
                                            if(tmpResult == "btn01")
                                            {
                                                this.popDeleteDesc.show()
                                            }
                                        }
                                    }}>
                                        <i className="text-white fa-solid fa-eraser" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnLineDeleteLy */}
                            <NdLayoutItem key={"btnLineDeleteLy"} id={"btnLineDeleteLy"} parent={this} data-grid={{x:35,y:58,h:16,w:5,minH:2,maxH:5,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnLineDeleteLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnLineDelete"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async ()=>
                                    {
                                        if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
                                        {
                                            if(this.posObj.posPay.dt().length > 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgLineDeleteValidation',showTitle:true,title:this.lang.t("msgLineDeleteValidation.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("msgLineDeleteValidation.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgLineDeleteValidation.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return
                                            }

                                            let tmpConfObj =
                                            {
                                                id:'msgLineDeleteConfirm',showTitle:true,title:this.lang.t("msgLineDeleteConfirm.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgLineDeleteConfirm.btn01"),location:'after'},{id:"btn02",caption:this.lang.t("msgLineDeleteConfirm.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgLineDeleteConfirm.msg")}</div>)
                                            }
                                            let tmpResult = await dialog(tmpConfObj);
                                            if(tmpResult == "btn01")
                                            {
                                                this.popRowDeleteDesc.show()
                                            }
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDeleteLineSelect',showTitle:true,title:this.lang.t("msgDeleteLineSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgDeleteLineSelect.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDeleteLineSelect.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                        }
                                    }}>
                                        <i className="text-white fa-solid fa-outdent" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnItemReturnLy */}
                            <NdLayoutItem key={"btnItemReturnLy"} id={"btnItemReturnLy"} parent={this} data-grid={{x:35,y:74,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnItemReturnLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnItemReturn"} parent={this} className="form-group btn btn-block" style={{height:"100%",width:"100%",backgroundColor:"#e84393"}}
                                    onClick={async ()=>
                                    {
                                        let tmpAcsVal = this.acsObj.filter({ID:'btnReturnEntry',USERS:this.user.CODE})
                                    
                                        if(typeof tmpAcsVal.getValue().dialog != 'undefined' && tmpAcsVal.getValue().dialog.type != -1)
                                        {   
                                            let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:tmpAcsVal.getValue().dialog.type})
                                            if(!tmpResult)
                                            {
                                                return
                                            }
                                        }
                                        if(this.core.offline)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgOfflineWarning',showTitle:true,title:this.lang.t("msgOfflineWarning.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgOfflineWarning.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOfflineWarning.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        if(this.posObj.posSale.dt().length > 0)
                                        {
                                            await this.msgItemReturnTicket.show().then(async (e) =>
                                            {
                                                if(e == 'btn01')
                                                {
                                                    this.ticketCheck(this.txtItemReturnTicket.value)
                                                }
                                                else if(e == 'btn03')
                                                {
                                                    this.dtpopRebateTicletStartDate.value = moment(new Date()).format("YYYY-MM-DD")
                                                    this.dtpopRebateTicletFinishDate.value = moment(new Date()).format("YYYY-MM-DD")
                                                    this.cmbpopRebateTicletUser.value = this.core.auth.data.CODE
                                                    this.rebateTicketPopup.show()
                                                }
                                            })                                                
                                        }
                                    }}>
                                        <i className="text-white fa-solid fa-retweet" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* pluBtnGrpLy */}
                            <NdLayoutItem key={"pluBtnGrpLy"} id={"pluBtnGrpLy"} parent={this} data-grid={{x:40,y:3,h:82,w:30,minH:10,maxH:200,minW:30,maxW:30}} style={{margin:'-4px'}}
                            access={this.acsObj.filter({ELEMENT:'pluBtnGrpLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbPluButtonGrp id="pluBtnGrp" parent={this} keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}
                                    onSelection={(pItem,pQuantity)=>
                                    {
                                        if(this.txtBarcode.value != '')
                                        {
                                            this.getItem(this.txtBarcode.value + pItem)
                                        }
                                        else
                                        {
                                            if(typeof pQuantity == 'undefined')
                                            {
                                                pQuantity = 1
                                            }
                                            this.getItem(pQuantity + '*' + pItem)
                                        }
                                    }}/>
                                </div>
                            </NdLayoutItem>
                            {/* btnPriceDiffLy */}
                            <NdLayoutItem key={"btnPriceDiffLy"} id={"btnPriceDiffLy"} parent={this} data-grid={{x:35,y:90,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnPriceDiffLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnPriceDiff"} parent={this} className="form-group btn btn-block" style={{height:"100%",width:"100%",fontSize:"10pt",backgroundColor:"#e84393"}}
                                    onClick={async()=>
                                    {          
                                        if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
                                        {
                                            this.txtPopDiffPriceQ.value = this.grdList.devGrid.getSelectedRowKeys()[0].QUANTITY < 0 ? this.grdList.devGrid.getSelectedRowKeys()[0].QUANTITY * -1 : this.grdList.devGrid.getSelectedRowKeys()[0].QUANTITY;
                                            this.txtPopDiffPriceP.value = this.grdList.devGrid.getSelectedRowKeys()[0].PRICE;
                                            this.txtPopDiffPriceQ.newStart = true
                                            this.popDiffPrice.show();
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgLineSelect',showTitle:true,title:this.lang.t("msgLineSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgLineSelect.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgLineSelect.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                        }
                                    }}>
                                        <i className="text-white fa-solid fa-plus-minus" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnItemSearchLy */}
                            <NdLayoutItem key={"btnItemSearchLy"} id={"btnItemSearchLy"} parent={this} data-grid={{x:40,y:90,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnItemSearchLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnItemSearch"} parent={this} className={"form-group btn btn-info btn-block"} style={{height:"100%",width:"100%"}}
                                    onClick={()=>
                                    {
                                        if(this.btnItemSearch.lock)
                                        {
                                            this.btnItemSearch.setUnLock({backgroundColor:"#0dcaf0",borderColor:"#0dcaf0",height:"100%",width:"100%"})
                                        }
                                        else
                                        {
                                            this.btnItemSearch.setLock({backgroundColor:"#dc3545",borderColor:"#dc3545",height:"100%",width:"100%"})
                                        }
                                    }}>
                                        <i className="text-white fa-solid fa-magnifying-glass-chart" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnZReportLy */}
                            <NdLayoutItem key={"btnZReportLy"} id={"btnZReportLy"} parent={this} data-grid={{x:45,y:90,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnZReportLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnZReport"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%",fontSize:"10pt"}}
                                    onClick={()=>
                                    {
                                        this.ZReport()
                                    }}>
                                        <i className="text-white fa-solid fa-chart-pie" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnGrdListLy */}
                            <NdLayoutItem key={"btnGrdListLy"} id={"btnGrdListLy"} parent={this} data-grid={{x:50,y:90,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnGrdListLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnGrdList"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%",fontSize:"10pt"}}
                                    onClick={async()=>
                                    {
                                        let tmpDt = this.posObj.posSale.dt().toArray()
                                        for (let i = 0; i < tmpDt.length; i++) 
                                        {
                                            if(tmpDt[i].DISCOUNT > 0)
                                            {
                                                tmpDt[i].DISCPRICE = tmpDt[i].PRICE - (tmpDt[i].DISCOUNT / tmpDt[i].QUANTITY)    
                                            }
                                            else
                                            {
                                                tmpDt[i].DISCPRICE = 0
                                            }
                                        }

                                        await this.grdPopGrdList.dataRefresh({source:tmpDt});
                                        this.popGridList.show();
                                    }}>
                                        <i className="text-white fa-solid fa-bars" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnFormationLy */}
                            <NdLayoutItem key={"btnFormationLy"} id={"btnFormationLy"} parent={this} data-grid={{x:55,y:90,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnFormationLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnFormation"} parent={this} className={this.state.isFormation == false ? "form-group btn btn-info btn-block" : "form-group btn btn-danger btn-block"} style={{height:"100%",width:"100%",fontSize:"18pt",color:"white"}}
                                    onClick={async()=>
                                    {             
                                        let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:0})

                                        if(!tmpResult)
                                        {
                                            return
                                        }

                                        if(this.state.isFormation == false)
                                        {
                                            this.sendJet({CODE:"100",NAME:"Mode formation lancé."}) ////Formasyon başladı.
                                        }
                                        else
                                        {
                                            this.sendJet({CODE:"105",NAME:"Mode formation terminé."}) //// Formasyon sonlandı.
                                        }

                                        this.setState({isFormation:this.state.isFormation ? false : true})
                                        this.formation.value = this.state.isFormation ? 'FORMATION' : ''
                                        this.init()
                                    }}>
                                        <i className="fa-solid fa-highlighter"></i>
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnOrderListLy */}
                            <NdLayoutItem key={"btnOrderListLy"} id={"btnOrderListLy"} parent={this} data-grid={{x:60,y:90,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnOrderListLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnOrderList"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%",fontSize:"10pt"}}
                                    onClick={async()=>
                                    {
                                        //LOCAL DB İÇİN YAPILDI - ALI KEMAL KARACA 24.08.2022
                                        if(this.core.offline)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgOfflineWarning',showTitle:true,title:this.lang.t("msgOfflineWarning.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgOfflineWarning.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOfflineWarning.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                                    
                                        let tmpOrderList = new datatable();
                                        tmpOrderList.selectCmd = 
                                        {
                                            query : "SELECT REF,REF_NO,DOC_DATE,INPUT_CODE,INPUT_NAME,DOC_GUID,SUM(TOTAL) AS TOTAL " +
                                                    "FROM DOC_ORDERS_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 62 AND CLOSED < 2 GROUP BY REF,REF_NO,DOC_DATE,INPUT_CODE,INPUT_NAME,DOC_GUID ",
                                        }
                                        await tmpOrderList.refresh()
                                        await this.grdPopOrderList.dataRefresh({source:tmpOrderList});
                                        this.popOrderList.show();
                                    }}>
                                        <i className="text-white fa-solid fa-business-time" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnAdvanceLy */}
                            <NdLayoutItem key={"btnAdvanceLy"} id={"btnAdvanceLy"} parent={this} data-grid={{x:65,y:90,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnAdvanceLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnAdvance"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        //LOCAL DB İÇİN YAPILDI - ALI KEMAL KARACA 24.08.2022
                                        if(this.core.offline)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgOfflineWarning',showTitle:true,title:this.lang.t("msgOfflineWarning.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgOfflineWarning.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOfflineWarning.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }

                                        this.rbtnAdvanceType.value = 0
                                        this.txtPopAdvance.value = 0
                                        this.txtPopAdvance.newStart = true
                                        this.popAdvance.show()
                                    }}>
                                        <i className="text-white fa-solid fa-circle-dollar-to-slot" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnParkListLy */}
                            <NdLayoutItem key={"btnParkListLy"} id={"btnParkListLy"} parent={this} data-grid={{x:35,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnParkListLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnParkList"} parent={this} className="form-group btn btn-warning btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async ()=>
                                    {
                                        this.parkDt.selectCmd.value[0] = this.core.auth.data.CODE;
                                        await this.parkDt.refresh();
                                        await this.grdPopParkList.dataRefresh({source:this.parkDt});
                                        this.popParkList.show();
                                    }}>
                                        <span className="text-white" style={{fontWeight: 'bold'}}><i className="text-white fa-solid fa-arrow-up-right-from-square pe-2" style={{fontSize: "24px"}} />{this.parkDt.length}</span>                                            
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnSubtotalLy */}
                            <NdLayoutItem key={"btnSubtotalLy"} id={"btnSubtotalLy"} parent={this} data-grid={{x:40,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnSubtotalLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnSubtotal"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        let tmpData = this.posObj.posSale.dt().where({SUBTOTAL:0})
                                        let tmpMaxSub = this.posObj.posSale.dt().where({SUBTOTAL:{'<>':-1}}).max('SUBTOTAL') + 1
                                        for (let i = 0; i < tmpData.length; i++) 
                                        {
                                            tmpData[i].SUBTOTAL = tmpMaxSub
                                        }
                                        this.core.util.writeLog("calcGrandTotal : 13")
                                        await this.calcGrandTotal()
                                    }}>
                                        <i className="text-white fa-solid fa-square-root-variable" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnCustomerAddLy */}
                            <NdLayoutItem key={"btnCustomerAddLy"} id={"btnCustomerAddLy"} parent={this} data-grid={{x:45,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnCustomerAddLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnCustomerAdd"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%",fontSize:"10pt"}}
                                    onClick={async()=>
                                    {
                                        //LOCAL DB İÇİN YAPILDI - ALI KEMAL KARACA 24.08.2022
                                        if(this.core.offline)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgOfflineWarning',showTitle:true,title:this.lang.t("msgOfflineWarning.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgOfflineWarning.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOfflineWarning.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }

                                        this.customerObj.clearAll()

                                        this.customerObj.addEmpty()
                                        this.customerObj.customerAdress.addEmpty()
                                        this.customerObj.customerOffical.addEmpty()
                                        
                                        this.txtPopCustomerCode.value = ""
                                        this.txtPopCustomerFirmName.value = ""
                                        this.txtPopCustomerName.value = ""
                                        this.txtPopCustomerSurname.value = ""
                                        this.txtPopCustomerAddress.value = ""
                                        this.txtPopCustomerCountry.value = ""
                                        this.txtPopCustomerCity.value = ""
                                        this.txtPopCustomerZipCode.value = ""
                                        this.txtPopCustomerEmail.value = ""
                                        this.txtPopCustomerTel.value = ""

                                        this.popCustomerAdd.show()
                                    }}>                                        
                                        <i className="text-white fa-solid fa-user-plus" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnCustomerListLy */}
                            <NdLayoutItem key={"btnCustomerListLy"} id={"btnCustomerListLy"} parent={this} data-grid={{x:50,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnCustomerListLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnCustomerList"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={()=>
                                    {                             
                                        this.popCustomerList.show();
                                    }}>
                                        <i className="text-white fa-solid fa-users" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnGetCustomerLy */}
                            <NdLayoutItem key={"btnGetCustomerLy"} id={"btnGetCustomerLy"} parent={this} data-grid={{x:55,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnGetCustomerLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnGetCustomer"} parent={this} className={"form-group btn btn-info btn-block"} style={{height:"100%",width:"100%"}}
                                    onClick={async ()=>
                                    {          
                                        if(this.btnGetCustomer.lock)
                                        {
                                            this.btnGetCustomer.setUnLock({backgroundColor:"#0dcaf0",borderColor:"#0dcaf0",height:"100%",width:"100%"})
                                        }
                                        else
                                        {
                                            if(this.posObj.dt()[0].CUSTOMER_GUID == '00000000-0000-0000-0000-000000000000')
                                            {
                                                //TICKET REST. SADAKAT PUAN KULLANIMI PARAMETRESI
                                                if(this.prmObj.filter({ID:'UseTicketRestLoyalty',TYPE:0}).getValue() == 0)
                                                {
                                                    if(this.posObj.posPay.dt().where({PAY_TYPE:3}).length > 0)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgTicketForNotCustomer',showTitle:true,title:this.lang.t("msgTicketForNotCustomer.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.lang.t("msgTicketForNotCustomer.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgTicketForNotCustomer.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        this.btnGetCustomer.setUnLock({backgroundColor:"#0dcaf0",borderColor:"#0dcaf0",height:"100%",width:"100%"})
                                                        return
                                                    }
                                                }
                                                this.btnGetCustomer.setLock({backgroundColor:"#dc3545",borderColor:"#dc3545",height:"100%",width:"100%"})
                                            }
                                        }
                                    }}>
                                        <i className="text-white fa-solid fa-circle-user" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnCalculatorLy */}
                            <NdLayoutItem key={"btnCalculatorLy"} id={"btnCalculatorLy"} parent={this} data-grid={{x:60,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnCalculatorLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnCalculator"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={()=>
                                    {                                                        
                                        this.Calculator.show();
                                    }}>
                                        <i className="text-white fa-solid fa-calculator" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnOfflineLy */}
                            <NdLayoutItem key={"btnOfflineLy"} id={"btnOfflineLy"} parent={this} data-grid={{x:65,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnOfflineLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnOffline"} parent={this} className={this.state.isConnected == false ? "form-group btn btn-danger btn-block" : "form-group btn btn-success btn-block"} style={{height:"100%",width:"100%",fontSize:"10pt"}}
                                    onClick={async ()=>
                                    {
                                        this.popTransfer.show()
                                    }}>
                                        <i className="text-white fa-solid fa-signal" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnParkLy */}
                            <NdLayoutItem key={"btnParkLy"} id={"btnParkLy"} parent={this} data-grid={{x:35,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnParkLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnPark"} parent={this} className="form-group btn btn-warning btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={()=>
                                    {
                                        if(this.posObj.posSale.dt().length > 0)
                                        {
                                            this.popParkDesc.show()
                                            setTimeout(() => 
                                            {
                                                if(this.posObj.posExtra.dt().where({TAG:"PARK DESC"}).length > 0)
                                                {
                                                    this.popParkDesc.setText(this.posObj.posExtra.dt().where({TAG:"PARK DESC"})[0].DESCRIPTION)
                                                }                                                    
                                            }, 100);
                                            
                                        }
                                    }}>
                                        <i className="text-white fa-solid fa-arrow-right-to-bracket" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnPrintLy */}
                            <NdLayoutItem key={"btnPrintLy"} id={"btnPrintLy"} parent={this} data-grid={{x:40,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnPrintLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnPrint"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async()=>
                                    {     
                                        //LOCAL DB İÇİN YAPILDI - ALI KEMAL KARACA 24.08.2022
                                        if(this.core.offline)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgOfflineWarning',showTitle:true,title:this.lang.t("msgOfflineWarning.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgOfflineWarning.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOfflineWarning.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        this.dtPopLastSaleStartDate.value = moment(new Date()).format("YYYY-MM-DD")
                                        this.dtPopLastSaleFinishDate.value = moment(new Date()).format("YYYY-MM-DD")
                                        this.cmbPopLastSaleUser.value = this.core.auth.data.CODE
                                        this.popLastSaleList.show();
                                    }}>
                                        <i className="text-white fa-solid fa-print" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                            {/* btnLastPrintLy */}
                            <NdLayoutItem key={"btnLastPrintLy"} id={"btnLastPrintLy"} parent={this} data-grid={{x:45,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
                            access={this.acsObj.filter({ELEMENT:'btnLastPrintLy',USERS:this.user.CODE})}>
                                <div>
                                    <NbButton id={"btnLastPrint"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        let tmpLastPosDt = new datatable();
                                        let tmpLastPosSaleDt = new datatable();
                                        let tmpLastPosPayDt = new datatable();
                                        let tmpLastPosPromoDt = new datatable();  

                                        tmpLastPosDt.selectCmd = 
                                        {
                                            query:  "SELECT TOP 1 *,CONVERT(NVARCHAR,LDATE,104) + '-' + CONVERT(NVARCHAR,LDATE,108) AS CONVERT_DATE, " +
                                                    "SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,36) AS REF_NO " + 
                                                    "FROM POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01 WHERE LUSER = @LUSER AND STATUS = 1 ORDER BY LDATE DESC",
                                            param:  ["LUSER:string|25"],
                                            value:  [this.user.CODE],
                                            local : 
                                            {
                                                type : "select",
                                                query : `SELECT *, 
                                                        strftime('%d-%m-%Y', LDATE) || '-' || strftime('%H:%M:%S', LDATE) AS CONVERT_DATE, 
                                                        SUBSTR(GUID, 20, 36) AS REF_NO 
                                                        FROM POS_VW_01 
                                                        WHERE LUSER = ? AND STATUS = 1 
                                                        ORDER BY LDATE DESC
                                                        LIMIT 1;`,
                                                values : [this.user.CODE]
                                            }
                                        }
                                        await tmpLastPosDt.refresh()
                                        if(tmpLastPosDt.length > 0)
                                        {
                                            tmpLastPosSaleDt.selectCmd = 
                                            {
                                                query:  "SELECT * FROM POS_SALE_VW_01 WHERE POS_GUID = @POS_GUID ORDER BY LDATE DESC",
                                                param:  ["POS_GUID:string|50"],
                                                value:  [tmpLastPosDt[0].GUID],
                                                local : 
                                                {
                                                    type : "select",
                                                    query : `SELECT * FROM POS_SALE_VW_01 WHERE POS_GUID = ? ORDER BY LDATE DESC`,
                                                    values : [tmpLastPosDt[0].GUID]
                                                }
                                            }                                                
                                            await tmpLastPosSaleDt.refresh()
                                            tmpLastPosPayDt.selectCmd = 
                                            {
                                                query:  "SELECT * FROM POS_PAYMENT_VW_01 WHERE POS_GUID = @POS_GUID ORDER BY LDATE DESC",
                                                param:  ["POS_GUID:string|50"],
                                                value:  [tmpLastPosDt[0].GUID],
                                                local : 
                                                {
                                                    type : "select",
                                                    query : `SELECT * FROM POS_PAYMENT_VW_01 WHERE POS_GUID = ? ORDER BY LDATE DESC`,
                                                    values : [tmpLastPosDt[0].GUID]
                                                }
                                            }
                                            await tmpLastPosPayDt.refresh()
                                            tmpLastPosPromoDt.selectCmd = 
                                            {
                                                query : "SELECT * FROM [dbo].[POS_PROMO_VW_01] WHERE POS_GUID = @POS_GUID",
                                                param : ['POS_GUID:string|50'],
                                                value:  [tmpLastPosDt[0].GUID],
                                                local : 
                                                {
                                                    type : "select",
                                                    query : `SELECT * FROM POS_PROMO_VW_01 WHERE POS_GUID = ?`,
                                                    values : [tmpLastPosDt[0].GUID]
                                                }
                                            } 
                                            await tmpLastPosPromoDt.refresh()
                                            
                                            this.rePrint(tmpLastPosDt,tmpLastPosSaleDt,tmpLastPosPayDt,tmpLastPosPromoDt)
                                        }
                                    }}>
                                        <i className="text-white fa-solid fa-sheet-plastic" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </NdLayoutItem>
                        </NdLayout>
                    </div>
                </div>
                {/* Total Popup */}
                <div>
                    <NdPopUp parent={this} id={"popTotal"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popTotal.title")}
                    container={"#root"} 
                    width={"600"}
                    height={"590"}
                    position={{of:"#root"}}
                    >
                        <div className="row">
                            <div className="col-12">
                                {/* Top Total Indicator */}
                                <div className="row">
                                    <div className="col-4">
                                        <p className="text-primary text-start m-0">{this.lang.t("total")} <span className="text-dark"><NbLabel id="popTotalGrand" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                    </div>
                                    <div className="col-4">
                                        <p className="text-primary text-start m-0">{this.lang.t("remainder")} <span className="text-dark"><NbLabel id="payRest" parent={this} value={""} format={"currency"}/></span></p>    
                                    </div>
                                    <div className="col-4">
                                        <p className="text-primary text-start m-0">{this.lang.t("moneyChange")} <span className="text-dark"><NbLabel id="payChange" parent={this} value={""} format={"currency"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    {/* Payment Type Selection */}
                                    <div className="col-2 pe-1">
                                        <NbRadioButton id={"rbtnPayType"} parent={this} height={'99%'} width={'100%'}
                                        button={
                                            (()=>
                                            {
                                                let tmpArr = []
                                                for (let i = 0; i < this.payType.length; i++) 
                                                {
                                                    if(this.payType[i].TOTAL_VISIBLE)
                                                    {
                                                        tmpArr.push({id:"btn0" + i,style:{height:'50px',width:'100%'},icon:this.payType[i].ICON,text:this.payType[i].NAME,index:this.payType[i].TYPE})
                                                    }
                                                }
                                                return tmpArr
                                            })()
                                        }/>
                                    </div>
                                    {/* Payment Grid */}
                                    <div className="col-7">
                                        <div className="row">
                                            <div className="col-12">
                                                <NdGrid parent={this} id={"grdPay"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                showRowLines={true}
                                                showColumnLines={true}
                                                showColumnHeaders={false}
                                                height={"138px"} 
                                                width={"100%"}
                                                dbApply={false}
                                                selection={{mode:"single"}}
                                                onRowPrepared={(e)=>
                                                {
                                                    e.rowElement.style.fontSize = "13px";
                                                }}
                                                onRowRemoved={async (e) =>
                                                {
                                                    if(this.core.offline && e.data.PAY_TYPE == 3)
                                                    {
                                                        let tmpCount = this.cheqDt.length
                                                        for (let i = 0; i < tmpCount; i++) 
                                                        {
                                                            await this.core.util.waitUntil(100)
                                                            this.grdPopCheqpayList.devGrid.deleteRow(0)
                                                        }
                                                    }
                                                    this.core.util.writeLog("calcGrandTotal : 14")
                                                    await this.calcGrandTotal();
                                                }}
                                                >
                                                    <Column dataField="PAY_TYPE_NAME" width={100} alignment={"center"}/>
                                                    <Column dataField="AMOUNT" width={40} format={"#,##0.00" + Number.money.sign}/>                                                
                                                </NdGrid>
                                            </div>
                                        </div>
                                        <div className="row pt-1">
                                            <div className="col-12">
                                                <NdTextBox id="txtPopTotal" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                                </NdTextBox> 
                                            </div>
                                        </div> 
                                        <div className="row pt-2">
                                            {/* Number Board */}
                                            <div className="col-9">
                                                <NbNumberboard id={"numPopTotal"} parent={this} textobj="txtPopTotal" span={1} buttonHeight={"60px"}/>
                                            </div>
                                            <div className="col-3">
                                                <div className="row">
                                                    {/* Line Delete */}
                                                    <div className="col-12 ps-0 pb-1">
                                                        <NbButton id={"btnPopTotalLineDel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                        onClick={()=>
                                                        {
                                                            if(this.grdPay.devGrid.getSelectedRowKeys().length > 0)
                                                            {
                                                                this.grdPay.devGrid.deleteRow(this.grdPay.devGrid.getRowIndexByKey(this.grdPay.devGrid.getSelectedRowKeys()[0]))
                                                            }
                                                        }}>
                                                        {this.lang.t("lineDelete")}
                                                        </NbButton>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    {/* T.R Detail */}
                                                    <div className="col-12 ps-0 py-1">
                                                        <NbButton id={"btnPopTotalTRDetail"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                        onClick={async ()=>
                                                        {
                                                            if(this.posObj.posPay.dt().where({PAY_TYPE:3}).length > 0)
                                                            {
                                                                let tmpDt = new datatable(); 
                                                                tmpDt.selectCmd = 
                                                                {
                                                                    query : "SELECT AMOUNT AS AMOUNT,COUNT(AMOUNT) AS COUNT FROM CHEQPAY_VW_01 WHERE DOC = @DOC GROUP BY AMOUNT",
                                                                    param : ['DOC:string|50'],
                                                                    local : 
                                                                    {
                                                                        type : "select",
                                                                        query : "SELECT AMOUNT, COUNT(AMOUNT) AS COUNT FROM CHEQPAY_VW_01 WHERE DOC = ? GROUP BY AMOUNT;",
                                                                        values : [this.posObj.dt()[0].GUID]
                                                                    }
                                                                }
                                                                tmpDt.selectCmd.value = [this.posObj.dt()[0].GUID]
                                                                await tmpDt.refresh();
                                                                
                                                                await this.grdTRDetail.dataRefresh({source:tmpDt});
                                                                this.popTRDetail.show()
                                                            }
                                                        }}>
                                                            {this.lang.t("trDeatil")}
                                                        </NbButton>
                                                    </div>                                                    
                                                </div>
                                                <div className="row">
                                                    {/* Cancel */}
                                                    <div className="col-12 ps-0 py-1">
                                                        <NbButton id={"btnPopTotalCancel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                        onClick={()=>{this.popTotal.hide()}}>
                                                            {this.lang.t("cancel")}
                                                        </NbButton>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    {/* Okey */}
                                                    <div className="col-12 ps-0 py-1">
                                                        <NbButton id={"btnPopTotalOkey"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                                        onClick={()=>
                                                        {
                                                            this.payAdd(this.rbtnPayType.value,this.txtPopTotal.value);
                                                            this.txtPopTotal.newStart = true;
                                                        }}>
                                                            <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                                        </NbButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>            
                                    </div>
                                    {/* Cash Button Group */}
                                    <div className="col-3">
                                        {/* 1 € */}
                                        <div className="row pb-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash1"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/1€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,1)}}/>
                                            </div>
                                        </div>
                                        {/* 2 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash2"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/2€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,2)}}/>
                                            </div>
                                        </div>
                                        {/* 5 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash5"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/5€.jfif)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,5)}}/>
                                            </div>
                                        </div>
                                        {/* 10 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash10"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/10€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,10)}}/>
                                            </div>
                                        </div>
                                        {/* 20 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash20"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/20€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,20)}}/>
                                            </div>
                                        </div>
                                        {/* 50 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash50"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/50€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,50)}}/>
                                            </div>
                                        </div>
                                        {/* 100 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash100"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/100€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,100)}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Card Pay Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCardPay"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popCardPay.title")}
                    container={"#root"} 
                    width={"300"}
                    height={"510"}
                    position={{of:"#root"}}
                    >
                        {/* Top Total Indicator */}
                        <div className="row">
                            <div className="col-12">
                               <div className="row">
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">{this.lang.t("total")}<span className="text-dark"><NbLabel id="popCardTotalGrand" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">{this.lang.t("remainder")} <span className="text-dark"><NbLabel id="payRest1" parent={this} value={""} format={"currency"}/></span></p>    
                                    </div>
                                </div> 
                            </div>
                        </div>
                        {/* txtPopCardPay */}
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopCardPay" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>
                                </NdTextBox> 
                            </div>
                        </div> 
                        {/* numPopCardPay */}
                        <div className="row pt-2">                            
                            <div className="col-12">
                                <NbNumberboard id={"numPopCardPay"} parent={this} textobj="txtPopCardPay" span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        {/* btnPopCardPaySend */}
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnPopCardPaySend"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                onClick={()=>{this.payAdd(1,this.txtPopCardPay.value)}}>
                                    {this.lang.t("send")}
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Card Ticket Pay Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCardTicketPay"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popCardTicketPay.title")}
                    container={"#root"} 
                    width={"300"}
                    height={"510"}
                    position={{of:"#root"}}
                    >
                        {/* Top Total Indicator */}
                        <div className="row">
                            <div className="col-12">
                               <div className="row">
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">{this.lang.t("total")}<span className="text-dark"><NbLabel id="popCardTotalGrand" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">{this.lang.t("remainder")} <span className="text-dark"><NbLabel id="payCardTotalRest" parent={this} value={""} format={"currency"}/></span></p>    
                                    </div>
                                </div> 
                            </div>
                        </div>
                        {/* txtPopCardTicketPay */}
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopCardTicketPay" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>
                                </NdTextBox> 
                            </div>
                        </div> 
                        {/* numPopCardTicketPay */}
                        <div className="row pt-2">                            
                            <div className="col-12">
                                <NbNumberboard id={"numPopCardTicketPay"} parent={this} textobj="txtPopCardTicketPay" span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        {/* btnPopCardTicketPaySend */}
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnPopCardTicketPaySend"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.payAdd(9,this.txtPopCardTicketPay.value)
                                    let tmpTotalGrand = this.posObj.dt()[0].TOTAL
                                    let tmpRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).round(2))
                                    
                                    this.popCardTotalGrand.value = Number(tmpTotalGrand).round(2)
                                    this.payCardTotalRest.value = Number(tmpRest).round(2)
                                }}>
                                    {this.lang.t("send")}
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Cash Pay Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCashPay"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popCashPay.title")}
                    container={"#root"} 
                    width={"600"}
                    height={"570"}
                    position={{of:"#root"}}
                    >
                        <div className="row">
                            <div className="col-9">
                                {/* Top Total Indicator */}
                                <div className="row pb-3">
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">{this.lang.t("total")} <span className="text-dark"><NbLabel id="popCashTotalGrand" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">{this.lang.t("remainder")} <span className="text-dark"><NbLabel id="payRest2" parent={this} value={""} format={"currency"}/></span></p>
                                    </div>
                                </div>
                                {/* txtPopCashPay */}
                                <div className="row pt-5">
                                    <div className="col-12">
                                        <NdTextBox id="txtPopCashPay" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                        </NdTextBox> 
                                    </div>
                                </div>
                                {/* numPopCashPay */}
                                <div className="row pt-2">                            
                                    <div className="col-12">
                                        <NbNumberboard id={"numPopCashPay"} parent={this} textobj="txtPopCashPay" span={1} buttonHeight={"60px"}/>
                                    </div>
                                </div>
                                {/* btnPopCashPayOk */}
                                <div className="row pt-2">
                                    <div className="col-12">
                                        <NbButton id={"btnPopCashPayOk"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                        onClick={()=>{this.payAdd(0,this.txtPopCashPay.value)}}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row">
                                    <div className="col-12">
                                        {/* 1 € */}
                                        <div className="row pb-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay1"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/1€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,1)}}/>
                                            </div>
                                        </div>
                                        {/* 2 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay2"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/2€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,2)}}/>
                                            </div>
                                        </div>
                                        {/* 5 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay5"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/5€.jfif)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,5)}}/>
                                            </div>
                                        </div>
                                        {/* 10 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay10"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/10€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,10)}}/>
                                            </div>
                                        </div>
                                        {/* 20 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay20"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/20€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,20)}}/>
                                            </div>
                                        </div>
                                        {/* 50 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay50"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/50€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,50)}}/>
                                            </div>
                                        </div>
                                        {/* 100 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay100"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/100€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,100)}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                                                
                    </NdPopUp>
                </div>
                {/* Exchange Pay Popup */}
                <div>
                    <NdPopUp parent={this} id={"popExchangePay"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popExchangePay.title")}
                    container={"#root"} 
                    width={"600"}
                    height={"570"}
                    position={{of:"#root"}}
                    >
                        <div className="row">
                            <div className="col-12">
                                {/* Top Total Indicator */}
                                <div className="row pb-3">
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">{this.lang.t("total")} <span className="text-dark"><NbLabel id="popExchangeTotalGrand" parent={this} value={"0.00"}/></span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">{this.lang.t("remainder")} <span className="text-dark"><NbLabel id="payExchangeRest" parent={this} value={"0.00"}/></span></p>
                                    </div>
                                </div>
                                {/* txtPopExchangePay */}
                                <div className="row pt-5">
                                    <div className="col-12">
                                        <NdTextBox id="txtPopExchangePay" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                        </NdTextBox> 
                                    </div>
                                </div>
                                {/* numPopExchangePay */}
                                <div className="row pt-2">                            
                                    <div className="col-12">
                                        <NbNumberboard id={"numPopExchangePay"} parent={this} textobj="txtPopExchangePay" span={1} buttonHeight={"60px"}/>
                                    </div>
                                </div>
                                {/* btnPopExchangePayOk */}
                                <div className="row pt-2">
                                    <div className="col-12">
                                        <NbButton id={"btnPopExchangePayOk"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                        onClick={()=>
                                        {
                                            let tmpExchangeRate = 1
                                            if(this.payType.where({TYPE:8}).length > 0 && typeof this.payType.where({TYPE:8})[0].RATE != 'undefined')
                                            {
                                                tmpExchangeRate = Number(this.payType.where({TYPE:8})[0].RATE).round(2)
                                            }

                                            this.payAdd(8,Number(this.txtPopExchangePay.value / tmpExchangeRate).round(2))

                                            let tmpTotalGrand = this.posObj.dt()[0].TOTAL
                                            let tmpRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).round(2))
                                            
                                            this.popExchangeTotalGrand.value = Number(Number(tmpTotalGrand) * Number(tmpExchangeRate)).round(2)
                                            this.payExchangeRest.value = Number(Number(tmpRest) * Number(tmpExchangeRate)).round(2)
                                        }}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                        </div>                                                
                    </NdPopUp>
                </div>
                {/* Number Popup */}
                <div>
                    <NbPopNumber id={"popNumber"} parent={this}/>
                </div>
                {/* Number Rate Popup */}
                <div>
                    <NbPopNumberRate id={"popNumberRate"} parent={this}/>
                </div>
                {/* Customer List Popup */}
                <div>
                    <NbPosPopGrid id={"popCustomerList"} parent={this} width={"100%"} height={"100%"} position={"#root"} title={this.lang.t("popCustomerList.title")}
                    keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}
                    data={{source:
                    {
                        select:
                        {
                            query : "SELECT GUID,CUSTOMER_TYPE,CODE,TITLE,ADRESS,ZIPCODE,CITY,COUNTRY_NAME,CUSTOMER_POINT,POINT_PASSIVE,EMAIL,TAX_NO,SIRET_ID, " +
                                    "ISNULL((SELECT COUNT(TYPE) FROM CUSTOMER_POINT WHERE TYPE = 0 AND CUSTOMER = CUSTOMER_VW_02.GUID AND CONVERT(DATE,LDATE) = CONVERT(DATE,GETDATE())),0) AS POINT_COUNT " + 
                                    "FROM [dbo].[CUSTOMER_VW_02] WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
                            param : ['VAL:string|50'],
                            local : 
                            {
                                type : "select",
                                query : "SELECT * FROM CUSTOMER_VW_02 WHERE UPPER(CODE) LIKE UPPER(?) OR UPPER(TITLE) LIKE UPPER(?);",
                                values : [{VAL : {map:'VAL'},VAL1 : {map:'VAL'}}]
                            }
                        },
                        sql:this.core.sql
                    }}}
                    onSelection={async(pData)=>
                    {
                        if(pData.length > 0)
                        {
                            if(pData[0].POINT_COUNT > 3)
                            {
                                let tmpConfObj =
                                {
                                    id:'msgCustomerPointCount',showTitle:true,title:this.lang.t("msgCustomerPointCount.title"),showCloseButton:true,width:'450px',height:'250px',
                                    button:[{id:"btn01",caption:this.lang.t("msgCustomerPointCount.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgCustomerPointCount.btn02"),location:'after'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCustomerPointCount.msg")}</div>)
                                }
                                let tmpConfResult = await dialog(tmpConfObj)
                                if(tmpConfResult == 'btn01')
                                {
                                    let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:0})

                                    if(!tmpResult)
                                    {
                                        return
                                    }
                                }
                                else
                                {
                                    return
                                }
                            }

                            this.posObj.dt()[0].CUSTOMER_GUID = pData[0].GUID
                            this.posObj.dt()[0].CUSTOMER_TYPE = pData[0].CUSTOMER_TYPE
                            this.posObj.dt()[0].CUSTOMER_CODE = pData[0].CODE
                            this.posObj.dt()[0].CUSTOMER_NAME = pData[0].TITLE
                            this.posObj.dt()[0].CUSTOMER_ADRESS = pData[0].ADRESS
                            this.posObj.dt()[0].CUSTOMER_ZIPCODE = pData[0].ZIPCODE
                            this.posObj.dt()[0].CUSTOMER_CITY = pData[0].CITY
                            this.posObj.dt()[0].CUSTOMER_COUNTRY = pData[0].COUNTRY_NAME
                            this.posObj.dt()[0].CUSTOMER_POINT = pData[0].CUSTOMER_POINT
                            this.posObj.dt()[0].CUSTOMER_POINT_PASSIVE = pData[0].POINT_PASSIVE
                            this.posObj.dt()[0].CUSTOMER_MAIL = pData[0].EMAIL
                            this.posObj.dt()[0].CUSTOMER_TAX_NO = pData[0].TAX_NO
                            this.posObj.dt()[0].CUSTOMER_SIRET = pData[0].SIRET_ID

                            //PROMOSYON GETİR.
                            await this.getPromoDb()
                            this.promoApply()
                            //************************************************** */
                            this.core.util.writeLog("calcGrandTotal : 15")
                            await this.calcGrandTotal(false);
                        }
                    }}>
                        <Column dataField="CODE" caption={"CODE"} width={100} />
                        <Column dataField="TITLE" caption={"NAME"} width={250} />
                        <Column dataField="ADRESS" caption={"ADRESS"} width={350}/>
                        <Column dataField="CUSTOMER_POINT" caption={"POINT"} width={100}/>
                    </NbPosPopGrid>
                </div>
                {/* Item List Popup */}
                <div>
                    <NbPosPopGrid id={"popItemList"} parent={this} width={"100%"} height={"100%"} position={"#root"} title={this.lang.t("popItemList.title")}  selectAll={true}
                    keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}
                    data={{source:
                    {
                        select:
                        {
                            query : "SELECT CODE,NAME,dbo.FN_PRICE(GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000'," + this.pricingListNo + ",0,1) AS PRICE FROM [dbo].[ITEMS_VW_01] WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) AND STATUS = 1",
                            param : ['VAL:string|50','CUSTOMER:string|50'],
                            local : 
                            {
                                type : "select",
                                query : "SELECT * FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(?) OR UPPER(NAME) LIKE UPPER(?) AND STATUS = 1;",
                                values : [{VAL : {map:'VAL'},VAL1 : {map:'VAL'}}]
                            }
                        },
                        sql:this.core.sql
                    }}}
                    onSelection={(pData)=>
                    {
                        if(pData.length > 0)
                        {
                            this.getItem(this.txtBarcode.value + pData[0].CODE,this.posObj.dt()[0].CUSTOMER_GUID)
                        }
                    }}>
                        <Column dataField="CODE" caption={"CODE"} width={150} />
                        <Column dataField="NAME" caption={"NAME"} width={600} />
                        <Column dataField="PRICE" caption={"PRICE"} width={100} />
                    </NbPosPopGrid>
                </div>
                {/* Barcode List Popup */}
                <div>
                    <NdPopUp parent={this} id={"popBarcodeList"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popBarcodeList.title")}
                    container={"#root"} 
                    width={"800"}
                    height={"600"}
                    position={{of:"#root"}}
                    >
                        {/* grdBarcodeList */}
                        <div className="row">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdBarcodeList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                height={"500px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";                                             
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    if(e.rowType == "data")
                                    {
                                        e.cellElement.style.padding = "12px"
                                    }
                                }}
                                onSelectionChanged={(e)=>
                                {
                                    if(typeof e.currentSelectedRowKeys[0] != 'undefined')
                                    {
                                        this.getItem(this.txtBarcode.value + e.currentSelectedRowKeys[0].BARCODE)
                                        this.popBarcodeList.hide()
                                    }
                                }}
                                >
                                    <Column dataField="BARCODE" caption={this.lang.t("grdBarcodeList.BARCODE")} width={150}/>
                                    <Column dataField="NAME" caption={this.lang.t("grdBarcodeList.NAME")} width={500} />
                                    <Column dataField="PRICE_SALE" caption={this.lang.t("grdBarcodeList.PRICE_SALE")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                </NdGrid>
                            </div>
                        </div>
                    </NdPopUp>    
                </div>
                {/* Park List Popup */}
                <div>
                    <NdPopUp parent={this} id={"popParkList"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popParkList.title")}
                    container={"#root"} 
                    width={"900"}
                    height={"650"}
                    position={{of:"#root"}}
                    >
                        {/* btnPopParkListAll */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NbButton id={"btnPopParkListAll"} parent={this} className="form-group btn btn-primary btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}
                                access={this.acsObj.filter({ELEMENT:'btnPopParkListAll',USERS:this.user.CODE})}
                                onClick={async ()=>
                                {
                                    this.parkDt.selectCmd.value[0] = '';
                                    await this.parkDt.refresh();
                                }}>{this.lang.t("popParkList.btnParkAll")} </NbButton> 
                            </div>
                        </div>
                        {/* grdPopParkList */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdPopParkList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={false} 
                                allowColumnResizing={true} 
                                height={"425px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                >
                                    <Column dataField="LUSER_NAME" caption={this.lang.t("grdPopParkList.LUSER_NAME")} width={120} alignment={"center"}/>
                                    <Column dataField="LDATE" caption={this.lang.t("grdPopParkList.LDATE")} width={150} alignment={"center"}/>
                                    <Column dataField="TOTAL" caption={this.lang.t("grdPopParkList.TOTAL")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                    <Column dataField="DESCRIPTION" caption={this.lang.t("grdPopParkList.DESCRIPTION")} width={400}/>
                                </NdGrid>
                            </div>
                        </div>
                        {/* btnPopParkListSelect */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NbButton id={"btnPopParkListSelect"} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}
                                onClick={()=>
                                {
                                    if(this.grdPopParkList.devGrid.getSelectedRowsData().length > 0)
                                    {
                                        this.getDoc(this.grdPopParkList.devGrid.getSelectedRowsData()[0].GUID)
                                        this.popParkList.hide()
                                    }
                                }}>{this.lang.t("select")} </NbButton> 
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Order List Popup */}
                <div>
                    <NdPopUp parent={this} id={"popOrderList"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popOrderList.title")}
                    container={"#root"} 
                    width={"800"}
                    height={"530"}
                    position={{of:"#root"}}
                    >
                        {/* grdPopOrderList */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdPopOrderList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"375px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                >
                                    <Column dataField="REF" caption={this.lang.t("grdPopOrderList.REF")} width={120} alignment={"center"}/>
                                    <Column dataField="REF_NO" caption={this.lang.t("grdPopOrderList.REF_NO")} width={75}  />
                                    <Column dataField="DOC_DATE" caption={this.lang.t("grdPopOrderList.DOC_DATE")} width={150} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"} />
                                    <Column dataField="INPUT_CODE" caption={this.lang.t("grdPopOrderList.INPUT_CODE")} width={150}/>
                                    <Column dataField="INPUT_NAME" caption={this.lang.t("grdPopOrderList.INPUT_NAME")} width={150}/>
                                    <Column dataField="TOTAL" caption={this.lang.t("grdPopOrderList.TOTAL")} width={75} format={"#,##0.00" + Number.money.sign}/>
                                </NdGrid>
                            </div>
                        </div>
                        {/* btnPopOrderListSelect */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NbButton id={"btnPopOrderListSelect"} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}
                                onClick={async()=>
                                {
                                    if(this.grdPopOrderList.devGrid.getSelectedRowsData().length > 0)
                                    {
                                        if(this.posObj.posSale.dt().length > 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgOrderAlert',showTitle:true,title:this.lang.t("msgOrderAlert.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgOrderAlert.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOrderAlert.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        else
                                        {
                                            let tmpOrderList = new datatable();
                                            tmpOrderList.selectCmd = 
                                            {
                                                query : "SELECT * FROM DOC_ORDERS_VW_01 WHERE DOC_GUID = @DOC_GUID AND CLOSED < 2 ",
                                                param : ['DOC_GUID:string|50'],
                                                value : [this.grdPopOrderList.devGrid.getSelectedRowsData()[0].DOC_GUID]
                                            }
                                            tmpOrderList.updateCmd = 
                                            {
                                                query : "EXEC [dbo].[PRD_DOC_ORDERS_UPDATE] " +
                                                "@GUID = @PGUID, " +
                                                "@CUSER = @PCUSER, " +
                                                "@DOC_GUID = @PDOC_GUID, " + 
                                                "@CLOSED  = @PCLOSED " ,
                                                param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PCLOSED:int'],
                                                dataprm : ['GUID','CUSER','DOC_GUID','CLOSED']
                                            }
                                            await tmpOrderList.refresh()
                                            if(tmpOrderList[0].CLOSED == 1)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgGetOrder',showTitle:true,title:this.lang.t("msgGetOrder.title"),showCloseButton:true,width:'500px',height:'250px',
                                                    button:[{id:"btn01",caption:this.lang.t("msgGetOrder.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgGetOrder.btn02"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgGetOrder.msg")}</div>)
                                                }
                                                if((await dialog(tmpConfObj)) == 'btn02')
                                                {
                                                    return
                                                }
                                            }
                                            this.posObj.dt()[0].ORDER_GUID = tmpOrderList[0].DOC_GUID
                                            //PROMOSYON GETİR.
                                            await this.getPromoDb(tmpOrderList[0].DOC_DATE,tmpOrderList[0].DOC_DATE)
                                            //************************************************** */
                                            tmpOrderList.forEach((items)=>
                                            {
                                                items.CLOSED = 1
                                                items.CUSER = this.core.auth.data.CODE
                                                let tmpData = 
                                                {
                                                    BARCODE: items.ITEM_BARCODE,
                                                    BARCODE_GUID: "00000000-0000-0000-0000-000000000000",
                                                    CODE: items.ITEM_CODE,
                                                    COST_PRICE: items.COST_PRICE,
                                                    GUID:  items.ITEM,
                                                    INPUT: items.INPUT_CODE,
                                                    MAX_PRICE: 0.0,
                                                    MIN_PRICE: 0.0,
                                                    NAME: items.ITEM_NAME,
                                                    PRICE: Number(items.TOTAL / items.QUANTITY).round(2),
                                                    QUANTITY: Number(items.QUANTITY).round(2),
                                                    SALE_JOIN_LINE: true,
                                                    SNAME: items.ITEM_NAME,
                                                    SPECIAL: "",
                                                    STATUS: true,
                                                    TICKET_REST: true,
                                                    WEIGHING : false,
                                                    UNIQ_CODE: "",
                                                    UNIQ_PRICE: 0,
                                                    UNIQ_QUANTITY: 0,
                                                    UNIT_FACTOR: items.UNIT_FACTOR == 0 ? 1 : items.UNIT_FACTOR,
                                                    UNIT_GUID: items.UNIT,
                                                    UNIT_ID: "",
                                                    UNIT_NAME: items.UNIT_NAME,
                                                    UNIT_SHORT: items.UNIT_SHORT,
                                                    VAT: items.VAT_RATE,
                                                    VAT_TYPE: items.VAT_TYPE,
                                                    WEIGHING: false,
                                                    POS_SALE_ORDER: items.GUID,
                                                    DISCOUNT : items.DISCOUNT
                                                }
                                                this.saleAdd(tmpData)
                                            })
                                            tmpOrderList.update()
                                            this.popOrderList.hide()
                                        }
                                    }
                                }}>{this.lang.t("select")} </NbButton> 
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Cheqpay Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCheqpay"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popCheqpay.title")}
                    container={"#root"} 
                    width={"900"}
                    height={"585"}
                    position={{of:"#root"}}                    
                    onShowed={()=>
                    {
                        this.txtPopCheqpay.value = ""
                        setTimeout(() => 
                        {
                            this.txtPopCheqpay.focus()
                        }, 750);
                    }}
                    >
                        {/* txtPopCheqpay */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopCheqpay" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}
                                onKeyDown={(async(e)=>
                                {    
                                    if(e.event.key == 'Enter')
                                    {   
                                        this.cheqpayAdd(this.txtPopCheqpay.value)                                        
                                    }
                                }).bind(this)}>     
                                </NdTextBox> 
                            </div>
                        </div>
                        {/* grdPopCheqpayList */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdPopCheqpayList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"280px"} 
                                width={"100%"}
                                dbApply={true}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                onRowRemoved={async(e)=>
                                {
                                    let tmpRowData = this.isRowMerge('PAY',{TYPE:3})
                                    if(typeof e.data.AMOUNT != 'undefined' && typeof tmpRowData != 'undefined' && typeof tmpRowData.AMOUNT != 'undefined')
                                    {
                                        await this.payRowUpdate(tmpRowData,{AMOUNT:Number(parseFloat(Number(tmpRowData.AMOUNT) - Number(e.data.AMOUNT)).round(2)),CHANGE:0})
                                    }
                                }}
                                >
                                    <Editing allowDeleting={true} confirmDelete={false}/>
                                    <Column dataField="NO" alignment={"center"} caption={"NO"} width={100} />
                                    <Column dataField="CODE" alignment={"center"} caption={this.lang.t("grdPopCheqpayList.CODE")} width={550} />
                                    <Column dataField="AMOUNT" alignment={"center"} caption={this.lang.t("grdPopCheqpayList.AMOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                </NdGrid>
                            </div>
                        </div>
                        {/* Last Read */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">{this.lang.t("lastRead")} <span className="text-dark"><NbLabel id="cheqLastAmount" parent={this} value={""} format={"currency"}/></span></h3>    
                            </div>
                        </div>
                        {/* Total Read */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">{this.lang.t("totalRead")} <span className="text-dark"><NbLabel id="cheqTotalAmount" parent={this} value={""} format={"currency"}/></span></h3>    
                            </div>
                        </div>
                        {/* Rest */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">{this.lang.t("remainderPay")} <span className="text-dark"><NbLabel id="payRest3" parent={this} value={""} format={"currency"}/></span></h3>    
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Calculator Popup */}
                <div>
                    <NbCalculator parent={this} id={"Calculator"}></NbCalculator>
                </div>
                {/* Discount Popup */}     
                <div>
                    <NdPopUp parent={this} id={"popDiscount"} 
                    visible={false}                        
                    showCloseButton={false}
                    showTitle={true}
                    title={this.lang.t("popDiscount.title")}
                    container={"#root"} 
                    width={"100%"}
                    height={"100%"}
                    position={{of:"#root"}}
                    >
                        {/* grdDiscList */}
                        <div className="row pb-1">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdDiscList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"430px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"multiple"}}
                                loadPanel={{enabled:false}}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";   
                                        e.rowElement.style.fontSize = "15px"; 
                                    }
                                    else
                                    {
                                        e.rowElement.style.fontSize = "20px";
                                    }
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "8px"     
                                                                 
                                    if(e.rowType == 'data' && e.column.dataField == 'AMOUNT')
                                    {
                                        e.cellElement.style.fontWeight = "bold";
                                    }
                                    else if(e.rowType == 'data' && e.column.index == 2)
                                    {
                                        let tmpVal = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,2)
                                        e.value = tmpVal
                                        e.text = tmpVal
                                        e.displayValue = tmpVal
                                        e.cellElement.innerHTML  = tmpVal.round(2) + " %"
                                    }
                                    else if(e.rowType == 'data' && e.column.index == 5)
                                    {
                                        let tmpVal = Number(parseFloat((e.data.AMOUNT - e.data.DISCOUNT) / e.data.QUANTITY).round(2))
                                        e.value = tmpVal
                                        e.text = tmpVal
                                        e.displayValue = tmpVal
                                        e.cellElement.innerHTML  = Number(tmpVal.round(2)).currency()
                                    }
                                }}
                                >
                                    <Editing confirmDelete={false}/>
                                    <Column dataField="LDATE" caption={this.lang.t("grdDiscList.LDATE")} width={40} alignment={"center"} dataType={"datetime"} format={"dd-MM-yyyy - HH:mm:ss SSSZ"} defaultSortOrder="desc" visible={false}/>
                                    <Column dataField="ITEM_NAME" caption={this.lang.t("grdDiscList.ITEM_NAME")} width={430}/>
                                    <Column caption={this.lang.t("grdDiscList.INDIRIM")} width={100} alignment={"right"}/>
                                    <Column dataField="DISCOUNT" caption={this.lang.t("grdDiscList.DISCOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                    <Column dataField="PRICE" caption={this.lang.t("grdDiscList.PRICE")} width={80} format={"#,##0.00" + Number.money.sign}/>
                                    <Column caption={this.lang.t("grdDiscList.INDFIYAT")} width={100} format={"#,##0.00" + Number.money.sign} alignment={"right"}/>
                                    <Column dataField="AMOUNT" alignment={"right"} caption={this.lang.t("grdDiscList.AMOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                        <div className="row pb-1">
                            <div className="col-4">
                                <NbButton id={"btnPopDiscountRate"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"50px",width:"100%"}}
                                onClick={async ()=>
                                {
                                    if(this.grdDiscList.getSelectedData().length > 0)
                                    {
                                        let tmpDescResult = await this.popDiscountDesc.show()
                                        
                                        let tmpDt = new datatable()
                                        tmpDt.import(this.grdDiscList.getSelectedData())
    
                                        let tmpResult = await this.popNumberRate.show(this.lang.t("discountpercent") + tmpDt.sum('AMOUNT',2),Number(tmpDt.sum('AMOUNT')).rate2Num(tmpDt.sum('DISCOUNT')))
                                        if(typeof tmpResult == 'undefined')
                                        {
                                            return
                                        }
                                        if(this.posObj.posPay.dt().length > 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDeletePayForDiscount',showTitle:true,title:this.lang.t("msgDeletePayForDiscount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgDeletePayForDiscount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDeletePayForDiscount.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        if(Number(tmpResult) > 100)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDiscountNotBigAmount',showTitle:true,title:this.lang.t("msgDiscountNotBigAmount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgDiscountNotBigAmount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDiscountNotBigAmount.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return;
                                        }
    
                                        for (let i = 0; i < this.grdDiscList.getSelectedData().length; i++) 
                                        {
                                            let tmpDiscount = Number(this.grdDiscList.getSelectedData()[i].AMOUNT).rateInc(tmpResult,2)
                                            
                                            let tmpData = this.grdDiscList.getSelectedData()[i]
                                            let tmpCalc = this.calcSaleTotal(tmpData.PRICE,tmpData.QUANTITY,tmpDiscount,tmpData.LOYALTY,tmpData.VAT_RATE)
                                            
                                            this.grdDiscList.getSelectedData()[i].LDATE = moment(new Date()).utcOffset(0, true)
                                            this.grdDiscList.getSelectedData()[i].FAMOUNT = tmpCalc.FAMOUNT
                                            this.grdDiscList.getSelectedData()[i].AMOUNT = tmpCalc.AMOUNT
                                            this.grdDiscList.getSelectedData()[i].DISCOUNT = tmpDiscount
                                            this.grdDiscList.getSelectedData()[i].VAT = tmpCalc.VAT
                                            this.grdDiscList.getSelectedData()[i].TOTAL = tmpCalc.TOTAL
                                        }
                                        this.core.util.writeLog("calcGrandTotal : 16")
                                        await this.calcGrandTotal();

                                        if(typeof tmpDescResult != 'undefined')
                                        {
                                            await this.descSave("DISCOUNT",tmpDescResult,'00000000-0000-0000-0000-000000000000')
                                        }
                                    }
                                    else
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgLineSelect',showTitle:true,title:this.lang.t("msgLineSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("msgLineSelect.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgLineSelect.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                    }
                                }}>
                                    <div>{this.lang.t("applyDiscountPercent")}</div>
                                </NbButton>
                            </div>
                            <div className="col-4">
                                <NbButton id={"btnPopDiscountAmount"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"50px",width:"100%"}}
                                onClick={async ()=>
                                {
                                    if(this.grdDiscList.getSelectedData().length > 0)
                                    {
                                        let tmpDescResult = await this.popDiscountDesc.show()
                                        
                                        let tmpDt = new datatable()
                                        tmpDt.import(this.grdDiscList.getSelectedData())                                    

                                        let tmpResult = await this.popNumber.show(this.lang.t("discountPrice") + Number.money.sign + ' - ' + tmpDt.sum('AMOUNT',2),tmpDt.sum('DISCOUNT',2))
                                        let tmpRate = Number(tmpDt.sum('AMOUNT')).rate2Num(tmpResult,2);
                                        
                                        if(typeof tmpResult == 'undefined')
                                        {
                                            return
                                        }
                                        if(this.posObj.posPay.dt().length > 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDeletePayForDiscount',showTitle:true,title:this.lang.t("msgDeletePayForDiscount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgDeletePayForDiscount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDeletePayForDiscount.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        if(Number(tmpDt.sum('AMOUNT')) < Number(tmpResult))
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDiscountNotBigAmount',showTitle:true,title:this.lang.t("msgDiscountNotBigAmount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgDiscountNotBigAmount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDiscountNotBigAmount.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return;
                                        }

                                        for (let i = 0; i < this.grdDiscList.getSelectedData().length; i++) 
                                        {
                                            let tmpDiscount = Number(this.grdDiscList.getSelectedData()[i].AMOUNT).rateInc(tmpRate,2)
                                                        
                                            let tmpData = this.grdDiscList.getSelectedData()[i]
                                            let tmpCalc = this.calcSaleTotal(tmpData.PRICE,tmpData.QUANTITY,tmpDiscount,tmpData.LOYALTY,tmpData.VAT_RATE)
                                            
                                            this.grdDiscList.getSelectedData()[i].FAMOUNT = tmpCalc.FAMOUNT
                                            this.grdDiscList.getSelectedData()[i].AMOUNT = tmpCalc.AMOUNT
                                            this.grdDiscList.getSelectedData()[i].DISCOUNT = tmpDiscount
                                            this.grdDiscList.getSelectedData()[i].VAT = tmpCalc.VAT
                                            this.grdDiscList.getSelectedData()[i].TOTAL = tmpCalc.TOTAL
                                        }
                                        this.core.util.writeLog("calcGrandTotal : 17")
                                        await this.calcGrandTotal();

                                        if(typeof tmpDescResult != 'undefined')
                                        {
                                            await this.descSave("DISCOUNT",tmpDescResult,'00000000-0000-0000-0000-000000000000')
                                        }
                                    }  
                                    else
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgLineSelect',showTitle:true,title:this.lang.t("msgLineSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("msgLineSelect.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgLineSelect.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                    }                               
                                }}>
                                    <div>{this.lang.t("applyDiscountAmount") + Number.money.sign} </div>
                                </NbButton>
                            </div>
                            <div className="col-4">
                                <NbButton id={"btnPopDiscountText"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"50px",width:"100%"}}
                                onClick={async ()=>
                                {
                                    if(this.grdDiscList.getSelectedData().length == 1)
                                    {
                                        let tmpDescResult = await this.popDiscountDesc.show()
                                        
                                        let tmpDt = new datatable()
                                        tmpDt.import(this.grdDiscList.getSelectedData())                                    

                                        let tmpResult = await this.popNumber.show(this.lang.t("discountPrice") + Number.money.sign + ' - ' + Number(tmpDt[0].PRICE).round(2),Number(tmpDt[0].PRICE - (tmpDt[0].DISCOUNT/ tmpDt[0].QUANTITY)).round(2))

                                        let tmpRate = Number(tmpDt[0].PRICE).rate2Num((tmpDt[0].PRICE-tmpResult),2);
                                        
                                        if(typeof tmpResult == 'undefined')
                                        {
                                            return
                                        }
                                        if(this.posObj.posPay.dt().length > 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDeletePayForDiscount',showTitle:true,title:this.lang.t("msgDeletePayForDiscount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgDeletePayForDiscount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDeletePayForDiscount.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }

                                        for (let i = 0; i < this.grdDiscList.getSelectedData().length; i++) 
                                        {
                                           
                                            let tmpDiscount = Number(this.grdDiscList.getSelectedData()[i].AMOUNT).rateInc(tmpRate,2)
                                                        
                                            let tmpData = this.grdDiscList.getSelectedData()[i]
                                            let tmpCalc = this.calcSaleTotal(tmpData.PRICE,tmpData.QUANTITY,tmpDiscount,tmpData.LOYALTY,tmpData.VAT_RATE)
                                            
                                            this.grdDiscList.getSelectedData()[i].FAMOUNT = tmpCalc.FAMOUNT
                                            this.grdDiscList.getSelectedData()[i].AMOUNT = tmpCalc.AMOUNT
                                            this.grdDiscList.getSelectedData()[i].DISCOUNT = tmpDiscount
                                            this.grdDiscList.getSelectedData()[i].VAT = tmpCalc.VAT
                                            this.grdDiscList.getSelectedData()[i].TOTAL = tmpCalc.TOTAL
                                        }
                                        this.core.util.writeLog("calcGrandTotal : 17")
                                        await this.calcGrandTotal();
                                                                                
                                        if(typeof tmpDescResult != 'undefined')
                                        {
                                            await this.descSave("DISCOUNT",tmpDescResult,'00000000-0000-0000-0000-000000000000')
                                        }
                                    }  
                                    else if(this.grdDiscList.getSelectedData().length == 0)
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgLineSelect',showTitle:true,title:this.lang.t("msgLineSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("msgLineSelect.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgLineSelect.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                    } 
                                    else
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgMultipleLineSelect',showTitle:true,title:this.lang.t("msgMultipleLineSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("msgMultipleLineSelect.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMultipleLineSelect.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                    }                            
                                }}>
                                    <div>{this.lang.t("applyDiscountText") + Number.money.sign} </div>
                                </NbButton>
                            </div>
                        </div>
                        <div className="row pb-1">
                            <div className="col-6 offset-6">
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">{this.lang.t("amount")}<span className="text-dark"><NbLabel id="disTotalSub" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">{this.lang.t("vat")}<span className="text-dark"><NbLabel id="disTotalVat" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">{this.lang.t("discount")} <span className="text-dark"><NbLabel id="disTotalDiscount" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row pb-1">
                            <div className="col-12">
                                <p className="fs-2 fw-bold text-center m-0"><NbLabel id="disTotalGrand" parent={this} value={"0.00"} format={"currency"}/></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <NbButton id={"btnPopDiscountExit"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"50px",width:"100%"}}
                                onClick={async ()=>
                                {
                                    this.popDiscount.hide()
                                }}>
                                    <i className="text-white fa-solid fa-arrow-right-from-bracket" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Loyalty Popup */}
                <div>
                    <NdPopUp parent={this} id={"popLoyalty"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popLoyalty.title")}
                    container={"#root"} 
                    width={"300"}
                    height={"560"}
                    position={{of:"#root"}}
                    >
                        {/* Top Total Indicator */}
                        <div className="row">
                            <div className="col-12">
                               <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-start m-0">{this.lang.t("popLoyalty.availablePoint")} <span className="text-dark"><NbLabel id="popCustomerPoint" parent={this} value={"0"}/></span></p>    
                                    </div>                                    
                                </div> 
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-start m-0">{this.lang.t("popLoyalty.usePoint")} <span className="text-dark"><NbLabel id="popCustomerUsePoint" parent={this} value={"0"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-start m-0">{this.lang.t("popLoyalty.remainderPoint")}<span className="text-dark"><NbLabel id="popCustomerGrowPoint" parent={this} value={"0"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-start m-0">{this.lang.t("popLoyalty.pointtoCash")} <span className="text-dark"><NbLabel id="popCustomerPointToEuro" parent={this} value={"0"} format={"currency"}/></span></p>    
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* txtPopLoyalty */}
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopLoyalty" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}
                                onValueChanged={(e)=>
                                { 
                                    if(e.value == 0)
                                    {
                                        this.popCustomerPointToEuro.value = 0 
                                        return
                                    }
                                    this.popCustomerPointToEuro.value = Number(parseFloat(e.value / this.prmObj.filter({ID:'CustomerPointFactory',TYPE:0}).getValue()).round(2)).toString()
                                }}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        {/* numPopLoyalty */}
                        <div className="row pt-2">                            
                            <div className="col-12">
                                <NbNumberboard id={"numPopLoyalty"} parent={this} textobj="txtPopLoyalty" span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        <div className="row pt-2">
                            {/* btnPopLoyaltyDel */}
                            <div className="col-6">
                                <NbButton id={"btnPopLoyaltyDel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                onClick={async()=>
                                {
                                    for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
                                    {
                                        let tmpData = this.posObj.posSale.dt()[i]
                                        let tmpCalc = this.calcSaleTotal(tmpData.PRICE,tmpData.QUANTITY,tmpData.DISCOUNT,0,tmpData.VAT_RATE)

                                        this.posObj.posSale.dt()[i].FAMOUNT = tmpCalc.FAMOUNT
                                        this.posObj.posSale.dt()[i].AMOUNT = tmpCalc.AMOUNT
                                        this.posObj.posSale.dt()[i].DISCOUNT = tmpCalc.DISCOUNT
                                        this.posObj.posSale.dt()[i].LOYALTY = 0
                                        this.posObj.posSale.dt()[i].VAT = tmpCalc.VAT
                                        this.posObj.posSale.dt()[i].TOTAL = tmpCalc.TOTAL
                                    }
                                    this.core.util.writeLog("calcGrandTotal : 18")
                                    await this.calcGrandTotal()
                                    this.popLoyalty.hide()
                                }}>
                                    <i className="text-white fa-solid fa-eraser" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                            {/* btnPopLoyaltyOk */}
                            <div className="col-6">
                                <NbButton id={"btnPopLoyaltyOk"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                onClick={async()=>
                                {
                                    if(Number(this.popCustomerPoint.value) < Number(this.txtPopLoyalty.value))
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgPointNotBigToPoint',showTitle:true,title:this.lang.t("msgPointNotBigToPoint.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("msgPointNotBigToPoint.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPointNotBigToPoint.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                        return;
                                    }
                                                                        
                                    if(Number(parseFloat(Number(this.txtPopLoyalty.value) / 100).round(2)) > this.posObj.dt()[0].TOTAL)
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgPointNotBigToPay',showTitle:true,title:this.lang.t("msgPointNotBigToPay.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("msgPointNotBigToPay.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPointNotBigToPay.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                        return;
                                    }

                                    let tmpLoyalty = Number(parseFloat(this.txtPopLoyalty.value / 100).round(2))
                                    let tmpLoyaltyRate = Number(Number(Number(this.posObj.dt()[0].AMOUNT).round(2)) - Number(Number(this.posObj.dt()[0].DISCOUNT).round(2))).rate2Num(tmpLoyalty)
                                    
                                    for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
                                    {                                        
                                        let tmpData = this.posObj.posSale.dt()[i]
                                        let tmpRowLoyalty = Number(Number(Number(tmpData.AMOUNT).round(2)) - Number(Number(tmpData.DISCOUNT).round(2))).rateInc(tmpLoyaltyRate,2)
                                        let tmpCalc = this.calcSaleTotal(tmpData.PRICE,tmpData.QUANTITY,tmpData.DISCOUNT,tmpRowLoyalty,tmpData.VAT_RATE)
                                        
                                        this.posObj.posSale.dt()[i].FAMOUNT = tmpCalc.FAMOUNT
                                        this.posObj.posSale.dt()[i].AMOUNT = tmpCalc.AMOUNT
                                        this.posObj.posSale.dt()[i].DISCOUNT = tmpCalc.DISCOUNT
                                        this.posObj.posSale.dt()[i].LOYALTY = tmpRowLoyalty
                                        this.posObj.posSale.dt()[i].VAT = tmpCalc.VAT
                                        this.posObj.posSale.dt()[i].TOTAL = tmpCalc.TOTAL
                                    }
                                    this.core.util.writeLog("calcGrandTotal : 19")
                                    await this.calcGrandTotal()
                                    this.popLoyalty.hide()
                                }}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Last Sale List Popup */} 
                <div>
                    <NdPopUp id="popLastSaleList" parent={this} title={this.lang.t("popLastSaleList.title")} width={"100%"} height={"100%"}
                    showCloseButton={true}
                    showTitle={true}
                    >
                        {/* Tool Button Group */} 
                        <div className="row pb-1">
                            <div className="offset-8 col-4">
                                <div className="row px-2">
                                    <div className="col-2 p-1">
                                    
                                    </div>
                                    <div className="col-2 p-1">
                                    
                                    </div>
                                    {/* btnLastSaleSendMail */}
                                    <div className="col-2 p-1">
                                        <NbButton id={"btnLastSaleSendMail"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}
                                        onClick={async()=>
                                        {
                                            let tmpLastPos = new datatable();
                                            tmpLastPos.import(this.grdLastPos.devGrid.getSelectedRowKeys())
                                            
                                            if(tmpLastPos.length > 0)
                                            {
                                                let tmpDupSignature = await this.nf525.signaturePosFactDuplicate(tmpLastPos[0])
                                                let tmpDupSign = ''

                                                if(tmpDupSignature != '')
                                                {
                                                    tmpDupSign = tmpDupSignature.SIGNATURE.substring(2,3) + tmpDupSignature.SIGNATURE.substring(6,7) + tmpDupSignature.SIGNATURE.substring(12,13) + tmpDupSignature.SIGNATURE.substring(18,19)
                                                }
                                                let tmpData = 
                                                {
                                                    pos : tmpLastPos,
                                                    possale : this.lastPosSaleDt,
                                                    pospay : this.lastPosPayDt,
                                                    pospromo : this.lastPosPromoDt,
                                                    firm : this.firm,
                                                    special : 
                                                    {
                                                        type : tmpLastPos[0].FACT_REF == 0 ? 'Fis' : 'Fatura',
                                                        ticketCount : 0,
                                                        reprint :  1,
                                                        repas : 0,
                                                        factCertificate : '',
                                                        dupCertificate : this.core.appInfo.name + " version : " + this.core.appInfo.version + " - " + this.core.appInfo.certificate + " - " + tmpDupSign,
                                                        customerUsePoint : Math.floor(tmpLastPos[0].LOYALTY * 100),
                                                        customerPoint : (tmpLastPos[0].CUSTOMER_POINT + Math.floor(tmpLastPos[0].LOYALTY * 100)) - Math.floor(tmpLastPos[0].TOTAL),
                                                        customerGrowPoint : tmpLastPos[0].CUSTOMER_POINT - Math.floor(tmpLastPos[0].TOTAL),
                                                        customerPointFactory : this.prmObj.filter({ID:'CustomerPointFactory',TYPE:0}).getValue()
                                                    }
                                                }

                                                if(tmpLastPos[0].CUSTOMER_GUID != '00000000-0000-0000-0000-000000000000')
                                                { 
                                                    let tmpQuery = 
                                                    {
                                                        query :"SELECT EMAIL FROM CUSTOMER_VW_02 WHERE GUID = @GUID",
                                                        param:  ['GUID:string|50'],
                                                        value:  [tmpLastPos[0].CUSTOMER_GUID]
                                                    }
                                                    let tmpMailData = await this.core.sql.execute(tmpQuery) 
                                                    if(tmpMailData.result.recordset.length > 0)
                                                    {
                                                        this.txtMail.value = tmpMailData.result.recordset[0].EMAIL
                                                    }
                                                    else
                                                    {
                                                        this.txtMail.value = ""
                                                    }
                                                }
                                                else
                                                {
                                                    this.txtMail.value = ""
                                                }
                                                
                                                this.mailPopup.tmpData = tmpData;
                                                await this.mailPopup.show()
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-envelope" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                    {/* btnPopLastSaleTRest */}
                                    <div className="col-2 p-1">
                                        <NbButton id={"btnPopLastSaleTRest"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}
                                        onClick={async ()=>
                                        {
                                            let tmpResult = await this.popNumber.show(this.lang.t("quantity"),0)
                                            if(typeof tmpResult != 'undefined' && tmpResult != '')
                                            {
                                                let tmpLastPos = new datatable();
                                                tmpLastPos.import(this.grdLastPos.devGrid.getSelectedRowKeys())
                                                if(tmpLastPos.length > 0)
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query : "SELECT COUNT(TAG) AS PRINT_COUNT FROM POS_EXTRA WHERE POS_GUID = @POS_GUID AND TAG = @TAG", 
                                                        param : ['POS_GUID:string|50','TAG:string|25'],
                                                        value : [tmpLastPos[0].GUID,"REPRINT"]
                                                    }
    
                                                    let tmpPrintCount = (await this.core.sql.execute(tmpQuery)).result.recordset[0].PRINT_COUNT
                                                    if(tmpPrintCount < 2)
                                                    {
                                                        let tmpRePrintResult = await this.popRePrintDesc.show()
                                                        if(typeof tmpRePrintResult != 'undefined')
                                                        {
                                                            let tmpLastSignature = await this.nf525.signaturePosDuplicate(tmpLastPos[0])
                                                            let tmpInsertQuery = 
                                                            {
                                                                query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                                                                        "@CUSER = @PCUSER, " + 
                                                                        "@TAG = @PTAG, " +
                                                                        "@POS_GUID = @PPOS_GUID, " +
                                                                        "@LINE_GUID = @PLINE_GUID, " +
                                                                        "@DATA = @PDATA, " +
                                                                        "@DATA_EXTRA1 = @PDATA_EXTRA1, " +
                                                                        "@APP_VERSION = @PAPP_VERSION, " +
                                                                        "@DESCRIPTION = @PDESCRIPTION ", 
                                                                param : ['PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|max','PDATA_EXTRA1:string|max','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                                                                value : [tmpLastPos[0].CUSER,"REPRINT",tmpLastPos[0].GUID,"00000000-0000-0000-0000-000000000000",tmpLastSignature.SIGNATURE,tmpLastSignature.SIGNATURE_SUM,this.core.appInfo.version,tmpRePrintResult]
                                                            }
    
                                                            await this.core.sql.execute(tmpInsertQuery)
                                                            let tmpData = 
                                                            {
                                                                pos : tmpLastPos,
                                                                possale : this.lastPosSaleDt,
                                                                pospay : this.lastPosPayDt,
                                                                pospromo : this.lastPosPromoDt,
                                                                firm : this.firm,
                                                                special : 
                                                                {
                                                                    type : 'Repas',
                                                                    ticketCount : 0,
                                                                    reprint : tmpPrintCount + 1,
                                                                    repas : tmpResult,
                                                                    customerUsePoint : Math.floor(tmpLastPos[0].LOYALTY * 100),
                                                                    customerPoint : (tmpLastPos[0].CUSTOMER_POINT + Math.floor(tmpLastPos[0].LOYALTY * 100)) - Math.floor(tmpLastPos[0].TOTAL),
                                                                    customerGrowPoint : tmpLastPos[0].CUSTOMER_POINT - Math.floor(tmpLastPos[0].TOTAL),
                                                                    customerPointFactory : this.prmObj.filter({ID:'CustomerPointFactory',TYPE:0}).getValue()
                                                                }
                                                            }
                                                            await this.print(tmpData,0)
                                                        }                                                        
                                                    }
                                                    else
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgRePrint',showTitle:true,title:this.lang.t("msgRePrint.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.lang.t("msgRePrint.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgRePrint.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                    } 
                                                }                                                
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-utensils" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                    {/* btnPopLastSaleFile */}
                                    <div className="col-2 p-1">
                                        <NbButton id={"btnPopLastSaleFile"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}
                                        onClick={async()=>
                                        {
                                            let tmpLastPos = new datatable();
                                            tmpLastPos.import(this.grdLastPos.devGrid.getSelectedRowKeys())
                                            
                                            if(this.grdLastPos.devGrid.getSelectedRowKeys().length > 0 && this.grdLastPos.devGrid.getSelectedRowKeys()[0].CUSTOMER_CODE == '')
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgPrintCustomerAlert',showTitle:true,title:this.lang.t("msgPrintCustomerAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                                                    button:[{id:"btn01",caption:this.lang.t("msgPrintCustomerAlert.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgPrintCustomerAlert.btn02"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPrintCustomerAlert.msg")}</div>)
                                                }
                                                if((await dialog(tmpConfObj)) == 'btn01')
                                                {
                                                    this.popPrintCustomerList.POS_GUID = this.grdLastPos.devGrid.getSelectedRowKeys()[0].GUID
                                                    this.popPrintCustomerList.show()
                                                }
                                            }
                                            else
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT COUNT(TAG) AS PRINT_COUNT FROM POS_EXTRA WHERE POS_GUID = @POS_GUID AND TAG = @TAG", 
                                                    param : ['POS_GUID:string|50','TAG:string|25'],
                                                    value : [tmpLastPos[0].GUID,"REPRINTFACT"]
                                                }

                                                let tmpPrintCount = (await this.core.sql.execute(tmpQuery)).result.recordset[0].PRINT_COUNT

                                                let tmpRePrintResult = await this.popRePrintDesc.show()
                                                let tmpDupSignature = await this.nf525.signaturePosFactDuplicate(tmpLastPos[0])
                                                let tmpDupSign = ''

                                                if(tmpDupSignature != '')
                                                {
                                                    tmpDupSign = tmpDupSignature.SIGNATURE.substring(2,3) + tmpDupSignature.SIGNATURE.substring(6,7) + tmpDupSignature.SIGNATURE.substring(12,13) + tmpDupSignature.SIGNATURE.substring(18,19)
                                                }

                                                if(typeof tmpRePrintResult != 'undefined')
                                                {
                                                    let tmpInsertQuery = 
                                                    {
                                                        query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                                                                "@CUSER = @PCUSER, " + 
                                                                "@TAG = @PTAG, " +
                                                                "@POS_GUID = @PPOS_GUID, " +
                                                                "@LINE_GUID = @PLINE_GUID, " +
                                                                "@DATA = @PDATA, " +
                                                                "@DATA_EXTRA1 = @PDATA_EXTRA1, " +
                                                                "@APP_VERSION = @PAPP_VERSION, " +
                                                                "@DESCRIPTION = @PDESCRIPTION ", 
                                                        param : ['PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|max','PDATA_EXTRA1:string|max','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                                                        value : [tmpLastPos[0].CUSER,"REPRINTFACT",tmpLastPos[0].GUID,"00000000-0000-0000-0000-000000000000",tmpDupSignature.SIGNATURE,tmpDupSignature.SIGNATURE_SUM,this.core.appInfo.version,tmpRePrintResult]
                                                    }

                                                    await this.core.sql.execute(tmpInsertQuery)
                                                }

                                                this.sendJet({CODE:"155",NAME:"Duplicata facture imprimé."})

                                                let tmpFactData = await this.factureInsert(tmpLastPos,this.lastPosSaleDt)
                                                let tmpSigned = "-"
                                                let tmpAppVers = ""

                                                if(tmpFactData.length > 0)
                                                {
                                                    tmpAppVers = tmpFactData[0].APP_VERSION

                                                    if(tmpFactData[0].SIGNATURE != '')
                                                    {
                                                        tmpSigned = tmpFactData[0].SIGNATURE.substring(2,3) + tmpFactData[0].SIGNATURE.substring(6,7) + tmpFactData[0].SIGNATURE.substring(12,13) + tmpFactData[0].SIGNATURE.substring(18,19)
                                                    }
                                                }

                                                let tmpData = 
                                                {
                                                    pos : tmpLastPos,
                                                    possale : this.lastPosSaleDt,
                                                    pospay : this.lastPosPayDt,
                                                    pospromo : this.lastPosPromoDt,
                                                    firm : this.firm,
                                                    special : 
                                                    {
                                                        type : 'Fatura',
                                                        ticketCount : 0,
                                                        reprint : tmpPrintCount + 1,
                                                        repas : 0,
                                                        factCertificate : this.core.appInfo.name + " version : " + tmpAppVers + " - " + this.core.appInfo.certificate + " - " + tmpSigned,
                                                        dupCertificate : this.core.appInfo.name + " version : " + this.core.appInfo.version + " - " + this.core.appInfo.certificate + " - " + tmpDupSign,
                                                        customerUsePoint : Math.floor(tmpLastPos[0].LOYALTY * 100),
                                                        customerPoint : (tmpLastPos[0].CUSTOMER_POINT + Math.floor(tmpLastPos[0].LOYALTY * 100)) - Math.floor(tmpLastPos[0].TOTAL),
                                                        customerGrowPoint : tmpLastPos[0].CUSTOMER_POINT - Math.floor(tmpLastPos[0].TOTAL),
                                                        customerPointFactory : this.prmObj.filter({ID:'CustomerPointFactory',TYPE:0}).getValue()
                                                    }
                                                }
                                                //YAZDIRMA İŞLEMİNDEN ÖNCE KULLANICIYA SORULUYOR
                                                let tmpConfObj =
                                                {
                                                    id:'msgMailPrintAlert',showTitle:true,title:this.lang.t("msgMailPrintAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                                                    button:[{id:"btn01",caption:this.lang.t("msgMailPrintAlert.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgMailPrintAlert.btn02"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMailPrintAlert.msg")}</div>)
                                                }
                                                let pResult = await dialog(tmpConfObj);
                                                if(pResult == 'btn01')
                                                {
                                                    if(this.posObj.dt()[0].CUSTOMER_GUID != '00000000-0000-0000-0000-000000000000')
                                                    { 
                                                        let tmpQuery = 
                                                        {
                                                            query :"SELECT EMAIL FROM CUSTOMER_VW_02 WHERE GUID = @GUID",
                                                            param:  ['GUID:string|50'],
                                                            value:  [this.posObj.dt()[0].CUSTOMER_GUID]
                                                        }
                                                        let tmpMailData = await this.core.sql.execute(tmpQuery) 
                                                        if(tmpMailData.result.recordset.length > 0)
                                                        {
                                                            this.txtMail.value = tmpMailData.result.recordset[0].EMAIL
                                                        }
                                                    }

                                                    this.mailPopup.tmpData = tmpData;
                                                    await this.mailPopup.show()
                                                    return
                                                }

                                                await this.print(tmpData,0)
                                            }
                                            
                                        }}>
                                            <i className="text-white fa-solid fa-file-lines" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                    {/* btnPopLastSalePrint */}
                                    <div className="col-2 p-1">
                                            <NbButton id={"btnPopLastSalePrint"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}
                                            onClick={async()=>
                                            {
                                                let tmpLastPos = new datatable();
                                                tmpLastPos.import(this.grdLastPos.devGrid.getSelectedRowKeys())
                                                
                                                if(tmpLastPos.length > 0)
                                                {
                                                    this.rePrint(tmpLastPos,this.lastPosSaleDt,this.lastPosPayDt,this.lastPosPromoDt)
                                                }
                                            }}>
                                                <i className="text-white fa-solid fa-print" style={{fontSize: "16px"}} />
                                            </NbButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Filter */}
                        <div className="row py-1">
                            {/* dtPopLastSaleStartDate */} 
                            <div className="col-2">
                                <NdDatePicker simple={true} parent={this} id={"dtPopLastSaleStartDate"}/>
                            </div>
                            {/* dtPopLastSaleFinishDate */} 
                            <div className="col-2">
                                <NdDatePicker simple={true} parent={this} id={"dtPopLastSaleFinishDate"}/>
                            </div>
                            {/* cmbPopLastSalePayType */} 
                            <div className="col-2">
                                <NdSelectBox simple={true} parent={this} id="cmbPopLastSalePayType" displayExpr={'NAME'} valueExpr={'ID'} value={-1}
                                data={{source : 
                                [
                                    {ID:-1,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionAll")},
                                    {ID:0,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionEspece")},
                                    {ID:1,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionTPE")},
                                    {ID:2,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionCheque1")},
                                    {ID:3,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionCheque2")},
                                    {ID:4,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionAvoir")}
                                ]}}/>
                            </div>
                            {/* cmbPopLastSaleUser */} 
                            <div className="col-2">
                                <NdSelectBox simple={true} parent={this} id="cmbPopLastSaleUser" displayExpr={'NAME'} valueExpr={'CODE'}
                                data={{source:{select:{query : "SELECT '' AS CODE,'ALL' AS NAME UNION ALL SELECT CODE,NAME FROM USERS WHERE STATUS = 1",local:{type : "select",query:"SELECT '' AS CODE,'ALL' AS NAME UNION ALL SELECT CODE,NAME FROM USERS;"}},sql:this.core.sql}}}/>
                            </div>
                            {/* txtPopLastRef */} 
                            <div className="col-2">
                                <NdTextBox id="txtPopLastRef" parent={this} simple={true} placeholder={this.lang.t("txtPopLastRefPholder")}
                                onKeyUp={(e)=>
                                {
                                    if(e.event.key == 'Enter')
                                    {
                                        this.btnPopLastSaleSearch._onClick()
                                    }
                                }}
                                >     
                                </NdTextBox> 
                            </div>
                                
                            {/* btnPopLastSaleSearch */} 
                            <div className="col-2">
                                <NbButton id={"btnPopLastSaleSearch"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"36px",width:"100%"}}
                                onClick={async()=>
                                {
                                    if(this.txtPopLastRef.value == "" && this.txtPopLastRefNo.value == '')
                                    {
                                        this.lastPosDt.selectCmd = 
                                        {
                                            query:  "SELECT *,CONVERT(NVARCHAR,LDATE,104) + '-' + CONVERT(NVARCHAR,LDATE,108) AS CONVERT_DATE, " +
                                                    "SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,36) AS REF_NO " + 
                                                    "FROM POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01 WHERE DOC_DATE >= @START_DATE AND DOC_DATE <= @FINISH_DATE AND " +
                                                    "((ISNULL((SELECT TOP 1 1 FROM POS_PAYMENT AS PAY WHERE PAY.POS = POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01.GUID AND TYPE = @TYPE AND DELETED = 0),0) = 1) OR (@TYPE = -1)) AND " + 
                                                    "((LUSER = @USER) OR (@USER = '')) AND STATUS = 1 AND ((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) ORDER BY LDATE DESC",
                                            param:  ["START_DATE:date","FINISH_DATE:date","TYPE:int","USER:string|25","CUSTOMER_CODE:string|50"],
                                            value:  [this.dtPopLastSaleStartDate.value,this.dtPopLastSaleFinishDate.value,this.cmbPopLastSalePayType.value,this.cmbPopLastSaleUser.value,this.txtPopLastCustomer.value]
                                        }
                                    }
                                    else
                                    {
                                        this.lastPosDt.selectCmd = 
                                        {
                                            query:  "SELECT *,CONVERT(NVARCHAR,LDATE,104) + '-' + CONVERT(NVARCHAR,LDATE,108) AS CONVERT_DATE, " +
                                                    "SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,36) AS REF_NO " + 
                                                    "FROM POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01 WHERE (SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,36) = @REF OR REF = @REF_NO)  AND STATUS = 1",
                                            param:  ["REF:string|25","REF_NO:int"],
                                            value:  [this.txtPopLastRef.value,this.txtPopLastRefNo.value]
                                        }
                                    }
                                    
                                    await this.lastPosDt.refresh()
                                    await this.grdLastPos.dataRefresh({source:this.lastPosDt});   
                                    this.txtPopLastRef.value = ""                                 
                                }}>
                                    <i className="text-white fa-solid fa-magnifying-glass" style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                        </div>
                        <div className="row pb-1">
                            {/* txtPopLastRefNo */} 
                            <div className="col-2">
                                <NdTextBox id="txtPopLastRefNo" parent={this} simple={true} placeholder={this.lang.t("txtPopLastRefNoPholder")}
                                button=
                                {[
                                    {
                                        id:'01',
                                        icon:'edit',
                                        onClick:async()=>
                                        {
                                            this.toggleKeyboardVisibility()
                                            this.keyboardRef.inputName = "txtPopLastRefNo"
                                            this.keyboardRef.setInput(this.txtPopLastRefNo.value)
                                        }
                                    },
                                ]}>      
                                </NdTextBox> 
                            </div>
                            {/* txtPopLastCustomer */} 
                            <div className="col-2">
                                <NdTextBox id="txtPopLastCustomer" parent={this} simple={true} placeholder={this.lang.t("txtPopLastCustomerPholder")}
                                onChange={async(e)=>
                                {                         
                                   this.cmbPopLastSaleUser.value = ''
                                }}
                                button=
                                {[
                                    {
                                        id:'01',
                                        icon:'edit',
                                        onClick:async()=>
                                        {
                                            this.toggleKeyboardVisibility()
                                            this.keyboardRef.inputName = "txtPopLastCustomer"
                                            this.keyboardRef.setInput(this.txtPopLastCustomer.value)
                                        }
                                    },
                                ]}>     
                                </NdTextBox> 
                            </div>
                            {this.state.keyboardVisibility && 
                            (
                                <NbKeyboard id={"keyboardRef"} parent={this} inputName={"txtPopLastRefNo"} keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}/>
                            )}
                        </div>
                        {/* grdLastPos */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdLastPos"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                sorting={{ mode: 'single' }}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                onSelectionChanged={async(e)=>
                                {
                                    if(e.selectedRowKeys.length > 0)
                                    {
                                        this.lastPosSaleDt.selectCmd = 
                                        {
                                            query:  "SELECT * FROM POS_SALE_VW_01 WHERE POS_GUID = @GUID ORDER BY LDATE DESC",
                                            param:  ["GUID:string|50"],
                                            value:  [e.selectedRowKeys[0].GUID]
                                        }
                                        
                                        await this.lastPosSaleDt.refresh()
                                        await this.grdLastSale.dataRefresh({source:this.lastPosSaleDt});

                                        this.lastPosPromoDt.selectCmd = 
                                        {
                                            query : "SELECT * FROM [dbo].[POS_PROMO_VW_01] WHERE POS_GUID = @POS_GUID",
                                            param : ['POS_GUID:string|50'],
                                            value:  [e.selectedRowKeys[0].GUID]
                                        } 
                                        
                                        await this.lastPosPromoDt.refresh()

                                        this.lastPosPayDt.selectCmd = 
                                        {
                                            query:  "SELECT * FROM POS_PAYMENT_VW_01 WHERE POS_GUID = @GUID ORDER BY LDATE DESC",
                                            param:  ["GUID:string|50"],
                                            value:  [e.selectedRowKeys[0].GUID]
                                        }
                                        this.lastPosPayDt.insertCmd = 
                                        {
                                            query : "EXEC [dbo].[PRD_POS_PAYMENT_INSERT] " + 
                                                    "@GUID = @PGUID, " +
                                                    "@CUSER = @PCUSER, " + 
                                                    "@POS = @PPOS, " +
                                                    "@TYPE = @PTYPE, " +
                                                    "@TYPE_NAME = @PTYPE_NAME, " +
                                                    "@LINE_NO = @PLINE_NO, " +
                                                    "@AMOUNT = @PAMOUNT, " + 
                                                    "@CHANGE = @PCHANGE ", 
                                            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PTYPE_NAME:string|50','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
                                            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','PAY_TYPE_NAME','LINE_NO','AMOUNT','CHANGE']
                                        } 
                                        this.lastPosPayDt.updateCmd = 
                                        {
                                            query : "EXEC [dbo].[PRD_POS_PAYMENT_UPDATE] " + 
                                                    "@GUID = @PGUID, " +
                                                    "@CUSER = @PCUSER, " + 
                                                    "@POS = @PPOS, " +
                                                    "@TYPE = @PTYPE, " +
                                                    "@TYPE_NAME = @PTYPE_NAME, " +
                                                    "@LINE_NO = @PLINE_NO, " +
                                                    "@AMOUNT = @PAMOUNT, " + 
                                                    "@CHANGE = @PCHANGE ", 
                                            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PTYPE_NAME:string|50','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
                                            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','PAY_TYPE_NAME','LINE_NO','AMOUNT','CHANGE']
                                        } 
                                        this.lastPosPayDt.deleteCmd = 
                                        {
                                            query : "EXEC [dbo].[PRD_POS_PAYMENT_DELETE] " + 
                                                    "@CUSER = @PCUSER, " + 
                                                    "@UPDATE = 1, " +
                                                    "@GUID = @PGUID, " + 
                                                    "@POS_GUID = @PPOS_GUID ", 
                                            param : ['PCUSER:string|25','PGUID:string|50','PPOS_GUID:string|50'],
                                            dataprm : ['CUSER','GUID','POS_GUID']
                                        }
                                        await this.lastPosPayDt.refresh()
                                        await this.grdLastPay.dataRefresh({source:this.lastPosPayDt});
                                        await this.grdLastTotalPay.dataRefresh({source:this.lastPosPayDt});

                                        this.txtPopLastTotal.newStart = true;                                        
                                    }
                                }}
                                >
                                    <Column dataField="CONVERT_DATE" caption={this.lang.t("grdLastPos.LDATE")} width={150} alignment={"center"}  />
                                    <Column dataField="DEVICE" caption={this.lang.t("grdLastPos.DEVICE")} width={60}/>
                                    <Column dataField="REF_NO" caption={this.lang.t("grdLastPos.REF")} width={150}/>
                                    <Column dataField="CUSTOMER_NAME" caption={this.lang.t("grdLastPos.CUSTOMER_NAME")} width={200}/> 
                                    <Column dataField="CUSER_NAME" caption={this.lang.t("grdLastPos.CUSER_NAME")} width={100}/>
                                    <Column dataField="DISCOUNT" caption={this.lang.t("grdLastPos.DISCOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/> 
                                    <Column dataField="LOYALTY" caption={this.lang.t("grdLastPos.LOYALTY")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                    <Column dataField="TOTAL" caption={this.lang.t("grdLastPos.AMOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/>                                             
                                </NdGrid>
                            </div>
                        </div>
                        <div className="row py-1">
                            {/* grdLastSale */}
                            <div className="col-7">
                                <NdGrid parent={this} id={"grdLastSale"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                >
                                    <Column dataField="BARCODE" caption={this.lang.t("grdLastSale.BARCODE")} width={120}/>
                                    <Column dataField="ITEM_NAME" caption={this.lang.t("grdLastSale.ITEM_NAME")} width={200}/>    
                                    <Column dataField="QUANTITY" caption={this.lang.t("grdLastSale.QUANTITY")} width={50}/>
                                    <Column dataField="PRICE" caption={this.lang.t("grdLastSale.PRICE")} width={50} format={"#,##0.00" + Number.money.sign}/> 
                                    <Column dataField="AMOUNT" caption={this.lang.t("grdLastSale.AMOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                </NdGrid>
                            </div>
                            {/* grdLastPay */}
                            <div className="col-5">
                                <NdGrid parent={this} id={"grdLastPay"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}                          
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                onRowClick={()=>
                                {
                                    if(this.lastPosPayDt.length > 0)
                                    {
                                        this.rbtnTotalPayType.value = 0
                                        this.lastPayRest.value = this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT') < 0 ? 0 : Number(this.lastPosSaleDt[0].GRAND_TOTAL).round(2) - Number(this.lastPosPayDt.sum('AMOUNT')).round(2)
                                        this.txtPopLastTotal.value = this.lastPosSaleDt[0].GRAND_TOTAL;
                                        this.popLastTotal.show()
                                        
                                        //HER EKLEME İŞLEMİNDEN SONRA İLK SATIR SEÇİLİYOR.
                                        setTimeout(() => 
                                        {
                                            this.grdLastTotalPay.devGrid.selectRowsByIndexes(0)
                                            this.grdList.devGrid.option('focusedRowIndex',0)
                                        }, 100);
                                    }
                                }}
                                >
                                    <Column dataField="PAY_TYPE_NAME" caption={this.lang.t("grdLastPay.PAY_TYPE_NAME")} width={150}/>
                                    <Column dataField="AMOUNT" caption={this.lang.t("grdLastPay.AMOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/>    
                                    <Column dataField="CHANGE" caption={this.lang.t("grdLastPay.CHANGE")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                </NdGrid>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Last Total Popup */}
                <div>
                    <NdPopUp parent={this} id={"popLastTotal"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popLastTotal.title")}
                    container={"#root"} 
                    width={"600"}
                    height={"700"}
                    position={{of:"#root"}}
                    onHiding={async()=>
                    {
                        await this.lastPosPayDt.refresh()
                    }}
                    >
                        <div className="row">
                            <div className="col-12">
                                <div className="row pt-2">
                                    {/* Payment Type Selection */}
                                    <div className="col-2 pe-1">
                                        <NbRadioButton id={"rbtnTotalPayType"} parent={this} 
                                        button={
                                            (()=>
                                            {
                                                let tmpArr = []
                                                for (let i = 0; i < this.payType.length; i++) 
                                                {
                                                    if(this.payType[i].TOTAL_VISIBLE)
                                                    {
                                                        tmpArr.push({id:"btn0" + i,style:{height:'49px',width:'100%'},icon:this.payType[i].ICON,text:this.payType[i].NAME,index:this.payType[i].TYPE})
                                                    }
                                                }
                                                return tmpArr
                                            })()
                                        }/>
                                    </div>
                                    {/* Payment Grid */}
                                    <div className="col-10">
                                        {/* grdLastTotalPay */}
                                        <div className="row">
                                            <div className="col-12">
                                                <NdGrid parent={this} id={"grdLastTotalPay"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                showRowLines={true}
                                                showColumnLines={true}
                                                showColumnHeaders={false}
                                                height={"138px"} 
                                                width={"100%"}
                                                dbApply={false}
                                                selection={{mode:"single"}}
                                                onRowPrepared={(e)=>
                                                {
                                                    e.rowElement.style.fontSize = "16px";
                                                    e.rowElement.style.fontWeight = "bold";
                                                }}
                                                onRowRemoved={async (e) =>
                                                {
                                                    
                                                }}
                                                >
                                                    <Editing confirmDelete={false}/>
                                                    <Column dataField="PAY_TYPE_NAME" width={200} alignment={"center"}/>
                                                    <Column dataField="AMOUNT" width={100} format={"#,##0.00" + Number.money.sign}/>  
                                                    <Column dataField="CHANGE" width={100} format={"#,##0.00" + Number.money.sign}/>                                                
                                                </NdGrid>
                                            </div>
                                        </div>
                                        {/* lastPayRest */}
                                        <div className="row pt-1">
                                            <div className="col-12">
                                                <p className="fs-2 fw-bold text-center m-0"><NbLabel id="lastPayRest" parent={this} value={"0.00"} format={"currency"}/></p>
                                            </div>
                                        </div>
                                        {/* txtPopLastTotal */}
                                        <div className="row pt-1">
                                            <div className="col-12">
                                                <NdTextBox id="txtPopLastTotal" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                                </NdTextBox> 
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    {/* numPopLastTotal */}
                                    <div className="col-9">
                                        <NbNumberboard id={"numPopLastTotal"} parent={this} textobj="txtPopLastTotal" span={1} buttonHeight={"60px"}/>
                                    </div>
                                    <div className="col-3">
                                        {/* T.R Detail */}
                                        <div className="row pb-1">                                            
                                            <div className="col-12">
                                                <NbButton id={"btnPopLastTotalTRDetail"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={async ()=>
                                                {
                                                    if(this.lastPosPayDt.where({PAY_TYPE:3}).length > 0)
                                                    {
                                                        let tmpDt = new datatable(); 
                                                        tmpDt.selectCmd = 
                                                        {
                                                            query : "SELECT AMOUNT AS AMOUNT,COUNT(AMOUNT) AS COUNT FROM CHEQPAY_VW_01 WHERE DOC = @DOC GROUP BY AMOUNT",
                                                            param : ['DOC:string|50'],
                                                            local : 
                                                            {
                                                                type : "select",
                                                                query : "SELECT AMOUNT, COUNT(AMOUNT) AS COUNT FROM CHEQPAY_VW_01 WHERE DOC = ? GROUP BY AMOUNT",
                                                                values : [this.lastPosPayDt[0].POS_GUID]
                                                            }
                                                        }
                                                        tmpDt.selectCmd.value = [this.lastPosPayDt[0].POS_GUID]
                                                        await tmpDt.refresh();
                                                        
                                                        await this.grdLastTRDetail.dataRefresh({source:tmpDt});
                                                        this.popLastTRDetail.show()
                                                    }
                                                }}>
                                                    {this.lang.t("trDeatil")}
                                                </NbButton>
                                            </div>
                                        </div>
                                        {/* Line Delete */}
                                        <div className="row py-1">                                            
                                            <div className="col-12">
                                                <NbButton id={"btnPopLastTotalLineDel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={async()=>
                                                {
                                                    if(this.grdLastTotalPay.devGrid.getSelectedRowKeys().length > 0)
                                                    {                                                        
                                                        this.grdLastTotalPay.devGrid.deleteRow(this.grdLastTotalPay.devGrid.getRowIndexByKey(this.grdLastTotalPay.devGrid.getSelectedRowKeys()[0]))
                                                        this.lastPayRest.value = this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT') < 0 ? 0 : Number(this.lastPosSaleDt[0].GRAND_TOTAL).round(2) - Number(this.lastPosPayDt.sum('AMOUNT')).round(2)
                                                        this.txtPopLastTotal.newStart = true;

                                                        //HER EKLEME İŞLEMİNDEN SONRA İLK SATIR SEÇİLİYOR.
                                                        setTimeout(() => 
                                                        {
                                                            this.grdLastTotalPay.devGrid.selectRowsByIndexes(0)
                                                            this.grdList.devGrid.option('focusedRowIndex',0)
                                                        }, 100);
                                                    }
                                                }}>
                                                    {this.lang.t("lineDelete")}
                                                </NbButton>
                                            </div>
                                        </div>
                                        {/* Cancel */}
                                        <div className="row py-1">                                            
                                            <div className="col-12">
                                                <NbButton id={"btnPopLastTotalCancel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={()=>{this.popLastTotal.hide()}}>
                                                     {this.lang.t("cancel")}
                                                </NbButton>
                                            </div>
                                        </div>
                                        {/* Okey */}
                                        <div className="row py-1">                                            
                                            <div className="col-12">
                                                <NbButton id={"btnPopLastTotalOkey"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={async()=>
                                                {
                                                    let tmpTypeName = ""
                                                    let tmpAmount = Number(parseFloat(this.txtPopLastTotal.value).round(2))
                                                    let tmpChange = Number(parseFloat(this.lastPosSaleDt[0].GRAND_TOTAL - (this.lastPosPayDt.sum('AMOUNT') + tmpAmount)).round(2))
                                                    
                                                    if(this.payType.where({TYPE:this.rbtnTotalPayType.value}).length > 0)
                                                    {
                                                        tmpTypeName = this.payType.where({TYPE:this.rbtnTotalPayType.value})[0].NAME
                                                    }
                                                    
                                                    if(tmpChange < 0)
                                                    {
                                                        if(this.rbtnTotalPayType.value == 0 && (this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT')) > 0)
                                                        {
                                                            tmpChange = tmpChange * -1
                                                            tmpAmount = this.txtPopLastTotal.value  //- tmpChange
                                                        }
                                                        else
                                                        {       
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgPayNotBigToPay',showTitle:true,title:this.lang.t("msgPayNotBigToPay.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.lang.t("msgPayNotBigToPay.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPayNotBigToPay.msg")}</div>)
                                                            }
                                                            await dialog(tmpConfObj);
                                                            tmpAmount = (this.txtPopLastTotal.value  - tmpChange) * -1
                                                            tmpChange = 0
                                                        }
                                                    }
                                                    else
                                                    {
                                                        tmpChange = 0
                                                    }

                                                    if(tmpAmount > 0)
                                                    {
                                                        let tmpData = 
                                                        {
                                                            GUID : datatable.uuidv4(),
                                                            CUSER : this.core.auth.data.CODE,
                                                            POS_GUID : this.lastPosSaleDt[0].POS_GUID,
                                                            PAY_TYPE : this.rbtnTotalPayType.value,
                                                            PAY_TYPE_NAME : tmpTypeName,
                                                            LINE_NO : this.lastPosPayDt.length + 1,
                                                            AMOUNT : tmpAmount,
                                                            CHANGE : tmpChange
                                                        }
                                                        this.lastPosPayDt.push(tmpData)
                                                        this.lastPayRest.value = this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT') < 0 ? 0 : Number(this.lastPosSaleDt[0].GRAND_TOTAL).round(2) - Number(this.lastPosPayDt.sum('AMOUNT')).round(2)
                                                        this.txtPopLastTotal.newStart = true;
                                                    }

                                                    //HER EKLEME İŞLEMİNDEN SONRA İLK SATIR SEÇİLİYOR.
                                                    setTimeout(() => 
                                                    {
                                                        this.grdLastTotalPay.devGrid.selectRowsByIndexes(0)
                                                        this.grdList.devGrid.option('focusedRowIndex',0)
                                                    }, 100);
                                                }}>
                                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                                <div className="row pt-2">
                                    <div className="col-12">
                                        <NbButton id={"btnPopLastTotalSave"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                        onClick={async ()=>
                                        {
                                            if(this.lastPayRest.value > 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgMissingPay',showTitle:true,title:this.lang.t("msgMissingPay.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("msgMissingPay.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMissingPay.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return
                                            }

                                            await this.lastPosPayDt.delete()
                                            await this.lastPosPayDt.update() 
                                            this.popLastTotal.hide()
                                        }}>
                                            <i className="text-white fa-solid fa-floppy-disk" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>                              
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Last T.R Detail Popup */}
                <div>
                    <NdPopUp parent={this} id={"popLastTRDetail"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Ticket Restorant"}
                    container={"#root"} 
                    width={"600"}
                    height={"600"}
                    position={{of:"#root"}}
                    >
                        {/* grdLastTRDetail */}
                        <div className="row">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdLastTRDetail"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                height={"500px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";                                             
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    if(e.rowType == "data")
                                    {
                                        e.cellElement.style.padding = "12px"
                                    }
                                }}
                                >
                                    <Column dataField="AMOUNT" alignment={"center"} caption={this.lang.t("grdLastTRDetail.AMOUNT")} format={"#,##0.00" + Number.money.sign} width={200}/>
                                    <Column dataField="COUNT" alignment={"center"} caption={this.lang.t("grdLastTRDetail.COUNT")} format={"### Qty"} width={200} />
                                </NdGrid>
                            </div>
                        </div>
                    </NdPopUp>    
                </div>
                {/* Price Description Popup */} 
                <div>
                    <NbPopDescboard id={"popPriceDesc"} parent={this} width={"900"} height={"700"} position={"#root"} head={this.lang.t("popPriceDesc.head")} title={this.lang.t("popPriceDesc.title")}                    
                    param={this.prmObj.filter({ID:'PriceDescription',TYPE:0})}
                    onClick={async (e)=>
                    {
                        if(typeof this.acsObj.filter({ID:'PriceEdit',TYPE:1}).getValue().dialog != 'undefined' && this.acsObj.filter({ID:'PriceEdit',TYPE:1}).getValue().dialog.type != -1)
                        {   
                            let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:this.acsObj.filter({ID:'PriceEdit',TYPE:1}).getValue().dialog.type})
                            if(!tmpResult)
                            {
                                return
                            }
                        }
                        
                        let tmpResult = await this.popNumber.show(this.lang.t("price"),this.grdList.devGrid.getSelectedRowKeys()[0].PRICE,undefined,this.grdList.devGrid.getSelectedRowKeys()[0].ITEM_NAME)                                            
                        if(typeof tmpResult != 'undefined' && tmpResult != '')
                        {
                            if(typeof e != 'undefined')
                            {
                                this.sendJet({CODE:"323",NAME:"Prix de l'article modifie .",DESCRIPTION:e}) 
                                await this.descSave("PRICE DESC",e,this.grdList.devGrid.getSelectedRowKeys()[0].GUID,this.grdList.devGrid.getSelectedRowKeys()[0].PRICE)
                            }
                            
                            if((await this.priceCheck(this.grdList.devGrid.getSelectedRowKeys()[0],tmpResult)))
                            {
                                let tmpData = {QUANTITY:this.grdList.devGrid.getSelectedRowKeys()[0].QUANTITY,SCALE_MANUEL:this.grdList.devGrid.getSelectedRowKeys()[0].SCALE_MANUEL,PRICE:Number(tmpResult)}
                                this.saleRowUpdate(this.grdList.devGrid.getSelectedRowKeys()[0],tmpData)
                            }
                        }
                    }}></NbPopDescboard>
                </div>
                {/* Park Description Popup */} 
                <div>
                    <NbPopDescboard id={"popParkDesc"} parent={this} width={"900"} height={"700"} position={"#root"} head={this.lang.t("popParkDesc.head")} title={this.lang.t("popParkDesc.title")}                    
                    param={this.prmObj.filter({ID:'ParkDelDescription',TYPE:0})}
                    onClick={async (e)=>
                    {
                        if(typeof e != 'undefined')
                        {
                            await this.descSave("PARK DESC",e,'00000000-0000-0000-0000-000000000000')
                        }
                        this.init()
                    }}></NbPopDescboard>
                </div>
                {/* Delete Description Popup */} 
                <div>
                    <NbPopDescboard id={"popDeleteDesc"} parent={this} width={"900"} height={"700"} position={"#root"} head={this.lang.t("popDeleteDesc.head")} title={this.lang.t("popDeleteDesc.title")} 
                    param={this.prmObj.filter({ID:'DocDelDescription',TYPE:0})}
                    onClick={async (e)=>
                    {
                        this.sendJet({CODE:"320",NAME:"Ticket en attente annulé et supprimé.",DESCRIPTION:e}) //// Beklemedeki fiş silindi.
                        if(typeof e != 'undefined')
                        {
                            await this.descSave("FULL DELETE",e,'00000000-0000-0000-0000-000000000000')
                        }
                        this.loading.current.instance.show()
                        await this.delete()
                        this.loading.current.instance.hide()
                    }}></NbPopDescboard>
                </div>
                {/* Row Delete Description Popup */} 
                <div>
                    <NbPopDescboard id={"popRowDeleteDesc"} parent={this} width={"900"} height={"700"} position={"#root"} head={this.lang.t("popRowDeleteDesc.head")} title={this.lang.t("popRowDeleteDesc.title")}         
                    param={this.prmObj.filter({ID:'DocRowDelDescription',TYPE:0})}
                    onClick={async (e)=>
                    {
                        this.sendJet({CODE:"323",NAME:"Ligne de article supprimé.",DESCRIPTION:e})  //// Beklemedeki fiş satırı silindi.
                        if(typeof e != 'undefined')
                        {
                            await this.descSave("ROW DELETE",e,this.grdList.devGrid.getSelectedRowKeys()[0].GUID)
                        }
                        this.loading.current.instance.show()
                        await this.rowDelete()
                        this.loading.current.instance.hide()
                    }}></NbPopDescboard>
                </div>
                {/* Item Return Description Popup */} 
                <div>
                    <NbPopDescboard id={"popItemReturnDesc"} parent={this} width={"900"} height={"700"} position={"#root"} head={this.lang.t("popItemReturnDesc.head")} title={this.lang.t("popItemReturnDesc.title")}     
                    param={this.prmObj.filter({ID:'RebateDescription',TYPE:0})}
                    onClick={async (e)=>
                    {        
                        if(typeof e != 'undefined')
                        {
                            this.sendJet({CODE:"326",NAME:"Retour(s) d'article(s).",DESCRIPTION:e})

                            let tmpResult = await this.msgItemReturnType.show();
                        
                            if(tmpResult == 'btn01') //Nakit
                            {
                                this.posObj.posPay.addEmpty()
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE = 0
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE_NAME = this.payType.where({TYPE:0}).length > 0 ? this.payType.where({TYPE:0})[0].NAME : ""
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].LINE_NO = this.posObj.posPay.dt().length
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = Number(parseFloat(this.posObj.dt()[0].TOTAL).round(2))
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = 0
                                await this.posDevice.caseOpen();
                            }
                            else if(tmpResult == 'btn02') //İade Çeki
                            {
                                this.posObj.posPay.addEmpty()
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE = 4
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE_NAME = this.payType.where({TYPE:4}).length > 0 ? this.payType.where({TYPE:4})[0].NAME : ""
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].LINE_NO = this.posObj.posPay.dt().length
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = Number(parseFloat(this.posObj.dt()[0].TOTAL).round(2))
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = 0

                                this.posObj.dt()[0].REBATE_CHEQPAY = 'Q' + new Date().toISOString().substring(2, 10).replace('-','').replace('-','') + Math.round(Number(parseFloat(this.posObj.dt()[0].TOTAL).round(2)) * 100).toString().padStart(5,'0') + Date.now().toString().substring(7,12);

                                await this.cheqpaySave(this.posObj.dt()[0].REBATE_CHEQPAY,this.posObj.dt()[0].TOTAL,0,1);
                            }
                            else if(tmpResult == 'btn03') //CB
                            {
                                let tmpPayCard = await this.payCard(Number(parseFloat(this.posObj.dt()[0].TOTAL).round(2)),0)

                                if(tmpPayCard == 1) //Başarılı
                                {
                                    this.msgCardPayment.hide()
                                }
                                else if(tmpPayCard == 2) //Zorla
                                {
                                    this.msgCardPayment.hide()
                                }
                                else if(tmpPayCard == 3) //iptal
                                {
                                    this.msgCardPayment.hide()
                                    return                    
                                }
                                else //Başarısız veya İptal
                                {
                                    this.msgCardPayment.hide()
                                    return
                                }

                                this.posObj.posPay.addEmpty()
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE = 1
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE_NAME = this.payType.where({TYPE:1}).length > 0 ? this.payType.where({TYPE:1})[0].NAME : ""
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].LINE_NO = this.posObj.posPay.dt().length
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = Number(parseFloat(this.posObj.dt()[0].TOTAL).round(2))
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = 0
                            }

                            if(this.txtItemReturnTicket.value != "")
                            {
                                this.posObj.dt()[0].TICKET = this.txtItemReturnTicket.value;
                            }

                            this.posObj.dt()[0].TYPE = 1;
                            this.posObj.dt()[0].TYPE_NAME = 'RETOUR';
                            
                            await this.descSave("REBATE",e,'00000000-0000-0000-0000-000000000000'); 
                        }                
                        this.core.util.writeLog("calcGrandTotal : 20")
                        await this.calcGrandTotal();
                    }}></NbPopDescboard>
                </div>
                {/* Discount Description Popup */} 
                <div>
                    <NbPopDescboard id={"popDiscountDesc"} parent={this} width={"900"} height={"700"} position={"#root"} head={this.lang.t("popDiscountDesc.head")} title={this.lang.t("popDiscountDesc.title")}     
                    param={this.prmObj.filter({ID:'DiscountDescription',TYPE:0})}></NbPopDescboard>
                </div>
                {/* Item Return Ticket Dialog  */}
                <div>
                    <NdDialog id={"msgItemReturnTicket"} container={"#root"} parent={this}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        title={this.lang.t("msgItemReturnTicket.title")} 
                        showCloseButton={false}
                        width={"500px"}
                        height={"250px"}
                        button={[{id:"btn01",caption:this.lang.t("msgItemReturnTicket.btn01"),location:'before'},{id:"btn03",caption:this.lang.t("msgItemReturnTicket.btn03"),location:'before'},{id:"btn02",caption:this.lang.t("msgItemReturnTicket.btn02"),location:'after'}]}
                        onShowed={()=>
                        {
                            this.txtItemReturnTicket.value = ""
                            setTimeout(() => 
                            {
                                this.txtItemReturnTicket.focus()
                            }, 500);
                        }}
                        >
                            <div className="row">
                                <div className="col-12 py-2">
                                    <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgItemReturnTicket.msg")}</div>
                                </div>
                                <div className="col-12 py-2">
                                    <Form>
                                        {/* txtItemReturnTicket */}
                                        <Item>
                                            <NdTextBox id="txtItemReturnTicket" parent={this} simple={true} mode={"password"}
                                            onKeyUp={(e)=>
                                            {
                                                if(e.event.key == 'Enter')
                                                {
                                                    this.ticketCheck(this.txtItemReturnTicket.value)
                                                }
                                            }}/>
                                        </Item>
                                    </Form>
                                </div>
                            </div>
                    </NdDialog>
                </div>
                {/* Alert Item Return Type Popup */} 
                <div>
                    <NdDialog id={"msgItemReturnType"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.lang.t("msgItemReturnType.title")} 
                    showCloseButton={true}
                    width={"500px"}
                    height={"200px"}
                    button={[{id:"btn01",caption:this.lang.t("msgItemReturnType.btn01"),location:'before'},{id:"btn03",caption:this.lang.t("msgItemReturnType.btn03"),location:'before'},{id:"btn02",caption:this.lang.t("msgItemReturnType.btn02"),location:'after'}]}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgItemReturnType.msg")}</div>
                            </div>
                        </div>
                    </NdDialog>                    
                </div>
                {/* Alert Weighing Popup */} 
                <div>
                    <NdDialog id={"msgWeighing"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.lang.t("msgWeighing.title")} 
                    showCloseButton={false}
                    width={"500px"}
                    height={"200px"}
                    button={[{id:"btn01",caption:this.lang.t("msgWeighing.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgWeighing.btn02"),location:'after'}]}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgWeighing.msg")}</div>
                            </div>
                        </div>
                    </NdDialog>
                </div>
                {/* Alert Card Payment Popup */} 
                <div>
                    <NdDialog id={"msgCardPayment"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.lang.t("msgCardPayment.title")} 
                    showCloseButton={false}
                    width={"500px"}
                    height={"200px"}
                    button={[{id:"btn01",caption:this.lang.t("msgCardPayment.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgCardPayment.btn02"),location:'center'},{id:"btn03",caption:this.lang.t("msgCardPayment.btn03"),location:'after'}]}
                    >
                        <div className="row">
                            <div className="col-12">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCardPayment.msg")}</div>                              
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12" style={{textAlign:"center",fontSize:"20px",color:"red",padding:"10px"}}>
                                {this.lang.t("msgCardPayment.msgAmount" )} <NbLabel id="txtPaymentPopTotal" parent={this} value={"0.00" + Number.money.sign} format={"currency"}/>
                            </div>
                        </div>
                    </NdDialog>
                </div>
                {/* Diffrent Price Popup */}
                <div>
                    <NdPopUp parent={this} id={"popDiffPrice"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popDiffPrice.title")}
                    container={"#root"} 
                    width={"300"}
                    height={"515"}
                    position={{of:"#root"}}
                    >
                        {/* txtPopDiffPriceQ */}
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id={"txtPopDiffPriceQ"} parent={this} simple={true} onFocusIn={()=>
                                {
                                    this.numPopDiffPrice.textobj = "txtPopDiffPriceQ"
                                }}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        {/* txtPopDiffPriceP */}
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id={"txtPopDiffPriceP"} parent={this} simple={true} onFocusIn={()=>
                                {
                                    this.numPopDiffPrice.textobj = "txtPopDiffPriceP"
                                }}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        {/* numPopDiffPrice */}
                        <div className="row pt-2">                        
                            <div className="col-12">
                                <NbNumberboard id={"numPopDiffPrice"} parent={this} textobj={"txtPopDiffPriceQ"} span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        {/* btnPopDiffPrice */}
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnPopDiffPrice"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                onClick={()=>
                                {
                                    let tmpData = {QUANTITY:this.txtPopDiffPriceQ.value * -1,PRICE:this.txtPopDiffPriceP.value};
                                    this.saleRowUpdate(this.grdList.devGrid.getSelectedRowKeys()[0],tmpData);
                                    this.popDiffPrice.hide();
                                }}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Alert RePayment Type Popup */}
                <div>
                    <NdDialog id={"msgRePaymentType"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.lang.t("msgRePaymentType.title")} 
                    showCloseButton={false}
                    width={"500px"}
                    height={"200px"}
                    >
                        <div className="row">
                            <div className="col-3 py-2">
                                <NbButton id={"btnMsgRePaymentESC"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"70px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.msgRePaymentType._onClick("btn01")
                                }}>
                                    <div className="row"><div className="col-12">{this.payType.where({TYPE:0}).length > 0 ? this.payType.where({TYPE:0})[0].NAME : ""}</div></div>
                                    <div className="row"><div className="col-12"><i className={"text-white fa-solid " + (this.payType.where({TYPE:0}).length > 0 ? this.payType.where({TYPE:0})[0].ICON : "")} style={{fontSize: "24px"}}/></div></div>
                                </NbButton>
                            </div>
                            <div className="col-3 py-2">
                                <NbButton id={"btnMsgRePaymentCB"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"70px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.msgRePaymentType._onClick("btn02")
                                }}>
                                    <div className="row"><div className="col-12">{this.payType.where({TYPE:1}).length > 0 ? this.payType.where({TYPE:1})[0].NAME : ""}</div></div>
                                    <div className="row"><div className="col-12"><i className={"text-white fa-solid " + (this.payType.where({TYPE:1}).length > 0 ? this.payType.where({TYPE:1})[0].ICON : "")} style={{fontSize: "24px"}}/></div></div>                                    
                                </NbButton>
                            </div>
                            <div className="col-3 py-2">
                                <NbButton id={"btnMsgRePaymentCHQ"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"70px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.msgRePaymentType._onClick("btn03")
                                }}>
                                    <div className="row"><div className="col-12">{this.payType.where({TYPE:2}).length > 0 ? this.payType.where({TYPE:2})[0].NAME : ""}</div></div>
                                    <div className="row"><div className="col-12"><i className={"text-white fa-solid " + (this.payType.where({TYPE:2}).length > 0 ? this.payType.where({TYPE:2})[0].ICON : "")} style={{fontSize: "24px"}} /></div></div>                                    
                                </NbButton>
                            </div>
                            <div className="col-3 py-2">
                                <NbButton id={"btnMsgRePaymentTR"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"70px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.msgRePaymentType._onClick("btn04")
                                }}>
                                    <div className="row"><div className="col-12">{this.payType.where({TYPE:3}).length > 0 ? this.payType.where({TYPE:3})[0].NAME : ""}</div></div>
                                    <div className="row"><div className="col-12"><i className={"text-white fa-solid " + (this.payType.where({TYPE:3}).length > 0 ? this.payType.where({TYPE:3})[0].ICON : "")} style={{fontSize: "24px"}} /></div></div>                                    
                                </NbButton>
                            </div>
                        </div>
                    </NdDialog>
                </div>
                {/* T.R Detail Popup */}
                <div>
                    <NdPopUp parent={this} id={"popTRDetail"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popTRDetail.title")}
                    container={"#root"} 
                    width={"600"}
                    height={"600"}
                    position={{of:"#root"}}
                    >
                        {/* grdTRDetail */}
                        <div className="row">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdTRDetail"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                height={"500px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";                                             
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    if(e.rowType == "data")
                                    {
                                        e.cellElement.style.padding = "12px"
                                    }
                                }}
                                >
                                    <Column dataField="AMOUNT" alignment={"center"} caption={this.lang.t("grdTRDetail.AMOUNT")} format={"#,##0.00" + Number.money.sign} width={200}/>
                                    <Column dataField="COUNT" alignment={"center"} caption={this.lang.t("grdTRDetail.COUNT")} format={"### Qty"} width={200} />
                                </NdGrid>
                            </div>
                        </div>
                    </NdPopUp>    
                </div>
                {/* Advance Popup */}
                <div>
                    <NdPopUp parent={this} id={"popAdvance"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popAdvance.title")}
                    container={"#root"} 
                    width={"300"}
                    height={"550"}
                    position={{of:"#root"}}
                    >
                        <div className="row pt-1 pe-2">
                            <div className="col-12">
                                <NbRadioButton id={"rbtnAdvanceType"} parent={this} vertical={false}
                                button={
                                    [
                                        {
                                            id:"btn01",
                                            style:{height:'66px',width:'100%'},
                                            icon:"fa-arrow-right-to-bracket",
                                            text:this.lang.t("popAdvance.in")
                                        },
                                        {
                                            id:"btn02",
                                            style:{height:'66px',width:'100%'},
                                            icon:"fa-arrow-right-from-bracket",
                                            text:this.lang.t("popAdvance.out")
                                        }
                                    ]
                                }/>
                            </div>
                        </div>
                        {/* txtPopAdvance */}
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id={"txtPopAdvance"} parent={this} simple={true} />
                            </div>
                        </div> 
                        <div className="row pt-2">
                            {/* numPopAdvance */}
                            <div className="col-12">
                                <NbNumberboard id={"numPopAdvance"} parent={this} textobj={"txtPopAdvance"} span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        {/* btnPopAdvance */}
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnPopAdvance"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                onClick={async()=>
                                {
                                    if(this.txtPopAdvance.value > 0)
                                    {
                                        this.popAdvanceDesc.show()
                                    }
                                }}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Advance Description Popup */} 
                <div>
                    <NbPopDescboard id={"popAdvanceDesc"} parent={this} width={"900"} height={"700"} position={"#root"} head={this.lang.t("popAdvanceDesc.head")} title={this.lang.t("popAdvanceDesc.title")}                    
                    param={this.prmObj.filter({ID:'AdvanceDescription',TYPE:0})}
                    onClick={async (e)=>
                    {
                        if(typeof e != 'undefined')
                        {
                            if(this.txtPopAdvance.value > 0)
                            {
                                let tmpInput
                                let tmpOutput
                                if(this.rbtnAdvanceType.value == 0)
                                {
                                    tmpInput = this.posDevice.dt().length > 0 ? this.posDevice.dt()[0].SAFE_GUID : '00000000-0000-0000-0000-000000000000'
                                    tmpOutput = this.prmObj.filter({ID:'SafeCenter',TYPE:0}).getValue()                                    
                                }
                                else
                                {
                                    tmpInput = this.prmObj.filter({ID:'SafeCenter',TYPE:0}).getValue()
                                    tmpOutput = this.posDevice.dt().length > 0 ? this.posDevice.dt()[0].SAFE_GUID : '00000000-0000-0000-0000-000000000000'
                                }

                                let tmpDoc = new docCls()
                                tmpDoc.addEmpty()
                                tmpDoc.dt()[0].TYPE = 2
                                tmpDoc.dt()[0].DOC_TYPE = 201
                                tmpDoc.dt()[0].REF = 'POS'
                                tmpDoc.dt()[0].REF_NO = Math.floor(Date.now() / 1000)
                                tmpDoc.dt()[0].INPUT = tmpInput
                                tmpDoc.dt()[0].OUTPUT = tmpOutput
                                tmpDoc.dt()[0].AMOUNT = this.txtPopAdvance.value
                                tmpDoc.dt()[0].TOTAL = this.txtPopAdvance.value

                                tmpDoc.docCustomer.addEmpty()
                                tmpDoc.docCustomer.dt()[0].TYPE = 2
                                tmpDoc.docCustomer.dt()[0].DOC_GUID = tmpDoc.dt()[0].GUID
                                tmpDoc.docCustomer.dt()[0].DOC_TYPE = 201
                                tmpDoc.docCustomer.dt()[0].REF = 'POS'
                                tmpDoc.docCustomer.dt()[0].REF_NO = tmpDoc.dt()[0].REF_NO
                                tmpDoc.docCustomer.dt()[0].INPUT = tmpDoc.dt()[0].INPUT
                                tmpDoc.docCustomer.dt()[0].OUTPUT = tmpDoc.dt()[0].OUTPUT
                                tmpDoc.docCustomer.dt()[0].PAY_TYPE = 20
                                tmpDoc.docCustomer.dt()[0].AMOUNT = this.txtPopAdvance.value
                                tmpDoc.docCustomer.dt()[0].DESCRIPTION = e

                                await tmpDoc.save()

                                this.sendJet({CODE:"170",NAME:"Avans giriş çıkış işlemi yapıldı"}) //BAK
                                
                                this.popAdvance.hide()

                                let tmpConfObj =
                                {
                                    id:'msgSave',showTitle:true,title:this.lang.t("msgSave.title"),showCloseButton:true,width:'500px',height:'250px',
                                    button:[{id:"btn01",caption:this.lang.t("msgSave.btn01"),location:'before'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgSave.msg")}</div>)
                                }
                                await dialog(tmpConfObj);
                            }
                        }
                    }}></NbPopDescboard>
                </div>
                {/* Settings Popup */}
                <div>
                    <NdPopUp parent={this} id={"popSettings"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popSettings.title")}
                    container={"#root"} 
                    width={"900"}
                    height={"580"}
                    position={{of:"#root"}}
                    >
                        <Form colCount={2} height={'fit-content'} id={"frmSettings"}>
                            <Item>
                                <Label text={this.lang.t("popSettings.lcdPort")} alignment="right" />
                                <NdTextBox id={"txtPopSettingsLcd"} parent={this} simple={true} valueChangeEvent="keyup" 
                                onValueChanging={(e)=>
                                {       
                                    this.keyPopSettings.setCaretPosition(e.length)
                                    this.keyPopSettings.setInput(e)
                                }} 
                                onFocusIn={()=>
                                {                                    
                                    this.keyPopSettings.inputName = "txtPopSettingsLcd"
                                    this.keyPopSettings.setInput(this.txtPopSettingsLcd.value)
                                }}/>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popSettings.scalePort")} alignment="right" />
                                <NdTextBox id={"txtPopSettingsScale"} parent={this} simple={true} valueChangeEvent="keyup" 
                                onValueChanging={(e)=>
                                {
                                    this.keyPopSettings.setCaretPosition(e.length)
                                    this.keyPopSettings.setInput(e)
                                }} 
                                onFocusIn={()=>
                                {
                                    this.keyPopSettings.inputName = "txtPopSettingsScale"
                                    this.keyPopSettings.setInput(this.txtPopSettingsScale.value)
                                }}/>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popSettings.payCardPort")} alignment="right" />
                                <NdTextBox id={"txtPopSettingsPayCard"} parent={this} simple={true} valueChangeEvent="keyup" 
                                onValueChanging={(e)=>
                                {
                                    this.keyPopSettings.setCaretPosition(e.length)
                                    this.keyPopSettings.setInput(e)
                                }} 
                                onFocusIn={()=>
                                {
                                    this.keyPopSettings.inputName = "txtPopSettingsPayCard"
                                    this.keyPopSettings.setInput(this.txtPopSettingsPayCard.value)
                                }}/>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popSettings.printDesing")} alignment="right" />
                                <NdTextBox id={"txtPopSettingsPrint"} parent={this} simple={true} valueChangeEvent="keyup" 
                                onValueChanging={(e)=>
                                {
                                    this.keyPopSettings.setCaretPosition(e.length)
                                    this.keyPopSettings.setInput(e)
                                }}
                                onFocusIn={()=>
                                {
                                    this.keyPopSettings.inputName = "txtPopSettingsPrint"
                                    this.keyPopSettings.setInput(this.txtPopSettingsPrint.value)
                                }}/>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popSettings.scannerPort")} alignment="right" />
                                <NdTextBox id={"txtPopSettingsScanner"} parent={this} simple={true} valueChangeEvent="keyup" 
                                onValueChanging={(e)=>
                                {
                                    this.keyPopSettings.setCaretPosition(e.length)
                                    this.keyPopSettings.setInput(e)
                                }}
                                onFocusIn={()=>
                                {
                                    this.keyPopSettings.inputName = "txtPopSettingsScanner"
                                    this.keyPopSettings.setInput(this.txtPopSettingsScanner.value)
                                }}/>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popSettings.printerPort")} alignment="right" />
                                <NdTextBox id={"txtPopSettingsPrinter"} parent={this} simple={true} valueChangeEvent="keyup" 
                                onValueChanging={(e)=>
                                {
                                    this.keyPopSettings.setCaretPosition(e.length)
                                    this.keyPopSettings.setInput(e)
                                }}
                                onFocusIn={()=>
                                {
                                    this.keyPopSettings.inputName = "txtPopSettingsPrinter"
                                    this.keyPopSettings.setInput(this.txtPopSettingsPrinter.value)
                                }}/>
                            </Item>
                        </Form>
                        <div className="row py-1">
                            <div className="col-12">
                                <NbKeyboard id={"keyPopSettings"} parent={this} inputName={"txtPopSettingsLcd"} keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}/>
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col-12">
                                <NbButton id={"btnPopSettingsOk"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                onClick={async()=>
                                {
                                    if(this.posDevice.dt().length > 0)
                                    {
                                        this.posDevice.dt()[0].LCD_PORT = this.txtPopSettingsLcd.value
                                        this.posDevice.dt()[0].SCALE_PORT = this.txtPopSettingsScale.value
                                        this.posDevice.dt()[0].PAY_CARD_PORT = this.txtPopSettingsPayCard.value
                                        this.posDevice.dt()[0].PRINT_DESING = this.txtPopSettingsPrint.value
                                        this.posDevice.dt()[0].SCANNER_PORT = this.txtPopSettingsScanner.value
                                        this.posDevice.dt()[0].PRINTER_PORT = this.txtPopSettingsPrinter.value
                                    }
                                    else
                                    {
                                        this.posDevice.addEmpty()
                                        this.posDevice.dt()[0].CODE = this.posObj.dt()[this.posObj.dt().length - 1].DEVICE
                                        this.posDevice.dt()[0].NAME = this.posObj.dt()[this.posObj.dt().length - 1].DEVICE
                                        this.posDevice.dt()[0].LCD_PORT = this.txtPopSettingsLcd.value
                                        this.posDevice.dt()[0].SCALE_PORT = this.txtPopSettingsScale.value
                                        this.posDevice.dt()[0].PAY_CARD_PORT = this.txtPopSettingsPayCard.value
                                        this.posDevice.dt()[0].PRINT_DESING = this.txtPopSettingsPrint.value
                                        this.posDevice.dt()[0].SCANNER_PORT = this.txtPopSettingsScanner.value
                                        this.posDevice.dt()[0].PRINTER_PORT = this.txtPopSettingsPrinter.value
                                    }                                
                                    await this.posDevice.save()
                                    this.popSettings.hide()
                                }}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Grid List Popup */}
                <div>
                    <NdPopUp parent={this} id={"popGridList"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popGridList.title")}
                    container={"#root"} 
                    width={"1000"}
                    height={"650"}
                    position={{of:"#root"}}
                    >
                        {/* grdPopGridList */}
                        <div className="row">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdPopGrdList"} 
                                showBorders={true} 
                                columnsAutoWidth={false} 
                                allowColumnResizing={true} 
                                allowColumnReordering={false}
                                height={"100%"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}
                                loadPanel={{enabled:false}}
                                sorting={{ mode: 'none' }}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "15px";                                        
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"                                    
                                    if(e.rowType == 'data' && e.column.dataField == 'AMOUNT')
                                    {
                                        e.cellElement.style.fontWeight = "bold";
                                    }
                                }}
                                onCellClick={async (e)=>
                                {
                                    if(e.column.dataField == "QUANTITY")
                                    {
                                        if(this.prmObj.filter({ID:'QuantityEdit',TYPE:0}).getValue() == true)
                                        {                                            
                                            let tmpResult = await this.popNumber.show(this.lang.t("quantity"),Number(e.value) / Number(e.key.UNIT_FACTOR))
                                                                                        
                                            if(typeof tmpResult != 'undefined' && tmpResult != '')
                                            {
                                                if(this.prmObj.filter({ID:'QuantityCheckZero',TYPE:0}).getValue() == true && tmpResult == 0)
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgZeroValidation',showTitle:true,title:this.lang.t("msgZeroValidation.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgZeroValidation.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgZeroValidation.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                    return
                                                }
                                                
                                                if(tmpResult >= 1000)
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgMaxQuantity',
                                                        showTitle:true,
                                                        title:this.lang.t("msgMaxQuantity.title"),
                                                        showCloseButton:true,
                                                        width:'500px',
                                                        height:'200px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgMaxQuantity.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMaxQuantity.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                    return
                                                }

                                                let tmpData = {QUANTITY:Number(tmpResult) * Number(e.key.UNIT_FACTOR),PRICE:e.key.PRICE}
                                                this.saleRowUpdate(e.key,tmpData)
                                            }
                                        }
                                    }
                                    if(e.column.dataField == "PRICE")
                                    {
                                        if(this.prmObj.filter({ID:'PriceEdit',TYPE:0}).getValue() == true)
                                        {
                                            this.popPriceDesc.show()
                                        }
                                    }
                                }}
                                >
                                    <Editing confirmDelete={false}/>
                                    <Scrolling mode="infinite" />
                                    <Column dataField="LDATE" caption={this.lang.t("grdList.LDATE")} width={40} alignment={"center"} dataType={"datetime"} format={"dd-MM-yyyy - HH:mm:ss SSSZ"} defaultSortOrder="desc" visible={false}/>
                                    <Column dataField="NO" caption={""} width={30} cellTemplate={(cellElement,cellInfo)=>
                                    {
                                        cellElement.innerText = this.posObj.posSale.dt().length - cellInfo.rowIndex
                                    }}
                                    alignment={"center"}/>                                    
                                    <Column dataField="ITEM_SNAME" caption={this.lang.t("grdList.ITEM_NAME")} width={390}/>
                                    <Column dataField="QUANTITY" caption={this.lang.t("grdList.QUANTITY")} cellRender={(e)=>{return (e.data.SCALE_MANUEL == true ? "M-" : "") + (this.isUnitDecimal(e.data.UNIT_SHORT) ? Number(e.value / e.data.UNIT_FACTOR).toFixed(3) : Number(e.value / e.data.UNIT_FACTOR).toFixed(0)) + e.data.UNIT_SHORT}} width={100}/>
                                    <Column dataField="DISCPRICE" caption={this.lang.t("grdList.DISCOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                    <Column dataField="PRICE" caption={this.lang.t("grdList.PRICE")} cellRender={(e)=>{return Number(e.value * e.data.UNIT_FACTOR).round(2) + Number.money.sign + '/' + e.data.UNIT_SHORT}} width={70} format={"#,##0.00" + Number.money.sign}/>
                                    <Column dataField="TOTAL" alignment={"right"} caption={this.lang.t("grdList.AMOUNT")} width={60} format={"#,##0.00" + Number.money.sign}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Transfer Popup */}
                <div>
                    <NdPopUp parent={this} id={"popTransfer"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popTransfer.title")}
                    container={"#root"} 
                    width={"600"}
                    height={"300"}
                    position={{of:"#root"}}
                    >
                        {/* Button Group */}
                        <div className="row pb-2">
                            {/* btnPopTransferManuel */}
                            <div className="col-4">
                                <NbButton id={"btnPopTransferManuel"} parent={this} className="form-group btn btn-success btn-block" style={{height:"50px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.transferStop();
                                    this.transferStart(1)
                                }}>
                                    {this.lang.t("popTransfer.btnPopTransferManuel")}
                                </NbButton>
                            </div>
                            {/* btnPopTransferClear */}
                            <div className="col-4">
                                <NbButton id={"btnPopTransferClear"} parent={this} className="form-group btn btn-success btn-block" style={{height:"50px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.transferStop();
                                    this.transferStart(1,true)
                                }}>
                                    {this.lang.t("popTransfer.btnPopTransferClear")}
                                </NbButton>
                            </div>
                            {/* btnPopTransferStop */}
                            <div className="col-4">
                                <NbButton id={"btnPopTransferStop"} parent={this} className="form-group btn btn-success btn-block" style={{height:"50px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.transferStop();
                                }}>
                                    {this.lang.t("popTransfer.btnPopTransferStop")}
                                </NbButton>
                            </div>
                        </div>
                        {/* msg1 */}
                        <div className="row">
                            <div className="col-12">
                                <h3 className="text-center"><NbLabel id="msgTransfer1" parent={this} value={""}/></h3>
                            </div>
                        </div>
                        {/* msg1 */}
                        <div className="row">
                            <div className="col-12">
                                <h3 className="text-center"><NbLabel id="msgTransfer2" parent={this} value={""}/></h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <h3 className="text-center"><NbLabel id="transProgress" parent={this} value={""}/></h3>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* RePrint Description Popup */} 
                <div>
                    <NbPopDescboard id={"popRePrintDesc"} parent={this} width={"900"} height={"700"} position={"#root"} head={this.lang.t("popRePrintDesc.head")} title={this.lang.t("popRePrintDesc.title")}                    
                    param={this.prmObj.filter({ID:'RePrintDescription',TYPE:0})}
                    ></NbPopDescboard>
                </div>
                {/* Customer Add Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCustomerAdd"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popCustomerAdd.title")}
                    container={"#root"} 
                    width={"100%"} height={"100%"}
                    position={{of:"#root"}}
                    >
                        <div className="row pb-1">
                            <div className="col-12">
                                <Form colCount={2} height={'fit-content'} id={"frmCustomerAdd"}>
                                     {/* cmbType */}
                                    <Item>
                                        <Label text={this.lang.t("cmbType")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbType" height='fit-content' dt={{data:this.customerObj.dt('CUSTOMERS'),field:"TYPE"}}
                                        displayExpr="VALUE"                       
                                        valueExpr="ID"
                                        data={{source:[{ID:0,VALUE:this.lang.t("cmbTypeData.individual")},{ID:1,VALUE:this.lang.t("cmbTypeData.company")},{ID:2,VALUE:this.lang.t("cmbTypeData.association")}]}}
                                        
                                        />
                                    </Item>       
                                    <EmptyItem/>
                                    {/* txtPopCustomerCode */}
                                    <Item>
                                        
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerCode")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerCode"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        dt={{data:this.customerObj.dt('CUSTOMERS'),field:"CODE"}}
                                        button={
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.popCustomerAddList.show()
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                    this.txtPopCustomerCode.value = Math.floor(Date.now() / 1000)
                                                }
                                            }
                                        ]}
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopCustomerCode"
                                            this.keyPopCustomerAdd.setInput(this.txtPopCustomerCode.value)
                                        }}
                                        onChange={async(e)=>
                                        {                         
                                            this.customerObj.clearAll()
                                            await this.customerObj.load({CODE:this.txtPopCustomerCode.value});
                                        }}>
                                            <Validator validationGroup={"frmCustomerAdd"}>
                                                <RequiredRule message={this.lang.t("popCustomerAdd.validTxtPopCustomerCode")}/>
                                            </Validator>
                                        </NdTextBox>
                                    </Item>
                                    {/* txtPopCustomerFirmName */}
                                    <Item>
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerFirmName")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerFirmName"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopCustomerFirmName"
                                            this.keyPopCustomerAdd.setInput(this.txtPopCustomerFirmName.value)
                                        }}/>
                                    </Item>
                                    {/* txtPopCustomerName */}
                                    <Item>
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerName")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerName"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"NAME"}}
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopCustomerName"
                                            this.keyPopCustomerAdd.setInput(this.txtPopCustomerName.value)
                                        }}/>
                                    </Item>
                                    {/* txtPopCustomerSurname */}
                                    <Item>
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerSurname")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerSurname"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"LAST_NAME"}}
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopCustomerSurname"
                                            this.keyPopCustomerAdd.setInput(this.txtPopCustomerSurname.value)
                                        }}>
                                            <Validator validationGroup={"frmCustomerAdd"}>
                                                <RequiredRule message={this.lang.t("popCustomerAdd.validTxtPopCustomerCode")}/>
                                            </Validator>
                                        </NdTextBox>
                                    </Item>
                                    {/* txtPopCustomerAddress */}
                                    <Item>
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerAddress")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerAddress"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        dt={{data:this.customerObj.dt('CUSTOMER_ADRESS'),field:"ADRESS"}}
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopCustomerAddress"
                                            this.keyPopCustomerAdd.setInput(this.txtPopCustomerAddress.value)
                                        }}>
                                            <Validator validationGroup={"frmCustomerAdd"}>
                                                <RequiredRule message={this.lang.t("popCustomerAdd.validTxtPopCustomerCode")}/>
                                            </Validator>
                                        </NdTextBox>
                                    </Item>
                                    {/* txtPopCustomerCountry */}
                                    <Item>
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerCountry")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerCountry"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        dt={{data:this.customerObj.dt('CUSTOMER_ADRESS'),field:"COUNTRY"}}
                                        button={
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.popCustomerAddCountry.show()
                                                }
                                            }
                                        ]}
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopSettingsLcd"
                                            this.keyPopCustomerAdd.setInput(this.txtPopSettingsLcd.value)
                                        }}>
                                            <Validator validationGroup={"frmCustomerAdd"}>
                                                <RequiredRule message={this.lang.t("popCustomerAdd.validTxtPopCustomerCode")}/>
                                            </Validator>
                                        </NdTextBox>
                                    </Item>
                                    {/* txtPopCustomerCity */}            
                                    <Item>
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerCity")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerCity"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        dt={{data:this.customerObj.dt('CUSTOMER_ADRESS'),field:"CITY"}}
                                        button={
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.popCustomerAddCity.show()
                                                }
                                            }
                                        ]}
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopCustomerCity"
                                            this.keyPopCustomerAdd.setInput(this.txtPopCustomerCity.value)
                                        }}>
                                            <Validator validationGroup={"frmCustomerAdd"}>
                                                <RequiredRule message={this.lang.t("popCustomerAdd.validTxtPopCustomerCode")}/>
                                            </Validator>
                                        </NdTextBox>
                                    </Item>
                                    {/* txtPopCustomerZipCode */}
                                    <Item>
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerZipCode")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerZipCode"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        dt={{data:this.customerObj.dt('CUSTOMER_ADRESS'),field:"ZIPCODE"}}
                                        button={
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.popCustomerAddZipCode.show()
                                                }
                                            }
                                        ]}
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopCustomerZipCode"
                                            this.keyPopCustomerAdd.setInput(this.txtPopCustomerZipCode.value)
                                        }}>
                                            <Validator validationGroup={"frmCustomerAdd"}>
                                                <RequiredRule message={this.lang.t("popCustomerAdd.validTxtPopCustomerCode")}/>
                                            </Validator>
                                        </NdTextBox>
                                    </Item>
                                    {/* <Item>
                                        <Label text={"Doğum Tarihi"} alignment="right" />
                                        <NdDatePicker simple={true}  parent={this} id={"dtPopCustomerBirth"}/>
                                    </Item> */}
                                    {/* txtPopCustomerEmail */}
                                    <Item>
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerEmail")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerEmail"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"EMAIL"}}
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopCustomerEmail"
                                            this.keyPopCustomerAdd.setInput(this.txtPopCustomerEmail.value)
                                        }}/>
                                    </Item>
                                    {/* txtPopCustomerTel */}
                                    <Item>
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerTel")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerTel"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"PHONE1"}}
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopCustomerTel"
                                            this.keyPopCustomerAdd.setInput(this.txtPopCustomerTel.value)
                                        }}/>
                                    </Item>
                                    {/* txtPopCustomerTel */}
                                    <Item>
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerTva")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerTva"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        dt={{data:this.customerObj.dt('CUSTOMERS'),field:"TAX_NO"}}
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopCustomerTva"
                                            this.keyPopCustomerAdd.setInput(this.txtPopCustomerTva.value)
                                        }}/>
                                    </Item>
                                    {/* txtPopCustomerTel */}
                                    <Item>
                                        <Label text={this.lang.t("popCustomerAdd.txtPopCustomerSiret")} alignment="right" />
                                        <NdTextBox id={"txtPopCustomerSiret"} parent={this} simple={true} valueChangeEvent="keyup" 
                                        dt={{data:this.customerObj.dt('CUSTOMERS'),field:"SIRET"}}
                                        onFocusIn={()=>
                                        {                                    
                                            this.keyPopCustomerAdd.inputName = "txtPopCustomerSiret"
                                            this.keyPopCustomerAdd.setInput(this.txtPopCustomerSiret.value)
                                        }}/>
                                    </Item>
                                </Form>
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col-12">                            
                                <NdButton id={"btnCustomerAddSave"} parent={this} icon={"floppy"} validationGroup={"frmCustomerAdd"} type="success" stylingMode="contained" width={"100%"} height={"50px"}
                                onClick={async (e)=>
                                {
                                    if(e.validationGroup.validate().status == "valid")
                                    {
                                        if(this.cmbType.value == 1 && (this.txtPopCustomerTva.value == '' || this.txtPopCustomerSiret.value == ''))
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgFirmSaveValid',showTitle:true,title:this.lang.t("popCustomerAdd.msgFirmSaveValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("popCustomerAdd.msgFirmSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("popCustomerAdd.msgFirmSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        this.customerObj.customerAdress.dt()[0].CUSTOMER = this.customerObj.dt()[0].GUID
                                        this.customerObj.customerOffical.dt()[0].CUSTOMER = this.customerObj.dt()[0].GUID
                                        if(this.txtPopCustomerFirmName.value != '')
                                        {
                                            this.customerObj.dt()[0].TYPE = 1
                                            this.customerObj.dt()[0].TITLE = this.txtPopCustomerFirmName.value
                                        }
    
                                        let tmpConfObj1 =
                                        {
                                            id:'msgCustomerSaveResult',showTitle:true,title:this.lang.t("popCustomerAdd.msgCustomerSaveResult.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("popCustomerAdd.msgCustomerSaveResult.btn01"),location:'after'}],
                                        }
                                        if((await this.customerObj.save()) == 0)
                                        {                                  
                                            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.lang.t("popCustomerAdd.msgCustomerSaveResult.msgSuccess")}</div>)
                                            await dialog(tmpConfObj1);
                                        }
                                        else
                                        {
                                            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.lang.t("popCustomerAdd.msgCustomerSaveResult.msgFailed")}</div>)
                                            await dialog(tmpConfObj1);
                                        }
                                    }
                                    else
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgCustomerSaveValid',showTitle:true,title:this.lang.t("popCustomerAdd.msgCustomerSaveValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("popCustomerAdd.msgCustomerSaveValid.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("popCustomerAdd.msgCustomerSaveValid.msg")}</div>)
                                        }
                                        
                                        await dialog(tmpConfObj);
                                    }
                                }}>
                                </NdButton>
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col-12">
                                <NbKeyboard id={"keyPopCustomerAdd"} parent={this} inputName={"txtPopCustomerCode"} keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}/>
                            </div>
                        </div>                        
                    </NdPopUp>
                </div>
                {/* Customer Add List Popup */}
                <div>
                    <NbPosPopGrid id={"popCustomerAddList"} parent={this} width={"100%"} height={"100%"} position={"#root"} title={this.lang.t("popCustomerAddList.title")}
                    keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}
                    data={{source:
                    {
                        select:
                        {
                            query : "SELECT CODE,TITLE,ADRESS FROM [dbo].[CUSTOMER_VW_02] WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
                            param : ['VAL:string|50']
                        },
                        sql:this.core.sql
                    }}}
                    onSelection={async(pData)=>
                    {
                        if(pData.length > 0)
                        {
                            this.customerObj.clearAll()
                            await this.customerObj.load({CODE:pData[0].CODE});
                            if(this.customerObj.dt().length > 0 && this.customerObj.dt()[0].TYPE == 1)
                            {
                                this.txtPopCustomerFirmName.value = this.customerObj.dt()[0].TITLE
                            }
                        }
                    }}>
                        <Column dataField="CODE" caption={"CODE"} width={100} />
                        <Column dataField="TITLE" caption={"NAME"} width={250} />
                        <Column dataField="ADRESS" caption={"ADRESS"} width={350}/>
                    </NbPosPopGrid>
                </div>
                {/* Customer Add Country Popup */}
                <div>
                    <NbPosPopGrid id={"popCustomerAddCountry"} parent={this} width={"100%"} height={"100%"} position={"#root"} title={this.lang.t("popCustomerAddCountry.title")}
                    keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}
                    data={{source:
                    {
                        select:
                        {
                            query : "SELECT CODE,NAME FROM COUNTRY WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                            param : ['VAL:string|50'],
                        },
                        sql:this.core.sql
                    }}}
                    onSelection={async(pData)=>
                    {
                        if(pData.length > 0)
                        {
                            this.txtPopCustomerCountry.value = pData[0].CODE
                        }
                    }}>
                        <Column dataField="CODE" caption={"CODE"} width={100} />
                        <Column dataField="NAME" caption={"NAME"} width={250} />
                    </NbPosPopGrid>
                </div>
                {/* Customer Add City Popup */}
                <div>
                    <NbPosPopGrid id={"popCustomerAddCity"} parent={this} width={"100%"} height={"100%"} position={"#root"} title={this.lang.t("popCustomerAddCity.title")}
                    keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}
                    data={{source:
                    {
                        select:
                        {
                            query : "SELECT ZIPCODE,PLACE FROM ZIPCODE WHERE UPPER(PLACE) LIKE UPPER(@VAL) OR UPPER(ZIPCODE) LIKE UPPER(@VAL)",
                            param : ['VAL:string|50'],
                        },
                        sql:this.core.sql
                    }}}
                    onSelection={async(pData)=>
                    {
                        if(pData.length > 0)
                        {
                            this.txtPopCustomerCity.value = pData[0].PLACE
                        }
                    }}>
                        <Column dataField="ZIPCODE" caption={"ZIPCODE"} width={200} />
                        <Column dataField="PLACE" caption={"PLACE"} width={250} />
                    </NbPosPopGrid>
                </div>
                {/* Customer Add Zipcode Popup */}
                <div>
                    <NbPosPopGrid id={"popCustomerAddZipCode"} parent={this} width={"100%"} height={"100%"} position={"#root"} title={this.lang.t("popCustomerAddZipCode.title")}
                    keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}
                    data={{source:
                    {
                        select:
                        {
                            query : "SELECT PLACE,ZIPCODE FROM ZIPCODE WHERE UPPER(ZIPCODE) LIKE UPPER(@VAL) OR UPPER(PLACE) LIKE UPPER(@VAL)",
                            param : ['VAL:string|50'],
                        },
                        sql:this.core.sql
                    }}}
                    onSelection={async(pData)=>
                    {
                        if(pData.length > 0)
                        {
                            this.txtPopCustomerZipCode.value = pData[0].ZIPCODE
                        }
                    }}>
                        <Column dataField="PLACE" caption={"PLACE"} width={200} />
                        <Column dataField="ZIPCODE" caption={"ZIPCODE"} width={200} />                        
                    </NbPosPopGrid>
                </div>
                {/* Print Customer List Popup */}
                <div>
                    <NbPosPopGrid id={"popPrintCustomerList"} parent={this} width={"100%"} height={"100%"} position={"#root"} title={this.lang.t("popCustomerAddList.title")}
                    keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}
                    data={{source:
                    {
                        select:
                        {
                            query : "SELECT GUID,CODE,TITLE,ADRESS FROM [dbo].[CUSTOMER_VW_02] WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
                            param : ['VAL:string|50']
                        },
                        sql:this.core.sql
                    }}}
                    onSelection={async(pData)=>
                    {
                        if(pData.length > 0)
                        {
                            let tmpQuery = 
                            {
                                query : "EXEC [dbo].[PRD_POS_UPDATE] @GUID = @PGUID,@CUSER = @PCUSER,@CUSTOMER = @PCUSTOMER",
                                param : ['PGUID:string|50','PCUSER:string|25','PCUSTOMER:string|50'],
                                value : [this.popPrintCustomerList.POS_GUID,this.core.auth.data.CODE,pData[0].GUID]
                            }
                            await this.core.sql.execute(tmpQuery)
                            await this.lastPosDt.refresh()
                            await this.grdLastPos.dataRefresh({source:this.lastPosDt});   
                        }
                    }}>
                        <Column dataField="CODE" caption={"CODE"} width={100} />
                        <Column dataField="TITLE" caption={"NAME"} width={250} />
                        <Column dataField="ADRESS" caption={"ADRESS"} width={350}/>
                    </NbPosPopGrid>
                </div>
                {/* About PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popAbout"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    container={"#root"} 
                    width={'300'}
                    height={'250'}
                    title={this.lang.t("about")}
                    position={{my:'bottom',of:'#root'}}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <NbLabel id="abtCertificate" parent={this} value={this.lang.t("abtCertificate")} textSize={"28px"}/>
                            </Item>
                            <Item>
                                <NbLabel id="abtNrCertificate" parent={this} value={this.lang.t("abtNrCertificate")}/>
                            </Item>
                            <Item>
                                <NbLabel id="abtLicence" parent={this} value={this.lang.t("abtLicence")}/>
                            </Item>
                            <Item>
                                <NbLabel id="abtVersion" parent={this} value={this.lang.t("abtVersion") + this.core.appInfo.version}/>
                            </Item>
                            <Item>
                                <NdButton id={"btnAbtPrint"} parent={this} icon={"print"} stylingMode="contained" width={"100%"} height={"40px"}
                                onClick={async (e)=>
                                {
                                    let tmpArr = 
                                    [
                                        {align:"ct",logo:"./resources/logop.png"},
                                        {font:"a",style:"b",size : [1,1],align:"ct",data:""},
                                        {font:"a",style:"b",align:"ct",data: this.firm[0].ADDRESS1},
                                        {font:"a",style:"b",align:"ct",data: this.firm[0].ZIPCODE + " " + this.firm[0].CITY + " " + this.firm[0].COUNTRY_NAME},
                                        {font:"a",style:"b",align:"ct",data: "Tel : " + this.firm[0].TEL},
                                        {font:"a",style:"b",align:"ct",data: this.firm[0].MAIL},
                                        {font:"a",style:"b",align:"ct",data: this.firm[0].WEB},
                                        {font:"a",style:"b",align:"ct",data: "Siret " + this.firm[0].SIRET_ID + " - APE " + this.firm[0].APE_CODE},
                                        {font:"a",style:"b",align:"ct",data: "Nr. TVA " + this.firm[0].INT_VAT_NO},
                                        {font:"a",style:"b",size : [1,1],align:"ct",data:""},
                                        {font:"a",style:"b",size : [1,1],align:"ct",data: "INFO"},
                                        {font:"a",style:"b",size : [1,1],align:"ct",data:""},
                                        {font:"a",align:"lt",data:moment(new Date().toISOString()).format('dddd DD.MM.YYYY HH:mm:ss')},
                                        {font:"a",align:"lt",pdf:{fontSize:11},data:("Caissier: " + this.user.CODE).space(25,'e') + ("Caisse: " + window.localStorage.getItem('device')).space(23,'s')},
                                        {font:"a",style:"b",align:"lt",data:" ".space(48)},
                                        {font:"a",align:"lt",data:this.lang.t("abtCertificate")},
                                        {font:"a",align:"lt",data:this.lang.t("abtNrCertificate")},
                                        {font:"a",align:"lt",data:this.lang.t("abtLicence")},
                                        {font:"a",align:"lt",data:this.lang.t("abtVersion")},
                                    ]
                                    
                                    await this.posDevice.escPrinter(tmpArr)
                                }}>
                                </NdButton>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div>
                {/* Balance About PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popBalanceAbout"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    container={"#root"} 
                    width={'600'}
                    height={'260'}
                    title={"Balance " + this.lang.t("about")}
                    position={{my:'bottom',of:'#root'}}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <NbLabel id="blnAbtCompany" parent={this} value={this.lang.t("blnAbtCompany")} textSize={"28px"}/>
                            </Item>
                            <Item>
                                <NbLabel id="abtPiqsoft" parent={this} value={this.lang.t("abtPiqsoft")}/>
                            </Item>
                            <Item>
                                <NbLabel id="blnAbtType" parent={this} value={this.lang.t("blnAbtType")}/>
                            </Item>
                            <Item>
                                <NbLabel id="blnAbtSw" parent={this} value={this.lang.t("blnAbtSw") + " V." + this.core.appInfo.scale.version}/>
                            </Item>
                            <Item>
                                <NbLabel id="blnAbtCertificate" parent={this} value={this.lang.t("blnAbtCertificate") + this.core.appInfo.scale.certificate}/>
                            </Item>
                            <Item>
                                <NbLabel id="blnAbtSha" parent={this} value={"Signature : " + this.core.appInfo.scale.sha}/>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div>
                {/* Add mail PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popAddMail"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    container={"#root"} 
                    width={'800'}
                    height={'750'}
                    title={this.lang.t("msgAddCustomerMail.title")}
                    position={{of:"#root"}}
                    >
                         <div className="row pt-1">
                            <div className="col-6">
                                <NdTextBox id="txtNewCustomerName" parent={this} simple={true} placeholder={this.lang.t("txtNewCustomerName")} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}
                                 onFocusIn={()=>
                                    {                                    
                                        this.keybordNewMail.inputName = "txtNewCustomerName"
                                        this.keybordNewMail.setInput(this.txtNewCustomerName.value)
                                    }}>     
                                </NdTextBox> 
                            </div>
                            <div className="col-6">
                                <NdTextBox id="txtNewCustomerLastName" parent={this} simple={true} placeholder={this.lang.t("txtNewCustomerLastName")} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}
                                 onFocusIn={()=>
                                    {                                    
                                        this.keybordNewMail.inputName = "txtNewCustomerLastName"
                                        this.keybordNewMail.setInput(this.txtNewCustomerLastName.value)
                                    }}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtNewPhone" parent={this} simple={true} placeholder={this.lang.t("txtNewPhone")} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}
                                 onFocusIn={()=>
                                    {                                    
                                        this.keybordNewMail.inputName = "txtNewPhone"
                                        this.keybordNewMail.setInput(this.txtNewPhone.value)
                                    }}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                         <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtNewMail" parent={this} simple={true} placeholder={this.lang.t("txtNewMail")} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}
                                  onFocusIn={()=>
                                    {                                    
                                        this.keybordNewMail.inputName = "txtNewMail"
                                        this.keybordNewMail.setInput(this.txtNewMail.value)
                                    }}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        <div className="row py-1">
                            <div className="col-12">
                                <NbKeyboard id={"keybordNewMail"} layoutName={"mail"} parent={this} focusClear={true} keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}/>
                            </div>
                        </div>     
                        <div className="row py-1">
                            <div className="col-6">
                                <div className="col-12 px-1">
                                    <NbButton id={"btnMailSave"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        let tmpQuery = 
                                        {
                                            query: "UPDATE CUSTOMER_OFFICAL SET LDATE = GETDATE(),LUSER = @LUSER,EMAIL = @EMAIL,NAME = @NAME,LAST_NAME = @LAST_NAME,PHONE1 = @PHONE1 WHERE CUSTOMER = @CUSTOMER AND TYPE = 0",
                                            param: ['LUSER:string|100','EMAIL:string|100','NAME:string|50','LAST_NAME:string|50','PHONE1:string|50','CUSTOMER:string|50'],
                                            value: [this.core.auth.data.CODE,this.txtNewMail.value,this.txtNewCustomerName.value,this.txtNewCustomerLastName.value,this.txtNewPhone.value,this.posObj.dt()[0].CUSTOMER_GUID]
                                        };
                                        await this.core.sql.execute(tmpQuery);
                                        this.posObj.dt()[0].CUSTOMER_MAIL = this.txtNewMail.value
                                        this.txtNewMail.value = ''
                                        this.popAddMail.hide()
                                    }}>
                                        <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>   
                            </div>
                            <div className="col-6">
                                <div className="col-12 px-1">
                                    <NbButton id={"btnMailReject"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"70px",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        this.popAddMail.hide()
                                    }}>
                                        <i className="text-white fa-solid fa-close" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>   
                            </div>
                        </div>     
                    </NdPopUp>
                </div>
                {/* Mail PopUp */}
                <div>
                    <NdDialog parent={this} id={"mailPopup"} 
                    visible={false}                        
                    showTitle={true}
                    title={this.lang.t("mailPopup.title")}
                    container={"#root"} 
                    width={"800"}
                    height={"600"}
                    showCloseButton={false}
                    position={{of:"#root"}}
                    >
                        {/* txtMail */}
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtMail" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        <div className="row py-1">
                            <div className="col-12">
                                <NbKeyboard id={"keybordMail"} layoutName={"mail"} parent={this} inputName={"txtMail"} keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}/>
                            </div>
                        </div>     
                        <div className="row py-1">
                            <div className="col-6">
                                <div className="col-12 px-1">
                                    <NbButton id={"btnMailSend"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        await this.print(this.mailPopup.tmpData,1)
                                    }}>
                                        <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>   
                            </div>
                            <div className="col-6">
                                <div className="col-12 px-1">
                                    <NbButton id={"btnMailReject"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"70px",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        this.mailPopup._onClick()
                                    }}>
                                        <i className="text-white fa-solid fa-close" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>   
                            </div>
                        </div>     
                    </NdDialog>
                </div>
                {/* Balance Counter Description Popup */} 
                <div>
                    <NbPopDescboard id={"popBalanceCounterDesc"} parent={this} width={"900"} height={"700"} position={"#root"} head={this.lang.t("popBalanceCounterDesc.head")} title={this.lang.t("popBalanceCounterDesc.title")}         
                    button={[{id:"btn02",caption:this.lang.t("popBalanceCounterDesc.btn02"),location:'after'}]}
                    param={this.prmObj.filter({ID:'popBalanceCounterDesc',TYPE:0})}
                    >
                    </NbPopDescboard>
                </div>
                {/* Şifre Değişikliği */}
                <div>
                    <NdPopUp parent={this} id={"popPasswordChange"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popPasswordChange.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'560'}
                    position={{of:'#root'}}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <Label text={this.lang.t("popPasswordChange.NewPassword")} alignment="right" />
                                <NdTextBox id="txtNewPassword" mode="password" parent={this} simple={true}
                                 onFocusIn={()=>
                                {                                    
                                    this.keyPassChange.inputName = "txtNewPassword"
                                    this.keyPassChange.setInput(this.txtNewPassword.value)
                                }}>

                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popPasswordChange.NewPassword2")} alignment="right" />
                                <NdTextBox id="txtNewPassword2" mode="password" parent={this} simple={true}
                                onFocusIn={()=>
                                {                                    
                                    this.keyPassChange.inputName = "txtNewPassword2"
                                    this.keyPassChange.setInput(this.txtNewPassword2.value)
                                }}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <div className="row py-1">
                                    <div className="col-12">
                                        <NbKeyboard id={"keyPassChange"} parent={this} inputName={"txtNewPassword"} layoutName={"numbers"} keyType={this.prmObj.filter({ID:'KeyType',TYPE:0}).getValue()}/>
                                    </div>
                                </div>
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("popPasswordChange.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {       
                                            if(this.txtNewPassword.value == this.txtNewPassword2.value)
                                            {
                                                let tmpQuery = 
                                                {
                                                    query :"UPDATE USERS SET PWD = @PWD WHERE CODE = @CODE " ,
                                                    param : ['CODE:string|50','PWD:string|max'],
                                                    value : [this.core.auth.data.CODE,btoa(this.txtNewPassword.value)]
                                                }
                                                await this.core.sql.execute(tmpQuery) 
                                                let tmpConfObj =
                                                {
                                                    id:'msgPassChange',showTitle:true,title:this.lang.t("msgPassChange.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("msgPassChange.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPassChange.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.popPasswordChange.hide();  
                                            }
                                            else
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgPasswordWrong',showTitle:true,title:this.lang.t("msgPasswordWrong.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("msgPasswordWrong.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPasswordWrong.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.popPasswordChange.hide();  
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div> 
                {/* Last Sale List PopUp */} 
                <div>
                    <NdPopUp id="rebateTicketPopup" parent={this} title={this.lang.t("rebateTicketPopup.title")} width={"100%"} height={"100%"}
                    showCloseButton={true}
                    showTitle={true}
                    >
                        {/* Tool Button Group */} 
                        <div className="row pb-1">
                            <div className="offset-8 col-4">
                                <div className="row px-2">
                                    {/* btnLastSaleRebate */}
                                    <div className="col-12 p-1">
                                    <NbButton id={"btnLastSaleRebate"} title={'Seç'} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}
                                        onClick={async()=>
                                        {
                                            this.ticketCheck(this.grdRebatePos.devGrid.getSelectedRowKeys()[0].REF_NO)
                                            this.rebateTicketPopup.hide();
                                        }}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Filter */}
                        <div className="row py-1">
                            {/* dtpopRebateTicletStartDate */} 
                            <div className="col-2">
                                <NdDatePicker simple={true} parent={this} id={"dtpopRebateTicletStartDate"}/>
                            </div>
                            {/* dtpopRebateTicletFinishDate */} 
                            <div className="col-2">
                                <NdDatePicker simple={true} parent={this} id={"dtpopRebateTicletFinishDate"}/>
                            </div>
                            {/* cmbpopRebateTicletPayType */} 
                            <div className="col-2">
                                <NdSelectBox simple={true} parent={this} id="cmbpopRebateTicletPayType" displayExpr={'NAME'} valueExpr={'ID'} value={-1}
                                data={{source : 
                                [
                                    {ID:-1,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionAll")},
                                    {ID:0,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionEspece")},
                                    {ID:1,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionTPE")},
                                    {ID:2,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionCheque1")},
                                    {ID:3,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionCheque2")},
                                    {ID:4,NAME:this.lang.t("popLastSaleList.cmbPopLastSalePayType.optionAvoir")}
                                ]}}/>
                            </div>
                            {/* cmbpopRebateTicletUser */} 
                            <div className="col-2">
                                <NdSelectBox simple={true} parent={this} id="cmbpopRebateTicletUser" displayExpr={'NAME'} valueExpr={'CODE'}
                                data={{source:{select:{query : "SELECT '' AS CODE,'ALL' AS NAME UNION ALL SELECT CODE,NAME FROM USERS WHERE STATUS = 1",local:{type : "select",query:"SELECT '' AS CODE,'ALL' AS NAME UNION ALL SELECT CODE,NAME FROM USERS;"}},sql:this.core.sql}}}/>
                            </div>
                            {/* txtPopLastRef */} 
                            <div className="col-2">
                                <NdTextBox id="txtPopRebateRef" parent={this} simple={true} placeholder={this.lang.t("txtPopLastRefPholder")}
                                onKeyUp={(e)=>
                                {
                                    if(e.event.key == 'Enter')
                                    {
                                        this.btnpopRebateTicletSearch._onClick()
                                    }
                                }}>     
                                </NdTextBox> 
                            </div>
                            {/* btnpopRebateTicletSearch */} 
                            <div className="col-2">
                                <NbButton id={"btnpopRebateTicletSearch"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"36px",width:"100%"}}
                                onClick={async()=>
                                {
                                    if(this.txtPopRebateRefNo.value == "" && this.txtPopRebateRef.value == '')
                                    {
                                        this.rebatePosDt.selectCmd = 
                                        {
                                            query:  "SELECT *,CONVERT(NVARCHAR,LDATE,104) + '-' + CONVERT(NVARCHAR,LDATE,108) AS CONVERT_DATE, " +
                                                    "SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,36) AS REF_NO " + 
                                                    "FROM POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01 WHERE DOC_DATE >= @START_DATE AND DOC_DATE <= @FINISH_DATE AND " +
                                                    "((ISNULL((SELECT TOP 1 1 FROM POS_PAYMENT AS PAY WHERE PAY.POS = POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01.GUID AND TYPE = @TYPE AND DELETED = 0),0) = 1) OR (@TYPE = -1)) AND " + 
                                                    "((LUSER = @USER) OR (@USER = '')) AND STATUS = 1 AND ((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) ORDER BY LDATE DESC",
                                            param:  ["START_DATE:date","FINISH_DATE:date","TYPE:int","USER:string|25","CUSTOMER_CODE:string|50"],
                                            value:  [this.dtpopRebateTicletStartDate.value,this.dtpopRebateTicletFinishDate.value,this.cmbpopRebateTicletPayType.value,this.cmbpopRebateTicletUser.value,this.txtPopRebateCustomer.value]
                                        }
                                    }
                                    else
                                    {
                                        this.rebatePosDt.selectCmd = 
                                        {
                                            query:  "SELECT *,CONVERT(NVARCHAR,LDATE,104) + '-' + CONVERT(NVARCHAR,LDATE,108) AS CONVERT_DATE, " +
                                                    "SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,36) AS REF_NO " + 
                                                    "FROM POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01 WHERE (SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,36) = @REF OR REF = @REF_NO)  AND STATUS = 1",
                                            param:  ["REF:string|25","REF_NO:int"],
                                            value:  [this.txtPopRebateRef.value,this.txtPopRebateRefNo.value]
                                        }
                                    }
                                    
                                    await this.rebatePosDt.refresh()
                                    await this.grdRebatePos.dataRefresh({source:this.rebatePosDt});   
                                    this.txtPopLastRef.value = ""                                 
                                }}>
                                    <i className="text-white fa-solid fa-magnifying-glass" style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                        </div>
                        <div className="row pb-1">
                            {/* txtPopLastRefNo */} 
                            <div className="col-2">
                                <NdTextBox id="txtPopRebateRefNo" parent={this} simple={true} placeholder={this.lang.t("txtPopLastRefNoPholder")} 
                                />
                                
                            </div>
                            {/* txtPopLastCustomer */} 
                            <div className="col-2">
                                <NdTextBox id="txtPopRebateCustomer" parent={this} simple={true} placeholder={this.lang.t("txtPopLastCustomerPholder")}
                                 onChange={async(e)=>
                                {                         
                                   this.cmbpopRebateTicletUser.value = ''
                                   this.dtpopRebateTicletStartDate.value = '19700101'
                                }}>     
                                </NdTextBox> 
                            </div>
                        </div>
                        {/* grdLastPos */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdRebatePos"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                sorting={{ mode: 'single' }}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                onSelectionChanged={async(e)=>
                                {
                                    if(e.selectedRowKeys.length > 0)
                                    {
                                        this.rebatePosSaleDt.selectCmd = 
                                        {
                                            query:  "SELECT * FROM POS_SALE_VW_01 WHERE POS_GUID = @GUID ORDER BY LDATE DESC",
                                            param:  ["GUID:string|50"],
                                            value:  [e.selectedRowKeys[0].GUID]
                                        }
                                        
                                        await this.rebatePosSaleDt.refresh()
                                        await this.grdRebateSale.dataRefresh({source:this.rebatePosSaleDt});

                                        this.rebatePosPayDt.selectCmd = 
                                        {
                                            query:  "SELECT * FROM POS_PAYMENT_VW_01 WHERE POS_GUID = @GUID ORDER BY LDATE DESC",
                                            param:  ["GUID:string|50"],
                                            value:  [e.selectedRowKeys[0].GUID]
                                        }
                                    
                                        await this.rebatePosPayDt.refresh()
                                        await this.grdRebatePay.dataRefresh({source:this.rebatePosPayDt});                                   
                                    }
                                }}
                                >
                                    <Column dataField="CONVERT_DATE" caption={this.lang.t("grdLastPos.LDATE")} width={150} alignment={"center"}  />
                                    <Column dataField="DEVICE" caption={this.lang.t("grdLastPos.DEVICE")} width={60}/>
                                    <Column dataField="REF_NO" caption={this.lang.t("grdLastPos.REF")} width={150}/>
                                    <Column dataField="CUSTOMER_NAME" caption={this.lang.t("grdLastPos.CUSTOMER_NAME")} width={200}/> 
                                    <Column dataField="CUSER_NAME" caption={this.lang.t("grdLastPos.CUSER_NAME")} width={100}/>
                                    <Column dataField="DISCOUNT" caption={this.lang.t("grdLastPos.DISCOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/> 
                                    <Column dataField="LOYALTY" caption={this.lang.t("grdLastPos.LOYALTY")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                    <Column dataField="TOTAL" caption={this.lang.t("grdLastPos.AMOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/>                        
                                </NdGrid>
                            </div>
                        </div>
                        <div className="row py-1">
                            {/* grdRebateSale */}
                            <div className="col-7">
                                <NdGrid parent={this} id={"grdRebateSale"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                >
                                    <Column dataField="BARCODE" caption={this.lang.t("grdLastSale.BARCODE")} width={120}/>
                                    <Column dataField="ITEM_NAME" caption={this.lang.t("grdLastSale.ITEM_NAME")} width={200}/>    
                                    <Column dataField="QUANTITY" caption={this.lang.t("grdLastSale.QUANTITY")} width={50}/>
                                    <Column dataField="PRICE" caption={this.lang.t("grdLastSale.PRICE")} width={50} format={"#,##0.00" + Number.money.sign}/> 
                                    <Column dataField="AMOUNT" caption={this.lang.t("grdLastSale.AMOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                </NdGrid>
                            </div>
                            {/* grdRebatePay */}
                            <div className="col-5">
                                <NdGrid parent={this} id={"grdRebatePay"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}                          
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                >
                                    <Column dataField="PAY_TYPE_NAME" caption={this.lang.t("grdLastPay.PAY_TYPE_NAME")} width={150}/>
                                    <Column dataField="AMOUNT" caption={this.lang.t("grdLastPay.AMOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/>    
                                    <Column dataField="CHANGE" caption={this.lang.t("grdLastPay.CHANGE")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                </NdGrid>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Access Component */}
                <div>
                    <NdAccessEdit id={"accesComp"} parent={this} saveUser={true}/>
                </div> 
                {/* Price List Choice PopUp */}
                <div>
                    <NdPopGrid id={"priceListChoicePopUp"} parent={this} container={"#root"}
                    visible={false}
                    selection={{mode:'single'}}
                    filterRow={{visible:false}}
                    headerFilter={{visible:false}}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.lang.t("priceListChoicePopUp.title")} 
                    deferRendering={true}
                    >
                        <Column dataField="LIST_NO" caption={this.lang.t("priceListChoicePopUp.clmListNo")} width={150}/>
                        <Column dataField="ITEM_NAME" caption={this.lang.t("priceListChoicePopUp.clmItemName")} width={400}/>
                        <Column dataField="LIST_TAG" caption={this.lang.t("priceListChoicePopUp.clmTag")} width={200}/>
                        <Column dataField="PRICE" format={{ style: "currency", currency: Number.money.code,precision: 2}} caption={this.lang.t("priceListChoicePopUp.clmPrice")} width={100}/>
                    </NdPopGrid>
                </div>
            </div>
        )
    }
}