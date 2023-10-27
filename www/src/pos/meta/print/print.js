import moment from "moment";
//data.pos
//data.possale
//data.pospay
//data.firm = Firma bilgileri
//data.special.type = 'Fatura'
//data.special.safe = 'Kasa Kodu'
//data.special.ticketCount = 'Günlük Ticket Sayısı'
//data.special.reprint = 1 Tekrar yazdırma sayısı
//data.special.factCertificate = 'Fatura sertifika bilgisi' 
//data.special.dupCertificate = 'Duplicate sertifika bilgisi' 
//data.special.repas = 'TxtRepasMiktar'
//data.special.customerUsePoint = 'Müşteri Kullanılan Puanı'
//data.special.customerPoint = 'Müşteri Puanı'
//data.special.customerGrowPoint = 'Müşteri Kalan Puanı'

export function print()
{
    let data = arguments.length > 0 ? arguments[0] : undefined;

    if(typeof data == 'undefined')
        return []
    
    let decimal = function()
    {
        return new Intl.NumberFormat('de', { style: 'decimal',minimumIntegerDigits: 1,minimumFractionDigits: 2,maximumFractionDigits: 3}).format(arguments[0])
    }

    return [
        {align:"ct",logo:"./resources/logop.png"},
        ()=>{return {font:"a",style:"b",align:"ct",data:""}},
        // ÜST BİLGİ
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].ADDRESS1 : "7 ALLEE DU MIDI"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].ZIPCODE + " " + data.firm[0].CITY + " " + data.firm[0].COUNTRY_NAME : "54270 ESSEY LES NANCY FRANCE"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? "Tel : " + data.firm[0].TEL : "Tel : 03 83 52 62 34"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].MAIL : "info@piqsoft.fr"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].WEB : "www.piqsoft.fr"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? "Siret " + data.firm[0].SIRET_ID + " - APE " + data.firm[0].APE_CODE : "Siret 94 929 096 900 011 - APE 6201Z"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? "Nr. TVA " + data.firm[0].INT_VAT_NO : "Nr. TVA FR61949290969"}},
        ()=>
        {       
            let tmpArr = []
            if(data.special.type == 'Fatura')
            {
                tmpArr.push({font:"a",align:"ct",data:"------------------------------------------------"})
                tmpArr.push({font:"a",align:"ct",data:"FACTURE A"})
                tmpArr.push({font:"a",align:"ct",data:"------------------------------------------------"})
                tmpArr.push({font:"a",style:"b",align:"ct",data: " ".space(64)})
                tmpArr.push({font:"a",style:"b",align:"lt",data: data.pos[0].CUSTOMER_NAME.toString().substring(0,48)})
                tmpArr.push({font:"a",style:"b",align:"lt",data: data.pos[0].CUSTOMER_ADRESS.toString().substring(0,48)})
                tmpArr.push({font:"a",style:"b",align:"lt",data: data.pos[0].CUSTOMER_ZIPCODE.toString().substring(0,5) + " - " + data.pos[0].CUSTOMER_CITY.toString().substring(0,48)})
                tmpArr.push({font:"a",style:"b",align:"lt",data: data.pos[0].CUSTOMER_COUNTRY.toString().substring(0,48)})
                tmpArr.push({font:"a",style:"b",align:"ct",data: " ".space(64)})
            }   
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        ()=>{return {font:"b",align:"lt",pdf:{fontSize:11},data:moment(new Date(data.pos[0].LDATE).toISOString()).utcOffset(0,false).locale('fr').format('dddd DD.MM.YYYY HH:mm:ss')}},
        ()=>{return {font:"b",align:"lt",pdf:{fontSize:11},data:("Caissier: " + data.pos[0].CUSER).space(32,'e') + ("Caisse: " + data.pos[0].DEVICE).space(30,'s')}},
        //FIS NO BARKODU
        ()=>{return {align:"ct",barcode:data.pos[0].GUID.substring(19,36),options:{width: 1,height:40,position:'OFF'}}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"****** Numero de Ticket De Caisse ******"}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"****** " + data.pos[0].REF + " ******"}},
        ()=>{return {font:"b",align:"lt",data:" ".space(64)}},
        ()=>
        {
            if(data.special.reprint > 1)
            {
                return {font:"b",style:"b",align:"ct",data: "DUPLICATA"}
            }   
            return
        },
        ()=>
        {
            if(data.pos[0].DEVICE == '9999')
            {
                return {font:"b",size : [1,1],style:"bu",align:"ct",data: "FORMATION"}
            }   
            return
        },
        ()=>
        {
            let tmpArr = []
            if(data.pos[0].TYPE == 0 && data.special.type != 'Fatura')
            {
                tmpArr.push({font:"b",style:"b",align:"ct",data:"TICKET DE VENTE"})
                tmpArr.push({font:"b",style:"b",align:"ct",data: " ".space(64)})
            }
            else if(data.pos[0].TYPE == 0 && data.special.type == 'Fatura')
            {
                tmpArr.push({font:"b",style:"b",align:"ct",data:"FACTURE DE VENTE"})
                tmpArr.push({font:"a",style:"b",align:"ct",data:"Numero De Facture : " + (data.pos[0].DEVICE == '9999' ? "" : data.pos[0].FACT_REF)})
                tmpArr.push({font:"b",style:"b",align:"ct",data: " ".space(64)})
            }
            else if(data.pospay.where({PAY_TYPE:0}).length > 0 && data.pos[0].TYPE == 1)
            {
                tmpArr.push({font:"b",style:"b",size : [1,1],align:"ct",data:"REMBOURSEMENT"})
                tmpArr.push({font:"b",style:"b",align:"ct",data: " ".space(64)})
            }
            else if(data.pospay.where({PAY_TYPE:4}).length > 0)
            {
                tmpArr.push({font:"b",style:"b",size : [1,1],align:"ct",data:"BON D'AVOIR"})
                tmpArr.push({font:"b",style:"b",align:"ct",data: " ".space(64)})
            } 
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        // BAŞLIK 1 (TERAZİ SERTİFİKASI İÇİN)
        ()=>
        {
            let tmpTitle = {}
            if(data.special.type != 'Fatura')
            {
                tmpTitle = {font:"b",style:"b",align:"lt", 
                pdf:{fontSize:8,grid:[{x:3,charS:0,charE:2,align:'left'},{x:6,charS:2,charE:33,align:'left'},{x:70,charS:34,charE:47},{x:80,charS:40,charE:54},{x:93,charS:55,charE:65}]},
                data:"  " + "".space(32) + " " + "".space(8) + " " + "   Prix".space(11) + " " + "  Prix".space(8)}
            }
            else
            {
                tmpTitle = {font:"b",style:"b",align:"lt",
                pdf:{fontSize:8,grid:[{x:3,charS:0,charE:2,align:'left'},{x:6,charS:2,charE:33,align:'left'},{x:70,charS:34,charE:47},{x:80,charS:40,charE:54},{x:93,charS:55,charE:65}]},
                data:"  " + "".space(32) + " " + "".space(8) + " " + "  Prix HT".space(11) + " " + "  Prix".space(8)}
            }
            return tmpTitle
        },
        // BAŞLIK 2
        ()=>
        {
            let tmpTitle = {}
            if(data.special.type != 'Fatura')
            {
                tmpTitle = {font:"b",style:"bu",align:"lt",
                pdf:{fontSize:8,grid:[{x:3,charS:0,charE:2,align:'left'},{x:6,charS:2,charE:33,align:'left'},{x:65,charS:34,charE:47},{x:80,charS:48,charE:55},{x:91,charS:56,charE:66}]},
                data:"T " + "Libelle".space(32) + " " + "Qte".space(8) + " " + "U ou EUR/kg".space(11) + " " + "Prix EUR".space(8)}
            }
            else if(data.special.type == 'Fatura')
            {
                tmpTitle = {font:"b",style:"bu",align:"lt",
                pdf:{fontSize:8,grid:[{x:3,charS:0,charE:2,align:'left'},{x:6,charS:2,charE:33,align:'left'},{x:65,charS:34,charE:47},{x:80,charS:48,charE:55},{x:91,charS:56,charE:66}]},
                data:"T " + "Libelle".space(32) + " " + "Qte".space(8) + " " + "U ou EUR/kg".space(11) + " " + "T.HT EUR".space(8)}
            }
            return tmpTitle
        },
        // SATIŞ LİSTESİ
        ()=>
        {
            let tmpArr = []
            if(data.special.type == 'Repas')
            {
                let tmpPrice = data.possale.sum("AMOUNT",2) / data.special.repas;
            
                tmpArr.push(
                {
                    font: "b",
                    align: "lt",
                    data:   "  " +
                            "Repas complet(s)".space(34) + " " +
                            data.special.repas.space(8,'s') + " " + 
                            tmpPrice.toString().space(7,'s') + " " + 
                            (decimal(data.possale.sum("AMOUNT",2)) + "EUR").space(10,"s")
                });
            }
            else
            {
                //PROMOSYON SATIR GRUPLAMASI
                data.pospromo.groupBy('PROMO_GUID').forEach(proGrp => 
                {
                    let tmpRemise = 0
                    data.pospromo.where({PROMO_GUID:proGrp.PROMO_GUID}).forEach(proItem =>
                    {
                        let tmpProSale = data.possale.where({GUID:proItem.POS_SALE_GUID})                        

                        if(tmpProSale.length > 0)
                        {
                            tmpRemise += tmpProSale[0].DISCOUNT
                            let tmpQt = ""            
                            let tmpFactStr = ""

                            if(Number.isInteger(parseFloat(tmpProSale[0].QUANTITY)))
                            {
                                tmpQt = parseInt(tmpProSale[0].QUANTITY / tmpProSale[0].UNIT_FACTOR);
                            }
                            else
                            {
                                tmpQt = parseFloat(parseFloat(tmpProSale[0].QUANTITY / tmpProSale[0].UNIT_FACTOR).toFixed(3));
                            }

                            if(tmpProSale[0].UNIT_FACTOR > 1)
                            {
                                tmpFactStr = "X" + tmpProSale[0].UNIT_FACTOR.toString().substring(0,2)
                            }
                            
                            if(data.special.type == 'Fatura')
                            {
                                tmpArr.push( 
                                {
                                    font: "b",
                                    style: tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "b" : undefined, //SUBTOTAL
                                    align: tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "rt" : "rt", //SUBTOTAL
                                    pdf: {fontSize:8,grid:[{x:3,charS:0,charE:2,align:'left'},{x:6,charS:2,charE:33,align:'left'},{x:80,charS:34,charE:47},{x:90,charS:48,charE:55},{x:100,charS:56,charE:63}]},
                                    data: tmpProSale[0].VAT_TYPE + " " +
                                        (tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? (tmpProSale[0].ITEM_SNAME + tmpFactStr).space(32,'s') + tmpFactStr : (tmpProSale[0].TICKET_REST ? "*" + tmpProSale[0].ITEM_SNAME + tmpFactStr : tmpProSale[0].ITEM_SNAME + tmpFactStr).toString().space(31)) + " " +                                    
                                        (tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "" : (tmpProSale[0].SCALE_MANUEL == true ? "(M)" : "") + "" + tmpQt + " " + tmpProSale[0].UNIT_SHORT).space(13,'e') + " " + //SUBTOTAL                                    
                                        (tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "" : parseFloat(tmpProSale[0].FAMOUNT / tmpQt).toFixed(2)).space(7,"e") + " " + //SUBTOTAL
                                       // (tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "" : (parseFloat(Number(tmpProSale[0].DISCOUNT) * -1).toFixed(2)).space(7,"s")) + " " + //SUBTOTAL
                                        (parseFloat(tmpProSale[0].FAMOUNT).toFixed(2)).space(7,"s")
                                })
                            }
                            else
                            {
                                tmpArr.push( 
                                {
                                    font: "b",
                                    style: tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "b" : undefined, //SUBTOTAL
                                    align: tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "rt" : "rt", //SUBTOTAL
                                    pdf: {fontSize:8,grid:[{x:3,charS:0,charE:2,align:'left'},{x:6,charS:2,charE:33,align:'left'},{x:80,charS:34,charE:47},{x:90,charS:48,charE:55},{x:100,charS:56,charE:63}]},
                                    data: tmpProSale[0].VAT_TYPE + " " +
                                        (tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? tmpProSale[0].ITEM_SNAME.space(32,'s') : (tmpProSale[0].TICKET_REST ? "*" + tmpProSale[0].ITEM_SNAME : tmpProSale[0].ITEM_SNAME).toString().space(31)) + " " +                                    
                                        (tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "" : (tmpProSale[0].SCALE_MANUEL == true ? "(M)" : "") + "" + tmpQt + " " + tmpProSale[0].UNIT_SHORT).space(13,'e') + " " + //SUBTOTAL                                    
                                        (tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "" : parseFloat(tmpProSale[0].PRICE * tmpProSale[0].UNIT_FACTOR).toFixed(2)).space(7,"e") + " " + //SUBTOTAL
                                       // (tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "" : (parseFloat(Number(tmpProSale[0].DISCOUNT) * -1).toFixed(2)).space(7,"s")) + " " + //SUBTOTAL
                                        (parseFloat(tmpProSale[0].AMOUNT).toFixed(2)).space(7,"s")
                                })
                            }
                        }
                    })

                    tmpArr.push( 
                    {
                        font: "b",
                        style: "b",
                        align: "rt",
                        data: "Remise ".space(46,"s") + ("  -" + parseFloat(tmpRemise).toFixed(2) + "EUR").space(10,"s")
                    })
                });
                //SATIR DETAYI
                data.possale.where({GUID:{'NIN':data.pospromo.toColumnArr('POS_SALE_GUID')}}).forEach(tmpSaleItem =>
                {
                    let tmpQt = ""            
                    let tmpFactStr = ""

                    if(Number.isInteger(parseFloat(tmpSaleItem.QUANTITY)))
                    {
                        tmpQt = parseInt(tmpSaleItem.QUANTITY / tmpSaleItem.UNIT_FACTOR);
                    }
                    else
                    {
                        tmpQt = parseFloat(tmpSaleItem.QUANTITY / tmpSaleItem.UNIT_FACTOR).toFixed(3);
                    }
                    
                    if(tmpSaleItem.UNIT_FACTOR > 1)
                    {
                        tmpFactStr = "X" + tmpSaleItem.UNIT_FACTOR.toString().substring(0,2)
                    }

                    if(data.special.type == 'Fatura')
                    {
                        tmpArr.push( 
                        {
                            font: "b",
                            style: tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "b" : undefined, //SUBTOTAL
                            align: tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "rt" : "rt", //SUBTOTAL
                            pdf: {fontSize:8,grid:[{x:3,charS:0,charE:2,align:'left'},{x:6,charS:2,charE:33,align:'left'},{x:80,charS:34,charE:47},{x:90,charS:48,charE:55},{x:100,charS:56,charE:63}]},
                            data: tmpSaleItem.VAT_TYPE + " " +
                                (tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? (tmpSaleItem.ITEM_SNAME + tmpFactStr).space(32,'s') : (tmpSaleItem.TICKET_REST ? "*" + tmpSaleItem.ITEM_SNAME + tmpFactStr : tmpSaleItem.ITEM_SNAME + tmpFactStr).toString().space(31)) + " " +                            
                                (tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "" : (tmpSaleItem.SCALE_MANUEL == true ? "(M)" : "") + "" + tmpQt + " " + tmpSaleItem.UNIT_SHORT).space(13,'e') + " " + //SUBTOTAL                            
                                (tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "" : parseFloat(tmpSaleItem.FAMOUNT / tmpQt).toFixed(2)).space(7,"e") + " " + //SUBTOTAL
                               // (tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "" : (parseFloat(Number(tmpSaleItem.DISCOUNT) * -1).toFixed(2)).space(7,"s")) + " " + //SUBTOTAL
                                (parseFloat(tmpSaleItem.FAMOUNT).toFixed(2)).space(7,"s")
                        }) 
                    }
                    else
                    {
                        tmpArr.push( 
                        {
                            font: "b",
                            style: tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "b" : undefined, //SUBTOTAL
                            align: tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "rt" : "rt", //SUBTOTAL
                            pdf: {fontSize:8,grid:[{x:3,charS:0,charE:2,align:'left'},{x:6,charS:2,charE:33,align:'left'},{x:80,charS:34,charE:47},{x:90,charS:48,charE:55},{x:100,charS:56,charE:63}]},
                            data: tmpSaleItem.VAT_TYPE + " " +
                                (tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? (tmpSaleItem.ITEM_SNAME + tmpFactStr).space(32,'s') + tmpFactStr : (tmpSaleItem.TICKET_REST ? "*" + tmpSaleItem.ITEM_SNAME + tmpFactStr : tmpSaleItem.ITEM_SNAME + tmpFactStr).toString().space(31)) + " " +                            
                                (tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "" : (tmpSaleItem.SCALE_MANUEL == true ? "(M)" : "") + "" + tmpQt + " " + tmpSaleItem.UNIT_SHORT).space(13,'e') + " " + //SUBTOTAL                            
                                (tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "" : parseFloat(tmpSaleItem.PRICE * tmpSaleItem.UNIT_FACTOR).toFixed(2)).space(7,"e") + " " + //SUBTOTAL
                                //(tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "" : (parseFloat(Number(tmpSaleItem.DISCOUNT) * -1).toFixed(2)).space(7,"s")) + " " + //SUBTOTAL
                                (parseFloat(tmpSaleItem.AMOUNT).toFixed(2)).space(7,"s")
                        }) 
                    }
                }) 
            } 
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        {font:"b",style:"bu",align:"lt",data:" ".space(64)},
        // ARA TOPLAM - REMIS
        ()=>
        {
            let tmpArr = [];
            let tmpOperator = data.pos[0].TYPE == 1 ? "-" : "";

            if(data.special.customerUsePoint > 0)
            {
                tmpArr.push({font:"a",align:"lt",data:"Sous-Total TTC".space(33) + (tmpOperator + decimal(data.possale.sum("AMOUNT",2)) + "EUR").space(15,"s")});
                tmpArr.push({font:"a",align:"lt",data:"Remise Fidelite ".space(33) + ((parseFloat(parseFloat(data.special.customerUsePoint) / 100) * -1).toFixed(2).toString() + ' EUR').space(15,"s")});
            }

            if(data.possale.sum("DISCOUNT",2) > 0)
            {
                if(data.special.customerUsePoint == 0)
                {
                    tmpArr.push({font:"a",align:"lt",data:"Sous-Total TTC".space(33) + (tmpOperator + decimal(data.possale.sum("AMOUNT",2)) + "EUR").space(15,"s")});
                }
                tmpArr.push({font:"a",align:"lt",data:("Remise " + Number(data.possale.sum("AMOUNT",2)).rate2Num(data.possale.sum("DISCOUNT",2),2) + "%").space(33) + (decimal(data.possale.sum("DISCOUNT",2) * -1) + "EUR").space(15,"s")});
            }
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        // DIP TOPLAM
        ()=>
        {
            let tmpOperator = data.pos[0].TYPE == 1 ? "-" : "";
            return {
                font: "b",
                size : [1,1],
                style: "b",
                align: "lt",
                data: "Total TTC".space(17) + 
                (tmpOperator + decimal(parseFloat(data.possale.sum("TOTAL")).toFixed(2)) + "EUR").space(15,"s")
            }
        },
        // ÖDEME TOPLAMLARI
        ()=>
        {
            let tmpArr = [];
            let tmpOperator = data.pos[0].TYPE == 1 ? "-" : "";

            for (let i = 0; i < data.pospay.length; i++) 
            {
                let tmpType = "";
                if(data.pospay[i].PAY_TYPE == 0)
                    tmpType = "Espece"
                else if (data.pospay[i].PAY_TYPE == 1)
                    tmpType = "CB"
                else if(data.pospay[i].PAY_TYPE == 2)
                    tmpType = "Cheque"
                else if(data.pospay[i].PAY_TYPE == 3)
                    tmpType = "CHEQue"
                else if(data.pospay[i].PAY_TYPE == 4)
                    tmpType = "BON D'AVOIR"
                else if(data.pospay[i].PAY_TYPE == 5)
                    tmpType = "AVOIR"
                else if(data.pospay[i].PAY_TYPE == 6)
                    tmpType = "VIRMENT"
                else if(data.pospay[i].PAY_TYPE == 7)
                    tmpType = "PRLV"

                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    pdf: {fontSize:15},
                    data: tmpType.space(33) + 
                    (tmpOperator + decimal(data.pospay.where({PAY_TYPE:data.pospay[i].PAY_TYPE}).sum("AMOUNT",2)) + "EUR").space(15,"s")
                })
            }
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        // PARA ÜSTÜ
        ()=>
        {
            let tmpArr = [];
            if(data.pospay.where({PAY_TYPE:0}).length > 0)
            {
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    pdf: {fontSize:15},
                    data: "Recu".space(33) +
                        (decimal(parseFloat(data.pospay.sum("AMOUNT",2)).toFixed(2)) + "EUR").space(15,"s")
                });
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    pdf: {fontSize:15},
                    data: "Rendu".space(33) + (decimal(data.pospay.sum("CHANGE",2)) + "EUR").space(15,"s")
                });
            }
            else if(data.pospay.where({PAY_TYPE:3}).length > 0)
            {
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    pdf: {fontSize:15},
                    data: "Surplus Tic. Rest.".space(33) + (decimal(data.pospay.sum("TICKET_PLUS",2)) + "EUR").space(15,"s")
                });
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    pdf: {fontSize:15},
                    data: "Rendu".space(33) + ("0,00" + "EUR").space(15,"s")
                });
            }
            else if(data.pospay.where({PAY_TYPE:4}).length > 0)
            {
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    pdf: {fontSize:15},
                    data: "Recu".space(33) +
                        (decimal(parseFloat(data.pospay.where({PAY_TYPE:4}).sum("AMOUNT",2) + data.pospay.sum("CHANGE",2)).toFixed(2)) + "EUR").space(15,"s")
                });
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    pdf: {fontSize:15},
                    data: "Rendu".space(33) + (decimal(data.pospay.sum("CHANGE",2)) + "EUR").space(15,"s")
                });
            }
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        {font:"b",style:"bu",align:"lt",data:" ".space(64)},
        // VERGİ LİSTESİ
        ()=>
        {
            let tmpArr = [];
            
            tmpArr.push(
            {
                font: "b",
                style: "bu",
                align: "rt",
                data: " ".space(5) + " " +
                    "Taux".space(10) + " " +
                    "HT".space(10) + " " +
                    "TVA".space(10) + " " +
                    "TTC".space(10)
            })

            let tmpVatLst = data.possale.where({GUID:{'<>':'00000000-0000-0000-0000-000000000000'}}).groupBy('VAT_RATE');

            for (let i = 0; i < tmpVatLst.length; i++) 
            {
                tmpArr.push(
                {
                    font: "b",
                    align: "rt",
                    data: tmpVatLst[i].VAT_TYPE.space(5) + " " +
                        (tmpVatLst[i].VAT_RATE + "%").space(10) + " " +
                        data.possale.where({VAT_TYPE:tmpVatLst[i].VAT_TYPE}).sum('FAMOUNT',2).space(10) + " " + 
                        data.possale.where({VAT_TYPE:tmpVatLst[i].VAT_TYPE}).sum('VAT',2).space(10) + " " + 
                        data.possale.where({VAT_TYPE:tmpVatLst[i].VAT_TYPE}).sum('TOTAL',2).space(10)
                })
            }

            tmpArr.push(
            {
                font: "b",
                align: "rt",
                data: ("Total : ").space(18) +
                    data.possale.sum('FAMOUNT',2).space(10) + " " + 
                    data.possale.sum('VAT',2).space(10) + " " + 
                    data.possale.sum('TOTAL',2).space(10)
            })
            
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        {font:"b",style:"bu",align:"lt",data:" ".space(64)},
        // TICKET_REST
        ()=>
        {
            if(data.possale.where({TICKET_REST:true}).length > 0)
            {
                return {
                    font:"b",
                    style:"b",
                    align:"lt",
                    data:"(*) TOTAL ART ELIGIBLE".space(52) + " " + 
                    data.possale.where({TICKET_REST:true}).sum('TOTAL',2).space(7,"s") 
                }
            }
        },
        // SCALE_MANUEL
        {font:"b",style:"a",align:"lt",data:"(M) POIDS ENTRE MANUELLEMENT".space(52)},
        {font:"b",style:"bu",align:"lt",data:" ".space(64)},
        ()=>{return {font:"b",align:"lt",data: (data.possale.where({GUID:{'<>':'00000000-0000-0000-0000-000000000000'}}).length.toString() + " Aricle(s)").space(14)}},
        ()=>
        {
            let tmpArr = [];
            if(data.pos[0].CUSTOMER_CODE != '')
            {            
                if(data.pos[0].CUSTOMER_POINT_PASSIVE == false)
                {
                    let tmpFactory = (Number(data.special.customerPointFactory) / 100)

                    tmpArr.push({align:"ct",barcode:data.pos[0].CUSTOMER_CODE,options:{width: 1,height:30}});
                    tmpArr.push({font:"b",style:"b",align:"lt",data:"****************************************************************".space(64)});
                    tmpArr.push({font:"b",align:"lt",data:("CARTE DE FIDELITE / " + data.pos[0].CUSTOMER_CODE).space(64)});
                    tmpArr.push({font:"b",align:"lt",data:"ANCIEN CUMUL ".space(56) + (data.special.customerPoint + ' Pts').space(8,"s")});
                    tmpArr.push({font:"b",align:"lt",data:"POINT ACQUIS SUR CE TICKET ".space(56) + (parseInt(data.pos[0].TOTAL * tmpFactory) + ' Pts').space(8,"s")});

                    if(data.special.customerUsePoint > 0)
                    {
                        tmpArr.push({font:"b",align:"lt",data:"UTILISE POINT ".space(56) + ((parseInt(data.special.customerUsePoint) * -1) + ' Pts').space(8,"s")});
                    }
                    tmpArr.push({font:"b",align:"lt",data:"NOUVEAU CUMUL ".space(56) + (parseInt(data.special.customerGrowPoint) + parseInt(data.pos[0].TOTAL * tmpFactory) + ' Pts').space(8,"s")});
                    tmpArr.push({font:"b",align:"lt",data:"EQUIVALENT REMISE ".space(56) + (decimal(parseFloat((parseInt(data.special.customerGrowPoint) + parseInt(data.pos[0].TOTAL)) / 100).toFixed(2)).toString() + 'EUR').space(8,"s")});

                    tmpArr.push({font:"b",style:"b",align:"lt",data:"****************************************************************".space(64)});
                }
                else
                {
                    tmpArr.push({align:"ct",barcode:data.pos[0].CUSTOMER_CODE,options:{width: 1,height:30}});
                    tmpArr.push({font:"b",style:"b",align:"lt",data:"****************************************************************".space(64)});
                    tmpArr.push({font:"b",align:"ct",data:(data.pos[0].CUSTOMER_NAME).space(64)});
                    tmpArr.push({font:"b",align:"lt",data:(" ").space(64)});
                    tmpArr.push({font:"b",align:"lt",data:(" ").space(64)});
                    tmpArr.push({font:"b",align:"lt",data:("SIGNATURE: ").space(64)});
                    tmpArr.push({font:"b",align:"lt",data:("......................................NOM:......................").space(64)});
                    tmpArr.push({font:"b",style:"b",align:"lt",data:"****************************************************************".space(64)});
                }
            }
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        ()=>
        {   
            let tmpArr = [];
            if(data.pos[0].REBATE_CHEQPAY != '' && data.pospay.where({PAY_TYPE:4}).length > 0 && data.pos[0].TYPE == 1)
            {
                tmpArr.push({font:"b",style:"b",align:"ct",size : [1,0],data:"Bon d'avoir : " + decimal(parseFloat(data.pos[0].REBATE_CHEQPAY.substring(7,12) / 100).toFixed(2)) + "EUR"});
                tmpArr.push({align:"ct",barcode:data.pos[0].REBATE_CHEQPAY,options:{width: 1,height:90}});
                tmpArr.push({font:"b",style:"b",align:"lt",data:" ".space(64)});
                tmpArr.push({font:"b",style:"b",align:"ct",data:"Avoir valable 3 mois après édition..."});
            }
            else if(data.pos[0].REBATE_CHEQPAY != '' && data.pospay.where({PAY_TYPE:4}).length > 0 && data.pos[0].TYPE == 0 && data.pospay.where({CHANGE:{'>':0}}).length > 0)
            {
                tmpArr.push({font:"b",style:"b",align:"ct",size : [1,0],data:"Reste Bon d'avoir : " + decimal(parseFloat(data.pos[0].REBATE_CHEQPAY.substring(7,12) / 100).toFixed(2)) + "EUR"});
                tmpArr.push({align:"ct",barcode:data.pos[0].REBATE_CHEQPAY,options:{width: 1,height:90}});
                tmpArr.push({font:"b",style:"b",align:"lt",data:" ".space(64)});
                tmpArr.push({font:"b",style:"b",align:"ct",data:"Avoir valable 3 mois après édition..."});
            }
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        ()=>{return {font:"b",align:"ct",data:"Conservez moi comme preuve d'achat pour les"}},
        ()=>{return {font:"b",align:"ct",data:"Garanties, Echanges, ou Remboursement "}},
        ()=>{return {font:"b",align:"ct",data:"Sous 1 semaine en bon d'achat."}},
        ()=>{return {font:"b",align:"ct",data:"Ne sont ni repris ni échangés les produits suivants :"}},
        ()=>{return {font:"b",align:"ct",data:"Produits Frais, Viandes, Fromages."}},
        ()=>{return {font:"b",style:"b",align:"ct",data:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}},
        ()=>{return {font:"b",style:"b",align:"ct",data:"AUCUN REMBOURSEMENT ESPECES NE SERA EFFECTUE"}},
        ()=>{return {font:"b",style:"b",align:"ct",data:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}},
        ()=>{return {font:"b",style:"b",align:"ct",data:"Grâce à vos achats bénéficiez de réductions."}},
        ()=>{return {font:"b",style:"b",align:"ct",data:"Pour 1 EURO depensé beneficiez d'1 point fidelité."}},
        ()=>{return {font:"b",style:"b",align:"ct",data:"Merci de votre fidélité à très bientôt ..."}},
        ()=>
        {
            if(data.special.type == 'Fatura')
            {
                return {font:"b",style:"b",align:"ct",data:data.special.factCertificate}
            }
            else
            {
                return {font:"b",style:"b",align:"ct",data:data.pos[0].CERTIFICATE}
            }
        },
        ()=>
        {
            if(data.special.reprint > 1)
            {
                let tmpArr = []

                tmpArr.push({font:"b",style:"b",align:"ct",data:"Numéro de Réimpression " + (data.special.reprint - 1)})
                tmpArr.push({font:"b",align:"ct",data:moment(new Date()).locale('fr').format('dddd DD.MM.YYYY HH:mm:ss')})
                tmpArr.push({font:"b",style:"b",align:"ct",data:data.special.dupCertificate})

                return tmpArr.length > 0 ? tmpArr : undefined
            }
            else
            {
                return {font:"b",style:"b",align:"ct",data:"Nombre d'impression " + data.special.reprint}
            }
        },
        ()=>{return {font:"b",style:"b",align:"ct",data:" "}},
    ]
}
