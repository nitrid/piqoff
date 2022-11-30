import React from "react";
import App from "../lib/app.js";
import moment from 'moment';

import Form, { Label,Item } from "devextreme-react/form";
import { ButtonGroup } from "devextreme-react/button-group";
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

import { posCls,posSaleCls,posPaymentCls,posPluCls,posDeviceCls,posPromoCls, posExtraCls } from "../../core/cls/pos.js";
import { docCls} from "../../core/cls/doc.js"
import transferCls from "../lib/transfer.js";
import { promoCls } from "../../core/cls/promotion.js";
import { nf525Cls } from "../lib/nf525.js";
import { customersCls } from "../../core/cls/customers.js";

import { dataset,datatable,param,access } from "../../core/core.js";
import {prm} from '../meta/prm.js'
import {acs} from '../meta/acs.js'

export default class posDoc extends React.PureComponent
{
    constructor()
    {
        super() 
        this.core = App.instance.core
        this.lang = App.instance.lang
        this.t = App.instance.lang.getFixedT(null,null,"pos")
        this.user = this.core.auth.data
        this.prmObj = new param(prm)
        this.acsObj = new access(acs);   
        this.nf525 = new nf525Cls();
        // NUMBER İÇİN PARAMETREDEN PARA SEMBOLÜ ATANIYOR.
        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()
        
        this.posObj = new posCls()
        this.posDevice = new posDeviceCls();
        this.parkDt = new datatable();
        this.cheqDt = new datatable();
        this.lastPosDt = new datatable();
        this.lastPosSaleDt = new datatable();
        this.lastPosPayDt = new datatable();
        this.lastPosPromoDt = new datatable();  
        this.firm = new datatable();
        this.customerObj = new customersCls();

        this.promoObj = new promoCls();
        this.posPromoObj = new posPromoCls();

        this.loading = React.createRef();
        this.loadingPay = React.createRef();

        this.state =
        {
            date:"00.00.0000",
            isPluEdit:false,
            isBtnGetCustomer:false,
            isBtnInfo:false,            
            payTotal:0,
            payChange:0,
            payRest:0,
            cheqCount:0,
            cheqTotalAmount:0,
            cheqLastAmount:0,
            isConnected:this.core.offline ? false : true,
            msgTransfer1:"",
            msgTransfer2:"",
            isFormation:false
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
                this.getItem(tmpBarkod)
            }
        })

        this.init();
        //DATA TRANSFER İŞLEMİ
        this.transfer = new transferCls();
        this.interval = null;
        this.transferStart();
        this.transferLocal();
        //DATA TRANSFER İÇİN EVENT.
        this.transfer.on('onState',(pParam)=>
        {
            if(pParam.tag == 'progress')
            {
                this.transProgress.value = pParam.index + " / " + pParam.count
            }
            else
            {
                this.setState({msgTransfer2:pParam.text + " " + this.lang.t("popTransfer.msg3")})
            }
        })
        //****************************** */

        this.core.socket.on('connect',async () => 
        {               
            if(!this.state.isConnected)
            {
                this.sendJet({CODE:"120",NAME:"Le système est online"}) ///Kasa offline dan online a döndü.

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

                await this.transferLocal();

                this.sendJet({CODE:"123",NAME:"Les saisies ont été enregistrés dans la base suite à online."}) ////Eldeki kayıtlar online a gönderildi.
                
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
            this.sendJet({CODE:"120",NAME:"Le système est offline."}) ///Kasa offline dan online a döndü.

            this.setState({isConnected:false})
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

            //OFFLINE MODA DÖNDÜĞÜNDE EĞER EKRANDA KAYITLAR VARSA LOCAL DB YE GÖNDERİLİYOR
            for (let i = 0; i < this.posObj.dt("POS").length; i++) 
            {
                let tmpCtrl = await this.core.local.select({from:"POS_VW_01",where:{GUID:this.posObj.dt("POS")[i].GUID}})
                if(tmpCtrl.result.length > 0)
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
                    let tmpCtrl = await this.core.local.select({from:"POS_SALE_VW_01",where:{GUID:this.posObj.dt("POS_SALE")[i].GUID}})
                
                    if(tmpCtrl.result.length > 0)
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
                let tmpCtrl = await this.core.local.select({from:"POS_PAYMENT_VW_01",where:{GUID:this.posObj.dt("POS_PAYMENT")[i].GUID}})
                if(tmpCtrl.result.length > 0)
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
                let tmpCtrl = await this.core.local.select({from:"POS_EXTRA_VW_01",where:{GUID:this.posObj.dt("POS_EXTRA")[i].GUID}})
                if(tmpCtrl.result.length > 0)
                {
                    Object.setPrototypeOf(this.posObj.dt("POS_EXTRA")[i],{stat:'edit'})
                }
                else
                {
                    Object.setPrototypeOf(this.posObj.dt("POS_EXTRA")[i],{stat:'new'})
                }
            }
            await this.posObj.save()
            setTimeout(()=>{window.location.reload()},500)
            //*************************************************************************** */
        })

        this.sendJet({CODE:"80",NAME:"Démarrage terminal lancé."}) ////Kasa işleme başladı.
    }
    async init()
    {
        setInterval(()=>
        {
            this.lblTime.value = moment(new Date(),"HH:mm:ss").format("HH:mm:ss")
            this.lblDate.value = new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' })
        },1000)

        this.posObj.clearAll()        

        await this.prmObj.load({APP:'POS'})
        await this.acsObj.load({APP:'POS'})

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
        this.posObj.dt()[this.posObj.dt().length - 1].DEVICE = this.state.isFormation ? '9999' : window.localStorage.getItem('device') == null ? '' : window.localStorage.getItem('device')
        this.device.value = this.posObj.dt()[this.posObj.dt().length - 1].DEVICE
        
        await this.posDevice.load({CODE:this.posObj.dt()[this.posObj.dt().length - 1].DEVICE})        
        this.posDevice.scanner();

        await this.grdList.dataRefresh({source:this.posObj.posSale.dt()});
        await this.grdPay.dataRefresh({source:this.posObj.posPay.dt()});
        await this.grdLastPos.dataRefresh({source:this.lastPosDt});

        //** FIRMA GETIR ******************************/
        this.firm.selectCmd = 
        {
            query : "SELECT TOP 1 * FROM COMPANY_VW_01",
            local : 
            {
                type : "select",
                from : "COMPANY_VW_01"
            }
        }
        await this.firm.refresh();
        
        if(this.firm.length > 0)
        {
            this.posObj.dt()[this.posObj.dt().length - 1].FIRM = this.firm[0].GUID
        }
        //********************************************* */
        this.cheqDt.selectCmd = 
        {
            query : "SELECT * FROM CHEQPAY_VW_01 WHERE DOC = @DOC ORDER BY CDATE DESC",
            param : ['DOC:string|50'], 
            value : [this.posObj.dt()[0].GUID],
            local : 
            {
                type : "select",
                from : "CHEQPAY_VW_01",
                where : {DOC:this.posObj.dt()[0].GUID}
            }
        }
        await this.cheqDt.refresh();         

        this.parkDt.selectCmd =
        {
            query : "SELECT GUID,LUSER_NAME,LDATE,TOTAL, " + 
                    "ISNULL((SELECT TOP 1 DESCRIPTION FROM POS_EXTRA WHERE POS_GUID = POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01.GUID AND TAG = 'PARK DESC'),'') AS DESCRIPTION " +
                    "FROM POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01 WHERE STATUS = 0 AND (LUSER = @LUSER OR (@LUSER = '')) ORDER BY LDATE DESC",
            param : ["LUSER:string|25"],
            value : [this.core.auth.data.CODE],
            local : 
            {
                type : "select",
                from : "POS_VW_01",
                where : {STATUS:0,LUSER:this.core.auth.data.CODE,DELETED:false},
                order: {by: "LDATE",type: "desc"}
            }
        }
        
        await this.parkDt.refresh();     
        
        setTimeout(() => 
        {
            this.posDevice.lcdPrint
            ({
                blink : 0,
                text :  "Bonjour".space(20) + moment(new Date()).format("DD.MM.YYYY").space(20)
            })    
        }, 1000);
        
        await this.calcGrandTotal(false) 
        
        this.core.util.logPath = "\\www\\log\\pos_" + this.posObj.dt()[this.posObj.dt().length - 1].DEVICE + ".txt"        

        if(this.posObj.dt()[this.posObj.dt().length - 1].DEVICE == '')
        {
            this.deviceEntry()
        }
        //PROMOSYON GETİR.
        await this.getPromoDb()
        //************************************************** */        
        for (let i = 0; i < this.parkDt.length; i++) 
        {            
            if(typeof this.parkDt[i].DESCRIPTION == 'undefined' || this.parkDt[i].DESCRIPTION == '')
            {                
                this.cheqDt.selectCmd.value = [this.parkDt[i].GUID] 
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
            this.posObj.dt()[0].DEVICE = this.state.isFormation ? '9999' : window.localStorage.getItem('device')
            this.posObj.dt()[0].DOC_DATE =  moment(new Date()).format("YYYY-MM-DD"),            
            //PROMOSYON GETİR.
            await this.getPromoDb()
            this.promoApply()
            //************************************************** */
            this.cheqDt.selectCmd.value = [pGuid] 
            await this.cheqDt.refresh(); 
            //checkRecord İŞLEMİ İÇİN YAPILDI
            for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
            {
                Object.setPrototypeOf(this.posObj.posSale.dt()[i],{stat:''})
            }
            await this.calcGrandTotal(false)
            resolve();
        });        
    }
    getItemDb(pCode)
    {
        return new Promise(async resolve => 
        {
            let tmpDt = new datatable(); 
            tmpDt.selectCmd = 
            {
                query : "SELECT TOP 1 *,@CODE AS INPUT FROM ITEMS_POS_VW_01 WHERE CODE = @CODE OR BARCODE = @CODE AND STATUS = 1",
                param : ['CODE:string|25'],
                value: [pCode],
                local : 
                {
                    type : "select",
                    from : "ITEMS_POS_VW_01",
                    where : 
                    {
                        CODE : pCode,
                        or :
                        {
                            BARCODE : pCode
                        },
                        STATUS : true
                    },
                    case: 
                    {
                        INPUT: 
                        [
                            {
                                '=': '',
                                then: pCode
                            }
                        ]
                    }
                }
            }
            await tmpDt.refresh();            
            //UNIQ BARKOD
            if(tmpDt.length == 0)
            {
                tmpDt.selectCmd = 
                {
                    query : "SELECT TOP 1 *,@CODE AS INPUT FROM ITEMS_POS_VW_01 WHERE UNIQ_CODE = @CODE AND STATUS = 1",
                    param : ['CODE:string|25'],
                    value: [pCode],
                    local : 
                    {
                        type : "select",
                        from : "ITEMS_POS_VW_01",
                        where : 
                        {
                            UNIQ_CODE : pCode,
                            STATUS : true
                        },
                        case: 
                        {
                            INPUT: 
                            [
                                {
                                    '=': '',
                                    then: pCode
                                }
                            ]
                        }
                    }
                }
                await tmpDt.refresh();
                console.log(tmpDt)
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
                            from : "ITEMS_POS_VW_01",
                            where : 
                            {
                                UNIQ_CODE : pCode.substring(pCode.lastIndexOf('F') + 1,pCode.length - 1),
                                STATUS : true
                            },
                            case: 
                            {
                                INPUT: 
                                [
                                    {
                                        '=': '',
                                        then: pCode.substring(pCode.lastIndexOf('F') + 1,pCode.length - 1)
                                    }
                                ]
                            }
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
        this.txtBarcode.value = ""; 
        let tmpQuantity = 1
        let tmpPrice = 0                
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
        
        //EĞER CARİ SEÇ BUTONUNA BASILDIYSA CARİ BARKODDAN SEÇİLECEK.
        if(this.state.isBtnGetCustomer)
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
                query : "SELECT GUID,CUSTOMER_TYPE,CODE,TITLE,ADRESS,ZIPCODE,CITY,COUNTRY_NAME,dbo.FN_CUSTOMER_TOTAL_POINT(GUID,GETDATE()) AS CUSTOMER_POINT, " +
                        "ISNULL((SELECT COUNT(TYPE) FROM CUSTOMER_POINT WHERE TYPE = 0 AND CUSTOMER = CUSTOMER_VW_02.GUID AND CONVERT(DATE,LDATE) = CONVERT(DATE,GETDATE())),0) AS POINT_COUNT " + 
                        "FROM [dbo].[CUSTOMER_VW_02] WHERE CODE LIKE SUBSTRING(@CODE,0,14) + '%'",
                param : ['CODE:string|50'],
                local : 
                {
                    type : "select",
                    from : "CUSTOMER_VW_02",
                    where : 
                    {
                        CODE : { like : pCode + '%'},
                    },
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

                //PROMOSYON GETİR.
                await this.getPromoDb()
                this.promoApply()
                //************************************************** */

                this.calcGrandTotal(true);
                this.setState({isBtnGetCustomer:false})                
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
                    button:[{id:"btn01",caption:"Tamam",location:'before'}],
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
                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
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
        tmpPrice = typeof tmpBarPattern.price == 'undefined' || tmpBarPattern.price == 0 ? tmpPrice : tmpBarPattern.price
        tmpQuantity = typeof tmpBarPattern.quantity == 'undefined' || tmpBarPattern.quantity == 0 ? tmpQuantity : tmpBarPattern.quantity
        pCode = tmpBarPattern.barcode     
        //console.log("1 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))    
        this.loading.current.instance.show()
        //ÜRÜN GETİRME    
        let tmpItemsDt = await this.getItemDb(pCode)
        if(tmpItemsDt.length > 0)
        {     
            //******************************************************** */
            //UNIQ BARKODU
            if(tmpItemsDt[0].UNIQ_CODE == tmpItemsDt[0].INPUT)
            {
                tmpQuantity = tmpItemsDt[0].UNIQ_QUANTITY
                tmpPrice = tmpItemsDt[0].UNIQ_PRICE
            }
            //******************************************************** */
            //FIYAT GETİRME
            let tmpPriceDt = new datatable()
            tmpPriceDt.selectCmd = 
            {
                query : "SELECT dbo.FN_PRICE_SALE(@GUID,@QUANTITY,GETDATE(),@CUSTOMER) AS PRICE",
                param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50'],
                local : 
                {
                    type : "select",
                    from : "ITEMS_POS_VW_01",
                    where : 
                    {
                        GUID : tmpItemsDt[0].GUID
                    },
                }
            }
            
            tmpPriceDt.selectCmd.value = [tmpItemsDt[0].GUID,tmpQuantity * tmpItemsDt[0].UNIT_FACTOR,this.posObj.dt()[0].CUSTOMER_GUID]
            await tmpPriceDt.refresh();  
            
            if(tmpPriceDt.length > 0 && tmpPrice == 0)
            {
                tmpPrice = tmpPriceDt[0].PRICE
                //FİYAT GÖR
                if(this.state.isBtnInfo)
                {
                    let tmpConfObj =
                    {
                        id:'msgAlert',
                        showTitle:true,
                        title:this.lang.t("info"),
                        showCloseButton:true,
                        width:'500px',
                        height:'250px',
                        button:[{id:"btn01",caption:"Tamam",location:'after'}],
                        content:(<div><h3 className="text-primary text-center">{tmpItemsDt[0].NAME}</h3><h3 className="text-danger text-center">{tmpPrice + " EUR"}</h3></div>)
                    }
                    await dialog(tmpConfObj);
                    this.setState({isBtnInfo:false})
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
                            tmpQuantity = tmpWResult
                        }
                        else
                        {
                            if(tmpWResult.Type == "02")
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
                    }
                    else
                    {
                        return
                    }
                }
                else
                {   
                    //EĞER OKUTULAN BARKODUN FİYAT SIFIR İSE KULLANICIYA FİYAT 
                    let tmpResult = await this.popNumber.show('Fiyat',0)
                    if(typeof tmpResult != 'undefined' && tmpResult != '')
                    {
                        //FIYAT DURUM KONTROLÜ
                        if(!(await this.priceCheck(tmpItemsDt[0],tmpResult)))
                        {
                            
                            return
                        }

                        tmpPrice = tmpResult
                        //FİYAT GİRİLMİŞ İSE TERAZİYE İSTEK YAPILIYOR.
                        let tmpWResult = await this.getWeighing()
                        if(typeof tmpWResult != 'undefined')
                        {
                            tmpQuantity = tmpWResult
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
            //**************************************************** */
            //FİYAT TANIMSIZ YADA SIFIR İSE
            //**************************************************** */
            if(tmpPrice == 0)
            {
                this.loading.current.instance.hide()
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
                let tmpMsgResult = await dialog(tmpConfObj);
                if(tmpMsgResult == 'btn01')
                {
                    let tmpResult = await this.popNumber.show(this.lang.t("price"),0)
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
                        //
                        return
                    }
                }
                else if(tmpMsgResult == 'btn02')
                {
                    //
                    return
                }
            }
            //**************************************************** */
            tmpItemsDt[0].QUANTITY = tmpQuantity
            tmpItemsDt[0].PRICE = tmpPrice
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
        //******************************************************** */    
    }
    getWeighing(pPrice)
    {
        return new Promise(async resolve => 
        {                        
            this.msgWeighing.show().then(async (e) =>
            {
                if(e == 'btn01')
                {
                    let tmpResult = await this.popNumber.show('Miktar',0)
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
                                button:[{id:"btn01",caption:"Tamam",location:'after'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgZeroValidation.msg")}</div>)
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
            let tmpWeigh = await this.posDevice.mettlerScaleSend(pPrice)
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
                let tmpSumFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('F'),tmpPrm[i].lastIndexOf('F') + 1)
                
                return {
                    barcode : pBarcode.substring(0,tmpPrm[i].lastIndexOf('N') + 1) + tmpMoneyFlag + tmpCentFlag + tmpKgFlag + tmpGramFlag + tmpSumFlag,
                    price : parseFloat((tmpMoney == '' ? "0" : tmpMoney) + "." + (tmpCent == '' ? "0" : tmpCent)),
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
        let tmpPayRest = 0;
        let tmpPayChange = 0;
        return new Promise(async resolve => 
        {
            
            if(this.posObj.dt().length > 0)
            {                  
                let tmpPosSale = this.posObj.posSale.dt().where({GUID:{'<>' : '00000000-0000-0000-0000-000000000000'}})  

                this.posObj.dt()[0].CDATE = moment(new Date()).utcOffset(0, true)
                this.posObj.dt()[0].LDATE = moment(new Date()).utcOffset(0, true)
                this.posObj.dt()[0].FAMOUNT = Number(parseFloat(tmpPosSale.sum('FAMOUNT',2)).toFixed(2))
                this.posObj.dt()[0].AMOUNT = Number(parseFloat(tmpPosSale.sum('AMOUNT',2)).toFixed(2))
                this.posObj.dt()[0].DISCOUNT = Number(parseFloat(tmpPosSale.sum('DISCOUNT',2)).toFixed(2))
                this.posObj.dt()[0].LOYALTY = Number(parseFloat(tmpPosSale.sum('LOYALTY',2)).toFixed(2))
                this.posObj.dt()[0].VAT = Number(parseFloat(tmpPosSale.sum('VAT',2)).toFixed(2))
                this.posObj.dt()[0].TOTAL = Number(parseFloat(tmpPosSale.sum('TOTAL',2)).toFixed(2))
                
                tmpPayRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).toFixed(2)); 
                tmpPayChange = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) >= 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).toFixed(2)) * -1

                this.customerName.value = this.posObj.dt()[0].CUSTOMER_NAME.toString()
                this.customerPoint.value = this.posObj.dt()[0].CUSTOMER_POINT
                this.popCustomerPoint.value = this.posObj.dt()[0].CUSTOMER_POINT
                this.popCustomerUsePoint.value = Number(parseFloat(this.posObj.dt()[0].LOYALTY * 100).toFixed(0))
                this.popCustomerGrowPoint.value = Number(parseInt(this.customerPoint.value - Number(parseFloat(this.posObj.dt()[0].LOYALTY * 100).toFixed(0))))                

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
                
                this.setState(
                {
                    payTotal:this.posObj.posPay.dt().sum('AMOUNT',2),
                    payChange:tmpPayChange,
                    payRest:tmpPayRest,
                    cheqCount:this.cheqDt.length,
                    cheqLastAmount:this.cheqDt.length > 0 ? this.cheqDt[0].AMOUNT : 0,
                    cheqTotalAmount:this.cheqDt.sum('AMOUNT',2)
                })       
                if(tmpPosSale.length > 0)
                {
                    this.posDevice.lcdPrint
                    ({
                        blink : 0,
                        text :  tmpPosSale[tmpPosSale.length - 1].ITEM_NAME.toString().space(11) + " " + 
                                (parseFloat(tmpPosSale[tmpPosSale.length - 1].PRICE).toFixed(2) + "EUR").space(8,"s") +
                                "TOTAL : " + (parseFloat(tmpPayRest).toFixed(2) + "EUR").space(12,"s")
                    })
                }
            }            
            //console.log("100 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS")) 
            //HER EKLEME İŞLEMİNDEN SONRA İLK SATIR SEÇİLİYOR.
            setTimeout(() => 
            {
                this.grdList.devGrid.selectRowsByIndexes(0)
                this.grdList.devGrid.option('focusedRowIndex',0)
            }, 100);
            
            if(typeof pSave == 'undefined' || pSave)
            {                
                let tmpClose = await this.saleClosed(true,tmpPayRest,tmpPayChange)
                let tmpSaveResult = await this.posObj.save()

                if(tmpSaveResult == 0)
                {
                    if(tmpClose)
                    {
                        this.init()
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
                    if((await dialog(tmpConfObj)) == 'btn02')
                    {
                        await this.calcGrandTotal()
                    }
                }
            }    
            resolve()            
            
        });
    }    
    calcSaleTotal(pPrice,pQuantity,pDiscount,pLoyalty,pVatRate)
    {
        let tmpAmount = Number(parseFloat((pPrice * pQuantity)).toFixed(2))
        let tmpFAmount = Number(parseFloat((pPrice * pQuantity) - (pDiscount)).toFixed(2))
        tmpFAmount = Number(tmpFAmount - pLoyalty)
        let tmpVat = Number(parseFloat(tmpFAmount - (tmpFAmount / ((pVatRate / 100) + 1))).toFixed(2))
    
        return {
            QUANTITY:pQuantity,
            PRICE:pPrice,
            FAMOUNT:Number(parseFloat(tmpFAmount - tmpVat).toFixed(2)),
            AMOUNT:Number(parseFloat(tmpAmount).toFixed(2)),
            DISCOUNT:pDiscount,
            LOYALTY:pLoyalty,
            VAT:tmpVat,
            TOTAL:tmpFAmount
        }
    }
    isRowMerge(pType,pData)
    {
        if(pType == 'SALE')
        {
            let tmpData = this.posObj.posSale.dt().where({ITEM_GUID:pData.GUID}).where({SUBTOTAL:0}).where({QUANTITY:{'>':0}}).where({PRICE:pData.PRICE})
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
            pItemData.QUANTITY = Number(parseFloat((pItemData.QUANTITY * pItemData.UNIT_FACTOR) + Number(tmpRowData.QUANTITY)).toFixed(3))
            this.saleRowUpdate(tmpRowData,pItemData)
        }
        else
        {            
            pItemData.QUANTITY = Number(parseFloat(pItemData.QUANTITY * pItemData.UNIT_FACTOR).toFixed(3))
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
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DEPOT_GUID = '00000000-0000-0000-0000-000000000000'
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
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].INPUT = pItemData.INPUT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].BARCODE_GUID = pItemData.BARCODE_GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].BARCODE = pItemData.BARCODE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_GUID = pItemData.UNIT_GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_NAME = pItemData.UNIT_NAME
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_SHORT = pItemData.UNIT_SHORT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_FACTOR = pItemData.UNIT_FACTOR
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
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DELETED = false
        
        this.promoApply()

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
                query : "SELECT dbo.FN_PRICE_SALE(@GUID,@QUANTITY,GETDATE(),@CUSTOMER) AS PRICE",
                param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50'],
                local : 
                {
                    type : "select",
                    from : "ITEMS_POS_VW_01",
                    where : 
                    {
                        GUID : pRowData.ITEM_GUID
                    },
                }
            }     
            tmpPriceDt.selectCmd.value = [pRowData.ITEM_GUID,pItemData.QUANTITY,pRowData.CUSTOMER_GUID]
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
        
        this.promoApply()

        await this.calcGrandTotal();
    } 
    async saleClosed(pPrint,pPayRest,pPayChange)
    {               
        return new Promise(async resolve => 
        {
            await this.core.util.waitUntil()
            if(pPayRest == 0 && this.posObj.dt().length > 0 && this.posObj.dt()[0].AMOUNT > 0) //FIYATSIZ VE MİKTAR SIFIR ÜRÜNLER İÇİN KONTROL EKLENDİ. BU ŞEKİLDE SATIŞIN KAPANMASI ENGELLENDİ.
            {
                this.posDevice.lcdPrint
                ({
                    blink : 0,
                    text :  "A tres bientot".space(20)
                })

                this.posObj.dt()[0].STATUS = 1
                //***** TICKET İMZALAMA *****/
                let tmpSignedData = await this.nf525.signatureSale(this.posObj.dt()[0],this.posObj.posSale.dt())                
                this.posObj.dt()[0].REF = tmpSignedData.REF
                this.posObj.dt()[0].SIGNATURE = tmpSignedData.SIGNATURE
                this.posObj.dt()[0].SIGNATURE_SUM = tmpSignedData.SIGNATURE_SUM

                let tmpSigned = "-"
                if(this.posObj.dt()[0].SIGNATURE != '')
                {
                    tmpSigned = this.posObj.dt()[0].SIGNATURE.substring(2,3) + this.posObj.dt()[0].SIGNATURE.substring(6,7) + this.posObj.dt()[0].SIGNATURE.substring(12,13) + this.posObj.dt()[0].SIGNATURE.substring(18,19)
                }

                this.posObj.dt()[this.posObj.dt().length - 1].CERTIFICATE = this.core.appInfo.name + " version : " + this.core.appInfo.version + " - " + this.core.appInfo.certificate + " - " + tmpSigned;
                //************************* */

                if(this.posObj.posPay.dt().length > 0)
                {
                    //this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT - pPayChange
                    this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = pPayChange
                    if(this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE == 3)
                    {
                        this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].TICKET_PLUS = pPayChange
                    }                    
                }
                //EĞER MÜŞTERİ KARTI İSE PUAN KAYIT EDİLİYOR.
                if(this.posObj.dt()[0].CUSTOMER_GUID != '00000000-0000-0000-0000-000000000000' && this.posObj.dt()[0].CUSTOMER_TYPE == 0)
                {
                    if(this.posObj.dt()[0].TYPE == 0)
                    {
                        if(Math.floor(this.posObj.dt()[0].TOTAL) > 0)
                        {
                            let tmpPoint = Math.floor(this.posObj.dt()[0].TOTAL)
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
                            await this.customerPointSave(1,Number(parseFloat(this.posObj.dt()[0].LOYALTY * 100).toFixed(0)))
                        }
                    }
                    else
                    {
                        await this.customerPointSave(1,Math.floor(this.posObj.dt()[0].TOTAL))
                    }                    
                }
                this.popTotal.hide();
                this.popCashPay.hide();
                this.popCardPay.hide();
                this.popCheqpay.hide();                
                
                //PROMOSYONDA HEDİYE ÇEKİ VARSA UYGULANIYOR
                if(this.posPromoObj.dt().where({APP_TYPE:2}).length > 0)
                {
                    this.posObj.dt()[0].REBATE_CHEQPAY = 'Q' + new Date().toISOString().substring(2, 10).replace('-','').replace('-','') + Math.round(Number(parseFloat(this.posPromoObj.dt().where({APP_TYPE:2})[0].APP_AMOUNT).toFixed(2)) * 100).toString().padStart(5,'0') + Date.now().toString().substring(7,12);
                    await this.cheqpaySave(this.posObj.dt()[0].REBATE_CHEQPAY,this.posPromoObj.dt().where({APP_TYPE:2})[0].APP_AMOUNT,0,1);
                }
                //**************************** */
                if(pPayChange > 0)
                {
                    if(this.posObj.posPay.dt().length > 0 && this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE == 4)
                    {
                        this.posObj.dt()[0].REBATE_CHEQPAY = 'Q' + new Date().toISOString().substring(2, 10).replace('-','').replace('-','') + Math.round(Number(parseFloat(pPayChange).toFixed(2)) * 100).toString().padStart(5,'0') + Date.now().toString().substring(7,12);
                        await this.cheqpaySave(this.posObj.dt()[0].REBATE_CHEQPAY,pPayChange,0,1);
                    }
                    else if(this.posObj.posPay.dt().where({TYPE:0}).length > 0)
                    {
                        if(this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE == 0)
                        {
                            let tmpConfObj =
                            {
                                id:'msgMoneyChange',
                                timeout:10000,
                                showTitle:true,
                                title:this.lang.t("msgMoneyChange.title"),
                                showCloseButton:true,
                                width:'500px',
                                height:'250px',
                                button:[{id:"btn01",caption:this.lang.t("msgMoneyChange.btn01"),location:'after'}],
                                content:(<div><h3 className="text-danger text-center">{pPayChange + " EUR"}</h3><h3 className="text-primary text-center">{this.lang.t("msgMoneyChange.msg")}</h3></div>)
                            }
                            dialog(tmpConfObj);
                        }
                    }
                } 
                //POS_PROMO TABLOSUNA KAYIT EDİLİYOR.
                await this.posPromoObj.save()
                //******************************** */
                if(typeof pPrint == 'undefined' || pPrint)
                {       
                    let tmpType = 'Fis'
                    //POS_EXTRA TABLOSUNA YAZDIRMA BİLDİRİMİ GÖNDERİLİYOR                    
                    let tmpInsertQuery = 
                    {
                        query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                                "@CUSER = @PCUSER, " + 
                                "@TAG = @PTAG, " +
                                "@POS_GUID = @PPOS_GUID, " +
                                "@LINE_GUID = @PLINE_GUID, " +
                                "@DATA =@PDATA, " +
                                "@APP_VERSION =@PAPP_VERSION, " +
                                "@DESCRIPTION = @PDESCRIPTION ", 
                        param : ['PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|250','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                        value : [this.posObj.dt()[0].CUSER,"REPRINT",this.posObj.dt()[0].GUID,"00000000-0000-0000-0000-000000000000","",this.core.appInfo.version,""],
                        local : 
                        {
                            type : "insert",
                            into : "POS_EXTRA_VW_01",
                            values : 
                            [
                                {
                                    GUID : datatable.uuidv4(),
                                    CUSER : this.posObj.dt()[0].CUSER,
                                    TAG : "REPRINT",
                                    POS_GUID : this.posObj.dt()[0].GUID,
                                    LINE_GUID : "00000000-0000-0000-0000-000000000000",
                                    DATA : "",
                                    APP_VERSION : this.core.appInfo.version,
                                    DESCRIPTION : ""
                                }
                            ]
                        }
                    }
                    await this.core.sql.execute(tmpInsertQuery)
                    //***************************************************/
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
                            customerUsePoint:this.popCustomerUsePoint.value,
                            customerPoint:this.customerPoint.value,
                            customerGrowPoint:this.popCustomerGrowPoint.value
                        }
                    }
                    //YAZDIRMA İŞLEMİNDEN ÖNCE KULLANICIYA SORULUYOR
                    if(this.prmObj.filter({ID:'PrintAlert',TYPE:0}).getValue() == true)
                    {
                        let tmpConfObj =
                        {
                            id:'msgPrintAlert',showTitle:true,title:this.lang.t("msgPrintAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                            button:[{id:"btn01",caption:this.lang.t("msgPrintAlert.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgPrintAlert.btn02"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPrintAlert.msg")}</div>)
                        }
                        
                        if((await dialog(tmpConfObj)) == 'btn01')
                        {
                            await this.print(tmpData)
                        }
                    }
                    else
                    {
                        await this.print(tmpData)
                    }
                    //***************************************************/
                    //TICKET REST. ALDIĞINDA KASA AÇMA İŞLEMİ 
                    if(this.posObj.posPay.dt().where({PAY_TYPE:3}).length > 0)
                    {
                        await this.posDevice.caseOpen();
                    }
                }
                
                resolve(true)
            }
            else
            {
                resolve(false)
            }
        });
    }   
    async payAdd(pType,pAmount)
    {        
        if(this.state.payRest > 0)
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
            //KREDİ KARTI İSE
            if(pType == 1)
            {
                if(pAmount > this.state.payRest)
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
                let tmpPayCard = await this.payCard(pAmount)

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
                        if((this.state.payRest - pAmount) > 0)
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

            this.loadingPay.current.instance.show()
            let tmpRowData = this.isRowMerge('PAY',{TYPE:pType})
            //NAKİT ALDIĞINDA KASA AÇMA İŞLEMİ 
            if(pType == 0)
            {
                this.posDevice.caseOpen();
            }            
            //SATIR BİRLEŞTİR        
            if(typeof tmpRowData != 'undefined')
            {    
                await this.payRowUpdate(tmpRowData,{AMOUNT:Number(parseFloat(Number(pAmount) + tmpRowData.AMOUNT).toFixed(2)),CHANGE:0})
            }
            else
            {
                await this.payRowAdd({PAY_TYPE:pType,AMOUNT:pAmount,CHANGE:0})
            }            
            this.loadingPay.current.instance.hide()
        }        
    }
    payRowAdd(pPayData)
    {
        return new Promise(async resolve => 
        {
            let tmpTypeName = ""
            let tmpMaxLine = this.posObj.posPay.dt().max('LINE_NO')

            if(pPayData.PAY_TYPE == 0)
                tmpTypeName = "ESC"
            else if(pPayData.PAY_TYPE == 1)
                tmpTypeName = "CB"
            else if(pPayData.PAY_TYPE == 2)
                tmpTypeName = "CHQ"
            else if(pPayData.PAY_TYPE == 3)
                tmpTypeName = "T.R"
            else if(pPayData.PAY_TYPE == 4)
                tmpTypeName = "BON D'AVOIR"
            
            this.posObj.posPay.addEmpty()
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE = pPayData.PAY_TYPE
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE_NAME = tmpTypeName
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].LINE_NO = tmpMaxLine + 1
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = Number(parseFloat(pPayData.AMOUNT).toFixed(2))
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = pPayData.CHANGE
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].DELETED = false

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
    
            await this.calcGrandTotal();
            resolve()
        });
    }
    payCard(pAmount)
    {
        return new Promise(async resolve => 
        {
            let tmpFn = () =>
            {
                this.msgCardPayment.show().then(async (e) =>
                {                    
                    if(e == 'btn01')
                    {
                        if(this.posDevice.payPort.isOpen)
                        {
                            await this.posDevice.payPort.close()
                        }
                        this.msgCardPayment.hide();
                        resolve(await this.payCard(pAmount)) // Tekrar
                    }
                    else if(e == 'btn02')
                    {
                        //HER TURLU CEVAP DÖNDÜÜ 0Ç0N POPUP KAPANIYOR YEN0DEN ACINCA 2. KEZ GÖNDERMEYE CALISIYOR BURAYA IPTAL DEYINCE CIHAZDANDA IPTAL ETMEYI YAPMAK LAZIM
                        let tmpAcsVal = this.acsObj.filter({ID:'btnDeviceEntry',TYPE:2,USERS:this.user.CODE})
                                        
                        if(typeof tmpAcsVal.getValue().dialog != 'undefined' && tmpAcsVal.getValue().dialog.type != -1)
                        {   
                            let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:tmpAcsVal.getValue().dialog.type})

                            if(tmpResult)
                            {
                                if(this.posDevice.payPort.isOpen)
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
                        if(this.posDevice.payPort.isOpen)
                        {
                            await this.posDevice.payPort.close()
                        }
                        this.msgCardPayment.hide();             
                        resolve(2) // Zorla
                    }
                })
            }

            tmpFn()
            
            let tmpCardPay = await this.posDevice.cardPayment(pAmount)
            
            if(typeof tmpCardPay != 'undefined')
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
                else
                {
                    resolve(0) // Başarısız
                }
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
                console.log(11)
                this.calcGrandTotal()
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
        this.posObj.dt().removeAt(0)
        await this.posObj.save()
        this.init()
    }
    async rowDelete()
    {
        if(this.posObj.posSale.dt().length > 1)
        {
            if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
            {
                this.grdList.devGrid.deleteRow(this.grdList.devGrid.getRowIndexByKey(this.grdList.devGrid.getSelectedRowKeys()[0]))
            }
            await this.posObj.posSale.dt().delete()
            this.promoApply()
            await this.calcGrandTotal()
            console.log(this.posObj.posSale.dt())
        }
        else
        {
            this.delete()
        }
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
            tmpAmount = Number(parseFloat(pCode.substring(7,12) / 100).toFixed(2))

            tmpDt.selectCmd = 
            {
                query : "SELECT *,DATEDIFF(DAY,CDATE,GETDATE()) AS EXDAY FROM CHEQPAY_VW_01 WHERE CODE = @CODE AND TYPE = 1",
                param : ['CODE:string|50'],
                value : [pCode],
                local : 
                {
                    type : "select",
                    from : "CHEQPAY_VW_01",
                    where : 
                    {
                        CODE : pCode,
                        TYPE : 1
                    },
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

            tmpAmount = Number(parseFloat(tmpTicket / 100).toFixed(2))
            tmpYear = (parseInt(parseFloat(moment(new Date(),"YY").format("YY")) / 10) * 10) + parseInt(tmpYear)                                            
            if(moment(new Date()).diff(moment('20' + tmpYear + '0101'),"day") > 395 || moment(new Date()).diff(moment('20' + tmpYear + '0101'),"day") < 0)
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
                    from : "CHEQPAY_VW_01",
                    where : 
                    {
                        REFERENCE : pCode.substring(0,9),
                        TYPE : 0
                    },
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
                value : [this.core.auth.data.CODE,pType,this.posObj.dt()[0].GUID,pCode,pAmount,pStatus]
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
                value : [this.core.auth.data.CODE,pType,this.posObj.dt()[0].CUSTOMER_GUID,this.posObj.dt()[0].GUID,pPoint,'']
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
                query : "SELECT *,ISNULL((SELECT TOP 1 TICKET FROM POS_VW_01 WHERE TICKET = @GUID),'') AS REBATE_TICKET FROM POS_SALE_VW_01 WHERE SUBSTRING(CONVERT(NVARCHAR(50),POS_GUID),20,17) = @GUID",
                param : ['GUID:string|50'], 
                value : [pTicket] 
            }
            await tmpDt.refresh();
            
            if(tmpDt.length > 0)
            {
                if(tmpDt[0].REBATE_TICKET != '')
                {
                    let tmpConfObj =
                    {
                        id:'msgDoubleRebate',showTitle:true,title:this.lang.t("msgDoubleRebate.title"),showCloseButton:true,width:'500px',height:'200px',
                        button:[{id:"btn01",caption:this.lang.t("msgDoubleRebate.btn01"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDoubleRebate.msg")}</div>)
                    }
                    await dialog(tmpConfObj);
                    this.msgItemReturnTicket.hide()
                    return
                }

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
            if(this.prmObj.filter({ID:'MinPriceCheck',TYPE:0}).getValue() == true && Number(pPrice) < Number(parseFloat(pData.MIN_PRICE).toFixed(2)))
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
            if(this.prmObj.filter({ID:'CostPriceCheck',TYPE:0}).getValue() == true && Number(pPrice) < Number(parseFloat(pData.COST_PRICE).toFixed(2)))
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
    print(pData)
    {
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
                
                await this.posDevice.escPrinter(tmpPrint)
                resolve()
            })
        });
    }
    transferStart(pTime)
    {
        let tmpCounter = 0
        let tmpPrmTime = typeof pTime != 'undefined' ? pTime : this.prmObj.filter({ID:'TransferTime',TYPE:0}).getValue()

        this.interval = setInterval(async ()=>
        {
            this.setState({msgTransfer1:this.lang.t("popTransfer.msg1") + (tmpPrmTime - tmpCounter).toString() + " Sn.",msgTransfer2:""})
            tmpCounter += 1
            if(tmpCounter == tmpPrmTime)
            {
                this.setState({msgTransfer1:this.lang.t("popTransfer.msg2")})
                this.transferStop()
                await this.transfer.transferSql()
                await this.transfer.transferLocal()
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
            }

            resolve()
        });
    }
    getPromoDb()
    {
        return new Promise(async resolve => 
        {
            //this.posPromoObj.clearAll()
            this.promoObj.clearAll()
            await this.promoObj.load({START_DATE:moment(new Date()).format("YYYY-MM-DD"),FINISH_DATE:moment(new Date()).format("YYYY-MM-DD"),CUSTOMER_GUID:this.posObj.dt()[0].CUSTOMER_GUID,DEPOT_GUID:this.posObj.dt()[0].DEPOT_GUID})
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
                            let tmpCondCount = Math.floor(tmpSale.where({ITEM_GUID : {'in' : tmpCond.toColumnArr('ITEM_GUID')}}).sum('QUANTITY') / tmpCond[0].QUANTITY)
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
                return {result : true,count : tmpResult.sum('COUNT'),items : tmpItems}
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
    checkRecord()
    {
        for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
        {
            if(typeof this.posObj.posSale.dt()[i].stat != 'undefined' && this.posObj.posSale.dt()[i].stat != '')
            {
                return {table:'POS_SALE',item:this.posObj.posSale.dt()[i].ITEM_NAME}
            }
        }
        // for (let i = 0; i < this.posObj.dt().length; i++) 
        // {
        //     console.log(this.posObj.dt()[i].stat)
        //     if(typeof this.posObj.dt()[i].stat != 'undefined' && this.posObj.dt()[i].stat != '')
        //     {
        //         return {table:'POS'}
        //     }
        // }
        return
    }
    sendJet(pData)
    {
        let tmpJetData =
        {
            CUSER:this.core.auth.data.CODE,            
            DEVICE:window.localStorage.getItem('device') == null ? '' : window.localStorage.getItem('device'),
            CODE:typeof pData.CODE != 'undefined' ? pData.CODE : '',
            NAME:typeof pData.NAME != 'undefined' ? pData.NAME : '',
            DESCRIPTION:typeof pData.DESCRIPTION != 'undefined' ? pData.DESCRIPTION : '',
            APP_VERSION:this.core.appInfo.version
        }
        this.core.socket.emit('nf525',{cmd:"jet",data:tmpJetData})
    }
    render()
    {
        return(
            <div>
                {/* Ekranda belirli bir süre boş beklediğinde logout olması için yapıldı */}
                <IdleTimer timeout={this.prmObj.filter({ID:'ScreenTimeOut',TYPE:0}).getValue()}
                onIdle={()=>
                {
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
                message={"Lütfen bekleyiniz..."}
                ref={this.loadingPay}
                />               
                <div className="top-bar row">
                    <div className="col-12">                    
                        <div className="row m-2">
                            <div className="col-1">
                                <img src="./css/img/logo.png" width="50px" height="50px"/>
                            </div>
                            <div className="col-2">
                                <div className="row" style={{height:"25px"}}>
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
                                    let tmpAcsVal = this.acsObj.filter({ID:'btnDeviceEntry',TYPE:2,USERS:this.user.CODE})
                                        
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
                                    if(this.state.isBtnGetCustomer)
                                    {
                                        this.setState({isBtnGetCustomer:false})                                                
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

                                                this.btnPopLoyaltyDel.props.onClick()

                                                //PROMOSYON GETİR.
                                                await this.getPromoDb()
                                                this.promoApply()
                                                //************************************************** */
                                                this.calcGrandTotal(true);
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
                            <div className="col-1 px-1">
                                <NbButton id={"btnRefresh"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                onClick={()=>
                                {                                                        
                                    document.location.reload()
                                }}>
                                    <i className="text-white fa-solid fa-arrows-rotate" style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                            <div className="col-1 px-1">
                                <NbButton id={"btnSettings"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                onClick={()=>
                                {   
                                    if(this.posDevice.dt().length > 0)
                                    {
                                        this.txtPopSettingsLcd.value = this.posDevice.dt()[0].LCD_PORT
                                        this.txtPopSettingsScale.value = this.posDevice.dt()[0].SCALE_PORT
                                        this.txtPopSettingsPayCard.value = this.posDevice.dt()[0].PAY_CARD_PORT
                                        this.txtPopSettingsPrint.value = this.posDevice.dt()[0].PRINT_DESING
                                    }
                                    this.keyPopSettings.clearInput();
                                    this.popSettings.show();
                                }}>
                                    <i className="text-white fa-solid fa-gear" style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                            <div className="col-1 px-1">
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
                                        let tmpAcsVal = this.acsObj.filter({ID:'btnPluEdit',TYPE:2,USERS:this.user.CODE})
                                        
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
                            <div className="col-1 ps-1 pe-3">
                                <NbButton id={"btnClose"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                onClick={()=>
                                {                                                        
                                    this.core.auth.logout()
                                    window.location.reload()
                                }}>
                                    <i className="text-white fa-solid fa-power-off" style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </div>   
                </div>
                <div className="row p-2">
                    {/* Left Column */}
                    <div className="col-6">
                        {/* txtBarcode */}
                        <div className="row">
                            <div className="col-12">
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
                                                    query : "SELECT BARCODE,NAME,PRICE_SALE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE BARCODE LIKE '%' + @BARCODE AND STATUS = 1",
                                                    param : ['BARCODE:string|25'],
                                                    local : 
                                                    {
                                                        type : "select",
                                                        from : "ITEMS_BARCODE_MULTICODE_VW_01",
                                                        where : 
                                                        {
                                                            BARCODE : {like : '%' + this.txtBarcode.value},
                                                        },
                                                    }
                                                }
                                                tmpDt.selectCmd.value = [this.txtBarcode.value]
                                                await tmpDt.refresh();
                                                
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
                            </div>                            
                        </div>
                        {/* grdList */}
                        <div className="row">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdList"} 
                                showBorders={true} 
                                columnsAutoWidth={false} 
                                allowColumnResizing={true} 
                                allowColumnReordering={false}
                                height={"200px"} 
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
                                            let tmpResult = await this.popNumber.show('Miktar',Number(e.value) / Number(e.data.UNIT_FACTOR))
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
                                                let tmpData = {QUANTITY:Number(tmpResult) * Number(e.data.UNIT_FACTOR),PRICE:e.data.PRICE}
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
                                    <Scrolling mode="infinite" />
                                    <Column dataField="LDATE" caption={this.lang.t("grdList.LDATE")} width={40} alignment={"center"} dataType={"datetime"} format={"dd-MM-yyyy - HH:mm:ss SSSZ"} defaultSortOrder="desc" visible={false}/>
                                    <Column dataField="NO" caption={""} width={30} cellTemplate={(cellElement,cellInfo)=>
                                    {
                                        cellElement.innerText = this.posObj.posSale.dt().length - cellInfo.rowIndex
                                    }}
                                    alignment={"center"}/>                                    
                                    <Column dataField="ITEM_SNAME" caption={this.lang.t("grdList.ITEM_NAME")} width={270}/>
                                    <Column dataField="QUANTITY" caption={this.lang.t("grdList.QUANTITY")} width={50}/>
                                    <Column dataField="PRICE" caption={this.lang.t("grdList.PRICE")} width={70} format={"#,##0.00" + Number.money.sign}/>
                                    <Column dataField="AMOUNT" alignment={"right"} caption={this.lang.t("grdList.AMOUNT")} width={60} format={"#,##0.00" + Number.money.sign}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                        {/* Grand Total */}
                        <div className="row">
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">{this.lang.t("totalLine")}<span className="text-dark"><NbLabel id="totalRowCount" parent={this} value={"0"}/></span></p>    
                                    </div>
                                    <div className="col-6">
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
                                        <p className="text-primary text-start m-0">{this.lang.t("ticketRect")}<span className="text-dark">{this.state.cheqCount + '/' + parseFloat(this.state.cheqTotalAmount).toFixed(2)} {Number.money.sign}</span></p>    
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
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
                        <div className="row">
                            <div className="col-12">
                                <p className="fs-2 fw-bold text-center m-0"><NbLabel id="totalGrand" parent={this} value={"0.00"} format={"currency"}/></p>
                            </div>
                        </div>
                        {/* Button Console */}
                        <div className="row">
                            <div className="col-12">
                                {/* Line 1 */}
                                <div className="row px-2">
                                    {/* Total */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnTotal"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
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
                                            //* SATIŞI KAPATMADAN ÖNCE KAYITLAR KONTROL EDİLİYOR */
                                            let tmpCheckRecord = this.checkRecord()
                                            if(typeof tmpCheckRecord != 'undefined')
                                            {
                                                let tmpConfObj = {}
                                                if(tmpCheckRecord.table == 'POS')
                                                {
                                                    tmpConfObj =
                                                    {
                                                        id:'msgCheckRecord',showTitle:true,title:this.lang.t("msgCheckRecord.title"),showCloseButton:false,width:'500px',height:'250px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgCheckRecord.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCheckRecord.msg1")}</div>)
                                                    }
                                                }
                                                else if(tmpCheckRecord.table == 'POS_SALE')
                                                {
                                                    tmpConfObj =
                                                    {
                                                        id:'msgCheckRecord',showTitle:true,title:this.lang.t("msgCheckRecord.title"),showCloseButton:false,width:'500px',height:'250px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgCheckRecord.btn01"),location:'after'}],
                                                        content:(
                                                        <div style={{textAlign:"center",fontSize:"20px"}}>
                                                            <div className="row">
                                                                <div className="col-12">{this.lang.t("msgCheckRecord.msg1")}</div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-12">{this.lang.t("msgCheckRecord.msg2")} {tmpCheckRecord.item}</div>
                                                            </div>
                                                        </div>)
                                                    }
                                                }

                                                let tmpMsgResult = await dialog(tmpConfObj);
                                                if(tmpMsgResult == 'btn01')
                                                {
                                                    return
                                                }
                                            } 
                                            //*************************************************** */
                                            this.rbtnPayType.value = 0                                                                       
                                            this.popTotal.show();
                                            this.txtPopTotal.newStart = true;
                                        }}>
                                            <i className="text-white fa-solid fa-euro-sign" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Credit Card */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnCreditCard"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
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
                                            //* SATIŞI KAPATMADAN ÖNCE KAYITLAR KONTROL EDİLİYOR */
                                            let tmpCheckRecord = this.checkRecord()
                                            if(typeof tmpCheckRecord != 'undefined')
                                            {
                                                let tmpConfObj = {}
                                                if(tmpCheckRecord.table == 'POS')
                                                {
                                                    tmpConfObj =
                                                    {
                                                        id:'msgCheckRecord',showTitle:true,title:this.lang.t("msgCheckRecord.title"),showCloseButton:false,width:'500px',height:'250px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgCheckRecord.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCheckRecord.msg1")}</div>)
                                                    }
                                                }
                                                else if(tmpCheckRecord.table == 'POS_SALE')
                                                {
                                                    tmpConfObj =
                                                    {
                                                        id:'msgCheckRecord',showTitle:true,title:this.lang.t("msgCheckRecord.title"),showCloseButton:false,width:'500px',height:'250px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgCheckRecord.btn01"),location:'after'}],
                                                        content:(
                                                        <div style={{textAlign:"center",fontSize:"20px"}}>
                                                            <div className="row">
                                                                <div className="col-12">{this.lang.t("msgCheckRecord.msg1")}</div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-12">{this.lang.t("msgCheckRecord.msg2")} {tmpCheckRecord.item}</div>
                                                            </div>
                                                        </div>)
                                                    }
                                                }

                                                let tmpMsgResult = await dialog(tmpConfObj);
                                                if(tmpMsgResult == 'btn01')
                                                {
                                                    return
                                                }
                                            } 
                                            //*************************************************** */
                                            this.popCardPay.show();
                                            this.txtPopCardPay.newStart = true;
                                        }}>
                                            <i className="text-white fa-solid fa-credit-card" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 7 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey7"} parent={this} keyBtn={{textbox:"txtBarcode",key:"7"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-7" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 8 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey8"} parent={this} keyBtn={{textbox:"txtBarcode",key:"8"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-8" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 9 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey9"} parent={this} keyBtn={{textbox:"txtBarcode",key:"9"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-9" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Check */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnCheck"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {
                                            this.getItem(this.txtBarcode.dev.option("value"))
                                        }}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>  
                                {/* Line 2 */}
                                <div className="row px-2">
                                    {/* Safe Open */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnSafeOpen"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        access={this.acsObj.filter({ELEMENT:'btnSafeOpen',USERS:this.user.CODE})}
                                        onClick={async ()=>
                                        {
                                            this.posDevice.caseOpen();
                                        }}
                                        >
                                            <i className="text-white fa-solid fa-inbox" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Cash */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnCash"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
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
                                            //* SATIŞI KAPATMADAN ÖNCE KAYITLAR KONTROL EDİLİYOR */
                                            let tmpCheckRecord = this.checkRecord()
                                            if(typeof tmpCheckRecord != 'undefined')
                                            {
                                                let tmpConfObj = {}
                                                if(tmpCheckRecord.table == 'POS')
                                                {
                                                    tmpConfObj =
                                                    {
                                                        id:'msgCheckRecord',showTitle:true,title:this.lang.t("msgCheckRecord.title"),showCloseButton:false,width:'500px',height:'250px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgCheckRecord.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCheckRecord.msg1")}</div>)
                                                    }
                                                }
                                                else if(tmpCheckRecord.table == 'POS_SALE')
                                                {
                                                    tmpConfObj =
                                                    {
                                                        id:'msgCheckRecord',showTitle:true,title:this.lang.t("msgCheckRecord.title"),showCloseButton:false,width:'500px',height:'250px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgCheckRecord.btn01"),location:'after'}],
                                                        content:(
                                                        <div style={{textAlign:"center",fontSize:"20px"}}>
                                                            <div className="row">
                                                                <div className="col-12">{this.lang.t("msgCheckRecord.msg1")}</div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-12">{this.lang.t("msgCheckRecord.msg2")} {tmpCheckRecord.item}</div>
                                                            </div>
                                                        </div>)
                                                    }
                                                }

                                                let tmpMsgResult = await dialog(tmpConfObj);
                                                if(tmpMsgResult == 'btn01')
                                                {
                                                    return
                                                }
                                            } 
                                            //****************************************************************************************************************************************** */                
                                            this.popCashPay.show();
                                            this.txtPopCashPay.newStart = true;
                                        }}>
                                            <i className="text-white fa-solid fa-money-bill-1" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 4 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey4"} parent={this} keyBtn={{textbox:"txtBarcode",key:"4"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-4" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 5 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey5"} parent={this} keyBtn={{textbox:"txtBarcode",key:"5"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-5" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 6 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey6"} parent={this} keyBtn={{textbox:"txtBarcode",key:"6"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-6" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Backspace */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyBs"} parent={this} keyBtn={{textbox:"txtBarcode",key:"Backspace"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-delete-left" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div> 
                                {/* Line 3 */}
                                <div className="row px-2">
                                    {/* Discount */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnDiscount"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        access={this.acsObj.filter({ELEMENT:'btnDiscount',USERS:this.user.CODE})}
                                        onClick={async()=>
                                        {   
                                            await this.grdDiscList.dataRefresh({source:this.posObj.posSale.dt().where({PROMO_TYPE:0}).where({ITEM_NAME:{'<>':'SUB TOTAL'}})});
                                            this.popDiscount.show()
                                        }}>
                                            <i className="text-white fa-solid fa-percent" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Cheqpay */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnCheqpay"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
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
                                            await this.calcGrandTotal(false);
                                            await this.core.util.waitUntil(500)
                                            
                                            this.popCheqpay.show();
                                        }}>
                                            <i className="text-white fa-solid fa-ticket" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey1"} parent={this} keyBtn={{textbox:"txtBarcode",key:"1"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-1" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 2 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey2"} parent={this} keyBtn={{textbox:"txtBarcode",key:"2"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-2" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 3 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey3"} parent={this} keyBtn={{textbox:"txtBarcode",key:"3"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-3" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* X */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyX"} parent={this} keyBtn={{textbox:"txtBarcode",key:"*"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div> 
                                {/* Line 4 */}
                                <div className="row px-2">
                                    {/* Customer Point */}
                                    <div className="col px-1">
                                        <NbButton id={"btnCustomerPoint"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
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
                                    {/* Info */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnInfo"} parent={this} className={this.state.isBtnInfo == true ? "form-group btn btn-danger btn-block my-1" : "form-group btn btn-info btn-block my-1"} style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {
                                            if(this.state.isBtnInfo)
                                            {
                                                this.setState({isBtnInfo:false})
                                            }
                                            else
                                            {
                                                this.setState({isBtnInfo:true})
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-circle-info" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* . */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyDot"} parent={this} keyBtn={{textbox:"txtBarcode",key:"."}}
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"26pt"}}>.</NbButton>
                                    </div>
                                    {/* 0 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey0"} parent={this} keyBtn={{textbox:"txtBarcode",key:"0"}}
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-0" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* -1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnNegative1"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"20pt"}}
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
                                        }}>-1</NbButton>
                                    </div>
                                    {/* +1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnPlus1"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"20pt"}}
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
                                        }}>+1</NbButton>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="col-6">
                        <div className="row" style={{backgroundColor:this.state.isFormation ? 'coral' : 'white',marginLeft:'1px',marginRight:'0.5px',borderRadius:'5px'}}>
                            <div className="col-6">
                                <NbLabel id="info" parent={this} value={this.core.appInfo.name + " version : " + this.core.appInfo.version}/>
                            </div>
                            <div className="col-6 text-end">
                                <NbLabel id="formation" parent={this} value={''}/>
                            </div>
                        </div>
                        {/* Button Console*/}
                        <div className="row">
                            <div className="col-12" style={{paddingTop:"17px"}}>
                                {/* Line 1-2-3-4 */}
                                <div className="row px-2">
                                    <div className="col-2">
                                        {/* Up */}
                                        <div className="row">                                            
                                            <div className="col-12 px-1">
                                                <NbButton id={"btnUp"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%"}}
                                                onClick={()=>
                                                {
                                                    if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
                                                    {
                                                        let tmpRowIndex = this.grdList.devGrid.getRowIndexByKey(this.grdList.devGrid.getSelectedRowKeys()[0]);
                                                        if(tmpRowIndex > 0)
                                                        {
                                                            this.grdList.devGrid.selectRowsByIndexes(tmpRowIndex - 1)
                                                            this.grdList.devGrid.navigateToRow(this.grdList.devGrid.getSelectedRowKeys()[0])
                                                        }
                                                    }
                                                }}>
                                                    <i className="text-white fa-solid fa-arrow-up" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                        {/* Down */}
                                        <div className="row">
                                            <div className="col-12 px-1">
                                                <NbButton id={"btnDown"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%"}}
                                                onClick={()=>
                                                {
                                                    if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
                                                    {
                                                        let tmpRowIndex = this.grdList.devGrid.getRowIndexByKey(this.grdList.devGrid.getSelectedRowKeys()[0]);
                                                        if(tmpRowIndex < (this.grdList.devGrid.totalCount() - 1))
                                                        {
                                                            this.grdList.devGrid.selectRowsByIndexes(tmpRowIndex + 1)
                                                            this.grdList.devGrid.navigateToRow(this.grdList.devGrid.getSelectedRowKeys()[0])
                                                        }
                                                    }
                                                }}>
                                                    <i className="text-white fa-solid fa-arrow-down" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                        {/* Delete */}
                                        <div className="row">                                            
                                            <div className="col-12 px-1">
                                                <NbButton id={"btnDelete"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"70px",width:"100%"}}
                                                onClick={async()=>
                                                {
                                                    let tmpAcsVal = this.acsObj.filter({ID:'btnFullDelete',TYPE:2,USERS:this.user.CODE})
                                        
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
                                        </div>
                                        {/* Line Delete */}
                                        <div className="row">                                            
                                            <div className="col-12 px-1">
                                                <NbButton id={"btnLineDelete"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"70px",width:"100%"}}
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
                                        </div>
                                    </div>
                                    <div className="col-10">
                                        <NbPluButtonGrp id="pluBtnGrp" parent={this} 
                                        onSelection={(pItem)=>
                                        {
                                            this.getItem(this.txtBarcode.value + pItem)
                                        }}/>
                                    </div>
                                </div>  
                                {/* Line 5 */}
                                <div className="row px-2">
                                    {/* Item Return */}
                                    <div className="col px-1">
                                        <NbButton id={"btnItemReturn"} parent={this} className="form-group btn btn-block my-1" style={{height:"70px",width:"100%",backgroundColor:"#e84393"}}
                                        onClick={async ()=>
                                        {
                                            let tmpAcsVal = this.acsObj.filter({ID:'btnReturnEntry',TYPE:2,USERS:this.user.CODE})
                                        
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
                                                })                                                
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-retweet" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Order List */}
                                    <div className="col px-1">
                                        <NbButton id={"btnOrderList"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}
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
                                                        "FROM DOC_ORDERS_VW_01 WHERE TYPE = 1 AND CLOSED < 2 GROUP BY REF,REF_NO,DOC_DATE,INPUT_CODE,INPUT_NAME,DOC_GUID ",
                                            }
                                            await tmpOrderList.refresh()
                                            await this.grdPopOrderList.dataRefresh({source:tmpOrderList});
                                            this.popOrderList.show();
                                        }}>
                                            <i className="text-white fa-solid fa-business-time" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                </div>
                                {/* Line 6 */}
                                <div className="row px-2">
                                    {/* Diffrent Price */}
                                    <div className="col px-1">
                                        <NbButton id={"btnPriceDiff"} parent={this} className="form-group btn btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt",backgroundColor:"#e84393"}}
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
                                    {/* Grid List */}
                                    <div className="col px-1">
                                        <NbButton id={"btnGrdList"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}
                                        onClick={async()=>
                                        {          
                                            await this.grdPopGrdList.dataRefresh({source:this.posObj.posSale.dt()});
                                            this.popGridList.show();
                                        }}>
                                            <i className="text-white fa-solid fa-bars" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                </div>
                                {/* Line 7 */}
                                <div className="row px-2">
                                    {/* Park List */}
                                    <div className="col px-1">
                                        <NbButton id={"btnParkList"} parent={this} className="form-group btn btn-warning btn-block my-1" style={{height:"70px",width:"100%"}}
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
                                    {/* Subtotal */}
                                    <div className="col px-1">
                                        <NbButton id={"btnSubtotal"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {
                                            let tmpData = this.posObj.posSale.dt().where({SUBTOTAL:0})
                                            let tmpMaxSub = this.posObj.posSale.dt().where({SUBTOTAL:{'<>':-1}}).max('SUBTOTAL') + 1
                                            for (let i = 0; i < tmpData.length; i++) 
                                            {
                                                tmpData[i].SUBTOTAL = tmpMaxSub
                                            }
                                            this.calcGrandTotal()
                                        }}>
                                            <i className="text-white fa-solid fa-square-root-variable" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Customer Add */}
                                    <div className="col px-1">
                                        <NbButton id={"btnCustomerAdd"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}
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
                                    {/* Formation */}
                                    <div className="col px-1">
                                        <NbButton id={"btnFormation"} parent={this} className={this.state.isFormation == false ? "form-group btn btn-info btn-block my-1" : "form-group btn btn-danger btn-block my-1"} style={{height:"70px",width:"100%",fontSize:"18pt",color:"white"}}
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
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Offline */}
                                    <div className="col px-1">
                                        <NbButton id={"btnOffline"} parent={this} className={this.state.isConnected == false ? "form-group btn btn-danger btn-block my-1" : "form-group btn btn-success btn-block my-1"} style={{height:"70px",width:"100%",fontSize:"10pt"}}
                                        onClick={()=>
                                        {
                                            this.popTransfer.show()
                                        }}>
                                            <i className="text-white fa-solid fa-signal" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                                {/* Line 8 */}
                                <div className="row px-2">
                                    {/* Park */}
                                    <div className="col px-1">
                                        <NbButton id={"btnPark"} parent={this} className="form-group btn btn-warning btn-block my-1" style={{height:"70px",width:"100%"}}
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
                                    {/* Get Customer */}
                                    <div className="col px-1">
                                        <NbButton id={"btnGetCustomer"} parent={this} className={this.state.isBtnGetCustomer == true ? "form-group btn btn-danger btn-block my-1" : "form-group btn btn-info btn-block my-1"} style={{height:"70px",width:"100%"}}
                                        onClick={async ()=>
                                        {
                                            if(this.state.isBtnGetCustomer)
                                            {
                                                this.setState({isBtnGetCustomer:false})                                                
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
                                                            this.setState({isBtnGetCustomer:false})
                                                            return
                                                        }
                                                    }

                                                    this.setState({isBtnGetCustomer:true})
                                                }
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-circle-user" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Print */}
                                    <div className="col px-1">
                                        <NbButton id={"btnPrint"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
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
                                    {/* Advance */}
                                    <div className="col px-1">
                                        <NbButton id={"btnAdvance"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
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
                                    {/* Customer List */}
                                    <div className="col px-1">
                                        <NbButton id={"btnCustomerList"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                             
                                            this.popCustomerList.show();
                                        }}>
                                            <i className="text-white fa-solid fa-users" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Calculator */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnCalculator"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.Calculator.show();
                                        }}>
                                            <i className="text-white fa-solid fa-calculator" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>       
                            </div>
                        </div>
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
                                        <p className="text-primary text-start m-0">{this.lang.t("remainder")} <span className="text-dark">{Number(parseFloat(this.state.payRest).toFixed(2)).currency()} </span></p>    
                                    </div>
                                    <div className="col-4">
                                        <p className="text-primary text-start m-0">{this.lang.t("moneyChange")} <span className="text-dark">{Number(parseFloat(this.state.payChange).toFixed(2)).currency()}</span></p>    
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    {/* Payment Type Selection */}
                                    <div className="col-2 pe-1">
                                        <NbRadioButton id={"rbtnPayType"} parent={this} 
                                        button={
                                            [
                                                {
                                                    id:"btn01",
                                                    style:{height:'66px',width:'100%'},
                                                    icon:"fa-money-bill-1",
                                                    text:"ESC"
                                                },
                                                {
                                                    id:"btn02",
                                                    style:{height:'66px',width:'100%'},
                                                    icon:"fa-credit-card",
                                                    text:"CB"
                                                },
                                                {
                                                    id:"btn03",
                                                    style:{height:'66px',width:'100%'},
                                                    icon:"fa-rectangle-list",
                                                    text:"CHQ"
                                                }
                                            ]
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
                                    </div>
                                </div>
                                <div className="row pt-1">
                                    {/* Number Board */}
                                    <div className="col-6">
                                        <NbNumberboard id={"numPopTotal"} parent={this} textobj="txtPopTotal" span={1} buttonHeight={"60px"}/>
                                    </div>
                                    <div className="col-6">
                                        <div className="row pb-1">
                                            {/* T.R Detail */}
                                            <div className="col-6">
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
                                                                from : "CHEQPAY_VW_01",
                                                                where : {DOC : this.posObj.dt()[0].GUID},
                                                                aggregate:{count: "AMOUNT"},
                                                                groupBy: "AMOUNT",
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
                                            {/* 10 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash10"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/10€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,10)}}/>
                                            </div>
                                        </div>
                                        <div className="row py-1">
                                            {/* Line Delete */}
                                            <div className="col-6">
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
                                            {/* 20 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash20"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/20€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,20)}}/>
                                            </div>
                                        </div>
                                        <div className="row py-1">
                                            {/* Cancel */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCancel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={()=>{this.popTotal.hide()}}>
                                                    {this.lang.t("cancel")}
                                                </NbButton>
                                            </div>
                                            {/* 50 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash50"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/50€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,50)}}/>
                                            </div>
                                        </div>
                                        <div className="row py-1">
                                            {/* Okey */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalOkey"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={()=>
                                                {
                                                    this.payAdd(this.rbtnPayType.value,this.txtPopTotal.value);
                                                    this.txtPopTotal.newStart = true;
                                                }}>
                                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                            {/* 100 € */}
                                            <div className="col-6">
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
                                        <p className="text-primary text-start m-0">{this.lang.t("total")} <span className="text-dark"><NbLabel id="popCardTotalGrand" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">{this.lang.t("remainder")} <span className="text-dark">{Number(parseFloat(this.state.payRest).toFixed(2)).currency()}</span></p>    
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
                                        <p className="text-primary text-start m-0">{this.lang.t("remainder")} <span className="text-dark">{Number(parseFloat(this.state.payRest).toFixed(2)).currency()}</span></p>
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
                    data={{source:
                    {
                        select:
                        {
                            query : "SELECT GUID,CUSTOMER_TYPE,CODE,TITLE,ADRESS,ZIPCODE,CITY,COUNTRY_NAME,dbo.FN_CUSTOMER_TOTAL_POINT(GUID,GETDATE()) AS CUSTOMER_POINT, " +
                                    "ISNULL((SELECT COUNT(TYPE) FROM CUSTOMER_POINT WHERE TYPE = 0 AND CUSTOMER = CUSTOMER_VW_02.GUID AND CONVERT(DATE,LDATE) = CONVERT(DATE,GETDATE())),0) AS POINT_COUNT " + 
                                    "FROM [dbo].[CUSTOMER_VW_02] WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
                            param : ['VAL:string|50'],
                            local : 
                            {
                                type : "select",
                                from : "CUSTOMER_VW_02",
                                where : 
                                {
                                    CODE : { like : '{0}'},
                                    or: 
                                    {
                                        TITLE: { like : '{0}'}
                                    }
                                },
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
                            //PROMOSYON GETİR.
                            await this.getPromoDb()
                            this.promoApply()
                            //************************************************** */
                            this.calcGrandTotal(false);
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
                    data={{source:
                    {
                        select:
                        {
                            query : "SELECT CODE,NAME,dbo.FN_PRICE_SALE(GUID,1,GETDATE(),@CUSTOMER) AS PRICE FROM [dbo].[ITEMS_VW_01] WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) AND STATUS = 1",
                            param : ['VAL:string|50','CUSTOMER:string|50'],
                            local : 
                            {
                                type : "select",
                                from : "ITEMS_VW_01",
                                where : 
                                {
                                    CODE : { like : "{0}"},
                                    or: 
                                    {
                                        NAME: { like : "{0}"}
                                    }
                                },
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
                                    <Column dataField="PRICE_SALE" caption={this.lang.t("grdgrdBarcodeListList.PRICE_SALE")} width={100} format={"#,##0.00" + Number.money.sign}/>
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
                                allowColumnReordering={true} 
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
                                    <Column dataField="LDATE" caption={this.lang.t("grdPopParkList.LDATE")} width={150} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"} />
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
                                                    PRICE: Number(items.PRICE).toFixed(2),
                                                    QUANTITY: Number(items.QUANTITY).toFixed(2),
                                                    SALE_JOIN_LINE: true,
                                                    SNAME: items.ITEM_NAME,
                                                    SPECIAL: "",
                                                    STATUS: true,
                                                    TICKET_REST: true,
                                                    UNIQ_CODE: "",
                                                    UNIQ_PRICE: 0,
                                                    UNIQ_QUANTITY: 0,
                                                    UNIT_FACTOR: items.UNIT_FACTOR == 0 ? 1 : items.UNIT_FACTOR,
                                                    UNIT_GUID: items.UNIT,
                                                    UNIT_ID: "",
                                                    UNIT_NAME: items.UNIT_NAME,
                                                    UNIT_SHORT: items.UNIT_SHORT,
                                                    VAT: items.VAT,
                                                    VAT_TYPE: "",
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
                                    <Column dataField="CODE" alignment={"center"} caption={this.lang.t("grdPopCheqpayList.CODE")} width={550} />
                                    <Column dataField="AMOUNT" alignment={"center"} caption={this.lang.t("grdPopCheqpayList.AMOUNT")} width={100} format={"#,##0.00" + Number.money.sign}/>
                                </NdGrid>
                            </div>
                        </div>
                        {/* Last Read */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">{this.lang.t("lastRead")} <span className="text-dark">{Number(parseFloat(this.state.cheqLastAmount).toFixed(2)).currency()}</span></h3>    
                            </div>
                        </div>
                        {/* Total Read */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">{this.lang.t("totalRead")} <span className="text-dark">{Number(parseFloat(this.state.cheqTotalAmount).toFixed(2)).currency()}</span></h3>    
                            </div>
                        </div>
                        {/* Rest */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">{this.lang.t("remainderPay")} <span className="text-dark">{Number(parseFloat(this.state.payRest).toFixed(2)).currency()}</span></h3>    
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
                                        e.cellElement.innerHTML  = tmpVal.toFixed(2) + " %"
                                    }
                                    else if(e.rowType == 'data' && e.column.index == 5)
                                    {
                                        let tmpVal = Number(parseFloat((e.data.AMOUNT - e.data.DISCOUNT) / e.data.QUANTITY).toFixed(2))
                                        e.value = tmpVal
                                        e.text = tmpVal
                                        e.displayValue = tmpVal
                                        e.cellElement.innerHTML  = Number(tmpVal.toFixed(2)).currency()
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
                            <div className="col-6">
                                <NbButton id={"btnPopDiscountRate"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"50px",width:"100%"}}
                                onClick={async ()=>
                                {
                                    if(this.grdDiscList.getSelectedData().length > 0)
                                    {
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
                                            
                                            this.grdDiscList.getSelectedData()[i].FAMOUNT = tmpCalc.FAMOUNT
                                            this.grdDiscList.getSelectedData()[i].AMOUNT = tmpCalc.AMOUNT
                                            this.grdDiscList.getSelectedData()[i].DISCOUNT = tmpDiscount
                                            this.grdDiscList.getSelectedData()[i].VAT = tmpCalc.VAT
                                            this.grdDiscList.getSelectedData()[i].TOTAL = tmpCalc.TOTAL
                                        }
                                        await this.calcGrandTotal();
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
                            <div className="col-6">
                                <NbButton id={"btnPopDiscountAmount"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"50px",width:"100%"}}
                                onClick={async ()=>
                                {
                                    if(this.grdDiscList.getSelectedData().length > 0)
                                    {
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
                                        await this.calcGrandTotal();
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
                                    <div>İndirim Uygula ({Number.money.sign})</div>
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
                                    this.popCustomerPointToEuro.value = Number(parseFloat(e.value / 100).toFixed(2)).toString()
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
                                                                        
                                    if(Number(parseFloat(Number(this.txtPopLoyalty.value) / 100).toFixed(2)) > this.posObj.dt()[0].TOTAL)
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

                                    let tmpLoyalty = Number(parseFloat(this.txtPopLoyalty.value / 100).toFixed(2))
                                    let tmpLoyaltyRate = Number(this.posObj.dt()[0].AMOUNT - this.posObj.dt()[0].DISCOUNT).rate2Num(tmpLoyalty)

                                    for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
                                    {                                        
                                        let tmpData = this.posObj.posSale.dt()[i]
                                        let tmpRowLoyalty = Number(tmpData.AMOUNT - tmpData.DISCOUNT).rateInc(tmpLoyaltyRate,2)
                                        let tmpCalc = this.calcSaleTotal(tmpData.PRICE,tmpData.QUANTITY,tmpData.DISCOUNT,tmpRowLoyalty,tmpData.VAT_RATE)
                                        
                                        this.posObj.posSale.dt()[i].FAMOUNT = tmpCalc.FAMOUNT
                                        this.posObj.posSale.dt()[i].AMOUNT = tmpCalc.AMOUNT
                                        this.posObj.posSale.dt()[i].DISCOUNT = tmpCalc.DISCOUNT
                                        this.posObj.posSale.dt()[i].LOYALTY = tmpRowLoyalty
                                        this.posObj.posSale.dt()[i].VAT = tmpCalc.VAT
                                        this.posObj.posSale.dt()[i].TOTAL = tmpCalc.TOTAL
                                    }

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
                            <div className="offset-10 col-2">
                                <div className="row px-2">
                                    {/* btnPopLastSaleTRest */}
                                    <div className="col-4 p-1">
                                        <NbButton id={"btnPopLastSaleTRest"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}
                                        onClick={async ()=>
                                        {
                                            let tmpResult = await this.popNumber.show('Miktar',0)
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
                                                            let tmpLastSignature = await this.nf525.signatureDuplicate(tmpLastPos[0].GUID)
                                                            let tmpInsertQuery = 
                                                            {
                                                                query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                                                                        "@CUSER = @PCUSER, " + 
                                                                        "@TAG = @PTAG, " +
                                                                        "@POS_GUID = @PPOS_GUID, " +
                                                                        "@LINE_GUID = @PLINE_GUID, " +
                                                                        "@DATA = @PDATA, " +
                                                                        "@APP_VERSION =@PAPP_VERSION, " +
                                                                        "@DESCRIPTION = @PDESCRIPTION ", 
                                                                param : ['PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|250','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                                                                value : [tmpLastPos[0].CUSER,"REPRINT",tmpLastPos[0].GUID,"00000000-0000-0000-0000-000000000000",tmpLastSignature,this.core.appInfo.version,tmpRePrintResult]
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
                                                                    customerGrowPoint : tmpLastPos[0].CUSTOMER_POINT - Math.floor(tmpLastPos[0].TOTAL)
                                                                }
                                                            }
                                                            await this.print(tmpData)
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
                                    <div className="col-4 p-1">
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
                                                        reprint : 1,
                                                        repas : 0,
                                                        customerUsePoint : Math.floor(tmpLastPos[0].LOYALTY * 100),
                                                        customerPoint : (tmpLastPos[0].CUSTOMER_POINT + Math.floor(tmpLastPos[0].LOYALTY * 100)) - Math.floor(tmpLastPos[0].TOTAL),
                                                        customerGrowPoint : tmpLastPos[0].CUSTOMER_POINT - Math.floor(tmpLastPos[0].TOTAL)
                                                    }
                                                }
                                                await this.print(tmpData)
                                            }
                                            
                                        }}>
                                            <i className="text-white fa-solid fa-file-lines" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                    {/* btnPopLastSalePrint */}
                                    <div className="col-4 p-1">
                                        <NbButton id={"btnPopLastSalePrint"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}
                                        onClick={async()=>
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
                                                
                                                if(tmpPrintCount < 5)
                                                {
                                                    let tmpRePrintResult = await this.popRePrintDesc.show()

                                                    if(typeof tmpRePrintResult != 'undefined')
                                                    {
                                                        let tmpLastSignature = await this.nf525.signatureDuplicate(tmpLastPos[0].GUID)
                                                        let tmpInsertQuery = 
                                                        {
                                                            query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                                                                    "@CUSER = @PCUSER, " + 
                                                                    "@TAG = @PTAG, " +
                                                                    "@POS_GUID = @PPOS_GUID, " +
                                                                    "@LINE_GUID = @PLINE_GUID, " +
                                                                    "@DATA =@PDATA, " +
                                                                    "@APP_VERSION =@PAPP_VERSION, " +
                                                                    "@DESCRIPTION = @PDESCRIPTION ", 
                                                                    param : ['PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|250','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                                                            value : [tmpLastPos[0].CUSER,"REPRINT",tmpLastPos[0].GUID,"00000000-0000-0000-0000-000000000000",tmpLastSignature,this.core.appInfo.version,tmpRePrintResult]
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
                                                                type : 'Fis',
                                                                ticketCount : 0,
                                                                reprint : tmpPrintCount + 1,
                                                                repas : 0,
                                                                customerUsePoint : Math.floor(tmpLastPos[0].LOYALTY * 100),
                                                                customerPoint : (tmpLastPos[0].CUSTOMER_POINT + Math.floor(tmpLastPos[0].LOYALTY * 100)) - Math.floor(tmpLastPos[0].TOTAL),
                                                                customerGrowPoint : tmpLastPos[0].CUSTOMER_POINT - Math.floor(tmpLastPos[0].TOTAL)
                                                            }
                                                        }

                                                        this.sendJet({CODE:"155",NAME:"Duplicata imprimé."}) //// Duplicate fiş yazdırıldı.
                                                        await this.print(tmpData)
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
                                data={{source:[{ID:-1,NAME:"Tümü"},{ID:0,NAME:"Espece"},{ID:1,NAME:"Carte Bancaire TPE"},{ID:2,NAME:"Cheque"},{ID:3,NAME:"CHEQue"},{ID:4,NAME:"Bon D'Avoir"}]}}/>
                            </div>
                            {/* cmbPopLastSaleUser */} 
                            <div className="col-2">
                                <NdSelectBox simple={true} parent={this} id="cmbPopLastSaleUser" displayExpr={'NAME'} valueExpr={'CODE'}
                                data={{source:{select:{query : "SELECT '' AS CODE,'ALL' AS NAME UNION ALL SELECT CODE,NAME FROM USERS"},sql:this.core.sql}}}/>
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
                                }}>     
                                </NdTextBox> 
                            </div>
                            {/* btnPopLastSaleSearch */} 
                            <div className="col-2">
                                <NbButton id={"btnPopLastSaleSearch"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"36px",width:"100%"}}
                                onClick={async()=>
                                {
                                    if(this.txtPopLastRef.value == "")
                                    {
                                        this.lastPosDt.selectCmd = 
                                        {
                                            query:  "SELECT *, " +
                                                    "SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,36) AS REF_NO " + 
                                                    "FROM POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01 WHERE DOC_DATE >= @START_DATE AND DOC_DATE <= @FINISH_DATE AND " +
                                                    "((ISNULL((SELECT TOP 1 1 FROM POS_PAYMENT AS PAY WHERE PAY.POS = POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01.GUID AND TYPE = @TYPE AND DELETED = 0),0) = 1) OR (@TYPE = -1)) AND " + 
                                                    "((LUSER = @USER) OR (@USER = '')) AND STATUS = 1 ORDER BY LDATE DESC",
                                            param:  ["START_DATE:date","FINISH_DATE:date","TYPE:int","USER:string|25"],
                                            value:  [this.dtPopLastSaleStartDate.value,this.dtPopLastSaleFinishDate.value,this.cmbPopLastSalePayType.value,this.cmbPopLastSaleUser.value]
                                        }
                                    }
                                    else
                                    {
                                        this.lastPosDt.selectCmd = 
                                        {
                                            query:  "SELECT *, " +
                                                    "SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,36) AS REF_NO " + 
                                                    "FROM POS_" + (this.state.isFormation ? 'FRM_' : '') + "VW_01 WHERE SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,36) = @REF AND STATUS = 1",
                                            param:  ["REF:string|25"],
                                            value:  [this.txtPopLastRef.value]
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
                                                    "@LINE_NO = @PLINE_NO, " +
                                                    "@AMOUNT = @PAMOUNT, " + 
                                                    "@CHANGE = @PCHANGE ", 
                                            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
                                            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
                                        } 
                                        this.lastPosPayDt.updateCmd = 
                                        {
                                            query : "EXEC [dbo].[PRD_POS_PAYMENT_UPDATE] " + 
                                                    "@GUID = @PGUID, " +
                                                    "@CUSER = @PCUSER, " + 
                                                    "@POS = @PPOS, " +
                                                    "@TYPE = @PTYPE, " +
                                                    "@LINE_NO = @PLINE_NO, " +
                                                    "@AMOUNT = @PAMOUNT, " + 
                                                    "@CHANGE = @PCHANGE ", 
                                            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
                                            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
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
                                    <Column dataField="LDATE" caption={this.lang.t("grdLastPos.LDATE")} width={150} alignment={"center"} dataType={"datetime"} format={"dd-MM-yyyy - HH:mm:ss"}/>
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
                                        this.lastPayRest.value = this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT') < 0 ? 0 : Number(this.lastPosSaleDt[0].GRAND_TOTAL).toFixed(2) - Number(this.lastPosPayDt.sum('AMOUNT')).toFixed(2)
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
                                        button={[
                                            {
                                                id:"btn01",
                                                style:{height:'49px',width:'100%'},
                                                icon:"fa-money-bill-1",
                                                text:"ESC"
                                            },
                                            {
                                                id:"btn02",
                                                style:{height:'49px',width:'100%'},
                                                icon:"fa-credit-card",
                                                text:"CB"
                                            },
                                            {
                                                id:"btn03",
                                                style:{height:'49px',width:'100%'},
                                                icon:"fa-rectangle-list",
                                                text:"CHQ"
                                            },
                                            {
                                                id:"btn04",
                                                style:{height:'49px',width:'100%'},
                                                icon:"fa-rectangle-list",
                                                text:"CHQe"
                                            }
                                        ]}/>
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
                                                    if(this.lastPosPayDt.where({PAY_TYPE:4}).length > 0)
                                                    {
                                                        let tmpDt = new datatable(); 
                                                        tmpDt.selectCmd = 
                                                        {
                                                            query : "SELECT AMOUNT AS AMOUNT,COUNT(AMOUNT) AS COUNT FROM CHEQPAY_VW_01 WHERE DOC = @DOC GROUP BY AMOUNT",
                                                            param : ['DOC:string|50'],
                                                            local : 
                                                            {
                                                                type : "select",
                                                                from : "CHEQPAY_VW_01",
                                                                where : {DOC : this.lastPosPayDt[0].POS_GUID},
                                                                aggregate:{count: "AMOUNT"},
                                                                groupBy: "AMOUNT",
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
                                                        this.lastPayRest.value = this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT') < 0 ? 0 : Number(this.lastPosSaleDt[0].GRAND_TOTAL).toFixed(2) - Number(this.lastPosPayDt.sum('AMOUNT')).toFixed(2)
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
                                                    let tmpAmount = Number(parseFloat(this.txtPopLastTotal.value).toFixed(2))
                                                    let tmpChange = Number(parseFloat(this.lastPosSaleDt[0].GRAND_TOTAL - (this.lastPosPayDt.sum('AMOUNT') + tmpAmount)).toFixed(2))

                                                    if(this.rbtnTotalPayType.value == 0)
                                                    {                                                        
                                                        tmpTypeName = "ESC"
                                                    }
                                                    else if(this.rbtnTotalPayType.value == 1)
                                                    {
                                                        tmpTypeName = "CB"
                                                    }
                                                    else if(this.rbtnTotalPayType.value == 2)
                                                    {
                                                        tmpTypeName = "CHQ"
                                                    }
                                                    else if(this.rbtnTotalPayType.value == 3)
                                                    {
                                                        tmpTypeName = "T.R"
                                                    }
                                                    else if(this.rbtnTotalPayType.value == 4)
                                                    {
                                                        tmpTypeName = "BON D'AVOIR"
                                                    }
                                                        
                                                    if(tmpChange < 0)
                                                    {
                                                        if(this.rbtnTotalPayType.value == 0)
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
                                                        this.lastPayRest.value = this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT') < 0 ? 0 : Number(this.lastPosSaleDt[0].GRAND_TOTAL).toFixed(2) - Number(this.lastPosPayDt.sum('AMOUNT')).toFixed(2)
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
                        if(typeof e != 'undefined')
                        {
                            if(typeof this.acsObj.filter({ID:'PriceEdit',TYPE:1}).getValue().dialog != 'undefined' && this.acsObj.filter({ID:'PriceEdit',TYPE:1}).getValue().dialog.type != -1)
                            {   
                                let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:this.acsObj.filter({ID:'PriceEdit',TYPE:1}).getValue().dialog.type})
                                if(!tmpResult)
                                {
                                    return
                                }
                            }
                            
                            let tmpResult = await this.popNumber.show('Fiyat',this.grdList.devGrid.getSelectedRowKeys()[0].PRICE)                                            
                            if(typeof tmpResult != 'undefined' && tmpResult != '')
                            {
                                await this.descSave("PRICE DESC",e,this.grdList.devGrid.getSelectedRowKeys()[0].GUID,this.grdList.devGrid.getSelectedRowKeys()[0].PRICE)                                
                                if((await this.priceCheck(this.grdList.devGrid.getSelectedRowKeys()[0],tmpResult)))
                                {
                                    let tmpData = {QUANTITY:this.grdList.devGrid.getSelectedRowKeys()[0].QUANTITY,PRICE:Number(tmpResult)}
                                    this.saleRowUpdate(this.grdList.devGrid.getSelectedRowKeys()[0],tmpData)
                                }
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
                        this.delete()
                    }}></NbPopDescboard>
                </div>
                {/* Row Delete Description Popup */} 
                <div>
                    <NbPopDescboard id={"popRowDeleteDesc"} parent={this} width={"900"} height={"700"} position={"#root"} head={this.lang.t("popRowDeleteDesc.head")} title={this.lang.t("popRowDeleteDesc.title")}         
                    param={this.prmObj.filter({ID:'DocRowDelDescription',TYPE:0})}
                    onClick={async (e)=>
                    {
                        this.sendJet({CODE:"323",NAME:"Ligne supprimé sur ticket en attente.",DESCRIPTION:e})  //// Beklemedeki fiş satırı silindi.
                        if(typeof e != 'undefined')
                        {
                            await this.descSave("ROW DELETE",e,this.grdList.devGrid.getSelectedRowKeys()[0].GUID)
                        }
                        this.rowDelete()
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
                            this.sendJet({CODE:"326",NAME:"İade alınd.",DESCRIPTION:e})

                            let tmpResult = await this.msgItemReturnType.show();
                        
                            if(tmpResult == 'btn01') //Nakit
                            {
                                this.posObj.posPay.addEmpty()
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE = 0
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE_NAME = 'ESC'
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].LINE_NO = this.posObj.posPay.dt().length
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = Number(parseFloat(this.posObj.dt()[0].TOTAL).toFixed(2))
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = 0
                            }
                            else if(tmpResult == 'btn02') //İade Çeki
                            {
                                this.posObj.posPay.addEmpty()
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE = 4
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE_NAME = "BON D'AVOIR"
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].LINE_NO = this.posObj.posPay.dt().length
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = Number(parseFloat(this.posObj.dt()[0].TOTAL).toFixed(2))
                                this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = 0

                                this.posObj.dt()[0].REBATE_CHEQPAY = 'Q' + new Date().toISOString().substring(2, 10).replace('-','').replace('-','') + Math.round(Number(parseFloat(this.posObj.dt()[0].TOTAL).toFixed(2)) * 100).toString().padStart(5,'0') + Date.now().toString().substring(7,12);

                                await this.cheqpaySave(this.posObj.dt()[0].REBATE_CHEQPAY,this.posObj.dt()[0].TOTAL,0,1);
                            }

                            if(this.txtItemReturnTicket.value != "")
                            {
                                this.posObj.dt()[0].TICKET = this.txtItemReturnTicket.value;
                            }

                            this.posObj.dt()[0].TYPE = 1;
                            this.posObj.dt()[0].TYPE_NAME = 'RETOUR';
                            
                            await this.descSave("REBATE",e,'00000000-0000-0000-0000-000000000000'); 
                        }                

                        await this.calcGrandTotal();
                    }}></NbPopDescboard>
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
                        button={[{id:"btn01",caption:this.lang.t("msgItemReturnTicket.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgItemReturnTicket.btn02"),location:'after'}]}
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
                    button={[{id:"btn01",caption:this.lang.t("msgItemReturnType.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgItemReturnType.btn02"),location:'after'}]}
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
                    title={"Uyarı"} 
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
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCardPayment.msg")}</div>
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
                                    <div className="row"><div className="col-12">ESC</div></div>
                                    <div className="row"><div className="col-12"><i className="text-white fa-solid fa-money-bill-1" style={{fontSize: "24px"}}/></div></div>
                                </NbButton>
                            </div>
                            <div className="col-3 py-2">
                                <NbButton id={"btnMsgRePaymentCB"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"70px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.msgRePaymentType._onClick("btn02")
                                }}>
                                    <div className="row"><div className="col-12">CB</div></div>
                                    <div className="row"><div className="col-12"><i className="text-white fa-solid fa-credit-card" style={{fontSize: "24px"}}/></div></div>                                    
                                </NbButton>
                            </div>
                            <div className="col-3 py-2">
                                <NbButton id={"btnMsgRePaymentCHQ"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"70px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.msgRePaymentType._onClick("btn03")
                                }}>
                                    <div className="row"><div className="col-12">CHQ</div></div>
                                    <div className="row"><div className="col-12"><i className="text-white fa-solid fa-rectangle-list" style={{fontSize: "24px"}} /></div></div>                                    
                                </NbButton>
                            </div>
                            <div className="col-3 py-2">
                                <NbButton id={"btnMsgRePaymentTR"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"70px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.msgRePaymentType._onClick("btn04")
                                }}>
                                    <div className="row"><div className="col-12">T.R</div></div>
                                    <div className="row"><div className="col-12"><i className="text-white fa-solid fa-ticket" style={{fontSize: "24px"}} /></div></div>                                    
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
                    width={"600"}
                    height={"520"}
                    position={{of:"#root"}}
                    >
                        <Form colCount={2} height={'fit-content'} id={"frmSettings"}>
                            <Item>
                                <Label text={"LCD Port"} alignment="right" />
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
                                <Label text={"Scale Port"} alignment="right" />
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
                                <Label text={"Pay Card Port"} alignment="right" />
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
                                <Label text={"Yazdırma Dizayn"} alignment="right" />
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
                        </Form>
                        <div className="row py-1">
                            <div className="col-12">
                                <NbKeyboard id={"keyPopSettings"} parent={this} inputName={"txtPopSettingsLcd"}/>
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
                                            let tmpResult = await this.popNumber.show('Miktar',Number(e.value) / Number(e.key.UNIT_FACTOR))
                                                                                        
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
                                    <Column dataField="ITEM_SNAME" caption={this.lang.t("grdList.ITEM_NAME")} width={290}/>
                                    <Column dataField="QUANTITY" caption={this.lang.t("grdList.QUANTITY")} width={50}/>
                                    <Column dataField="PRICE" caption={this.lang.t("grdList.PRICE")} width={70} format={"#,##0.00" + Number.money.sign}/>
                                    <Column dataField="AMOUNT" alignment={"right"} caption={this.lang.t("grdList.AMOUNT")} width={60} format={"#,##0.00" + Number.money.sign}/>                                                
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
                            <div className="col-6">
                                <NbButton id={"btnPopTransferManuel"} parent={this} className="form-group btn btn-success btn-block" style={{height:"50px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.transferStop();
                                    this.transferStart(1)
                                }}>
                                    {this.lang.t("popTransfer.btnPopTransferManuel")}
                                </NbButton>
                            </div>
                            {/* btnPopTransferStop */}
                            <div className="col-6">
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
                                <h3 className="text-center">{this.state.msgTransfer1}</h3>
                            </div>
                        </div>
                        {/* msg1 */}
                        <div className="row">
                            <div className="col-12">
                                <h3 className="text-center">{this.state.msgTransfer2}</h3>
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
                                        }}/>
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
                                        }}/>
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
                                        }}/>
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
                                        }}/>
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
                                        }}/>
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
                                <NbKeyboard id={"keyPopCustomerAdd"} parent={this} inputName={"txtPopCustomerCode"}/>
                            </div>
                        </div>                        
                    </NdPopUp>
                </div>
                {/* Customer Add List Popup */}
                <div>
                    <NbPosPopGrid id={"popCustomerAddList"} parent={this} width={"100%"} height={"100%"} position={"#root"} title={this.lang.t("popCustomerAddList.title")}
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
            </div>
        )
    }
}