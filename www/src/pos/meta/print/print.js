import moment from "moment";
//data.pos
//data.possale
//data.pospay
//data.special.type = 'Fatura'
//data.special.safe = 'Kasa Kodu'
//data.special.ticketCount = 'Günlük Ticket Sayısı'
//data.special.reprint = 1 Tekrar yazdırma sayısı
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
        ()=>{return {font:"a",style:"b",align:"ct",data:"7 ALLEE DU MIDI"}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"54270 ESSEY LES NANCY FRANCE"}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"Tel : 03 83 93 33 07"}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"nancy@prodorplus.fr"}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"www.prodorplus.fr"}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"Siret 88 533 969 700 017 - APE 4722Z"}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"Nr. TVA FR23885339697"}},
        ()=>
        {       
            let tmpArr = []
            if(data.special.type == 'Fatura')
            {
                tmpArr.push({font:"a",align:"ct",data:"------------------------------------------------"})
                tmpArr.push({font:"a",align:"ct",data:"FACTURE"})
                tmpArr.push({font:"a",align:"ct",data:"------------------------------------------------"})
                tmpArr.push({font:"b",style:"b",align:"ct",data: " ".space(64)})
                tmpArr.push({font:"b",style:"b",align:"lt",data: "Nom:.........................................................."})
                tmpArr.push({font:"b",style:"b",align:"lt",data: "Adresse:......................................................"})
                tmpArr.push({font:"b",style:"b",align:"lt",data: ".............................................................."})
                tmpArr.push({font:"b",style:"b",align:"lt",data: ".............................................................."})
                tmpArr.push({font:"b",style:"b",align:"ct",data: " ".space(64)})
            }   
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        ()=>{return {font:"b",align:"lt",data:(moment(new Date()).locale('fr').format('dddd') + " " + moment(new Date()).format("DD.MM.YYYY")).space(59) + (moment(new Date()).format("LTS")).space(5)}},
        ()=>{return {font:"b",align:"lt",data:("Caissier: " + data.pos[0].CUSER).space(34,'e') + ("Caisse: " + data.pos[0].DEVICE).space(30,'s')}},
        //FIS NO BARKODU
        ()=>{return {align:"ct",barcode:data.pos[0].GUID.substring(19,36),options:{width: 1,height:40,position:'OFF'}}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"****** Numero de Ticket De Caisse ******"}},
        ()=>{return {font:"b",align:"lt",data:" ".space(64)}},
        ()=>
        {
            if(data.special.type == 'Fatura' || data.special.reprint > 1)
            {
                return {font:"b",style:"b",align:"ct",data: "DUPLICATA"}
            }   
            return
        },
        ()=>
        {
            let tmpArr = []
            if(data.pos[0].TYPE == 0)
            {
                tmpArr.push({font:"b",style:"b",size : [1,1],align:"ct",data:"TICKET DE VENTE"})
                tmpArr.push({font:"b",style:"b",align:"ct",data: " ".space(64)})
            }
            else if(data.pospay.where({TYPE:0}).length > 0 && data.pos[0].TYPE == 1)
            {
                tmpArr.push({font:"b",style:"b",size : [1,1],align:"ct",data:"REMBOURSEMENT"})
                tmpArr.push({font:"b",style:"b",align:"ct",data: " ".space(64)})
            }
            else if(data.pospay.where({TYPE:4}).length > 0)
            {
                tmpArr.push({font:"b",style:"b",size : [1,1],align:"ct",data:"BON D'AVOIR"})
                tmpArr.push({font:"b",style:"b",align:"ct",data: " ".space(64)})
            } 
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        // BAŞLIK
        ()=>{return {font:"b",style:"bu",align:"lt",data:"T " + "Libelle".space(37) + " " + "Qte".space(8) + " " + "P/u".space(7) + " " + "Prix".space(7)}},
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
                    
                            if(Number.isInteger(parseFloat(tmpProSale[0].QUANTITY)))
                            {
                                tmpQt = parseInt(tmpProSale[0].QUANTITY / tmpProSale[0].UNIT_FACTOR) + " " + tmpProSale[0].UNIT_SHORT;
                            }
                            else
                            {
                                tmpQt = parseFloat(parseFloat(tmpProSale[0].QUANTITY / tmpProSale[0].UNIT_FACTOR).toFixed(3)) + " " + tmpProSale[0].UNIT_SHORT;
                            }
                                                
                            tmpArr.push( 
                            {
                                font: "b",
                                style: tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "b" : undefined, //SUBTOTAL
                                align: tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "rt" : "lt", //SUBTOTAL
                                data: tmpProSale[0].VAT_TYPE + " " +
                                    (tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? tmpProSale[0].ITEM_SNAME.space(30,'s') : (tmpProSale[0].TICKET_REST ? "*" + tmpProSale[0].ITEM_SNAME : tmpProSale[0].ITEM_SNAME).toString().space(34)) + " " +
                                    (tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "" : tmpQt).space(8,'s') + " " + //SUBTOTAL
                                    (tmpProSale[0].GUID == "00000000-0000-0000-0000-000000000000" ? "" : parseFloat(tmpProSale[0].PRICE * tmpProSale[0].UNIT_FACTOR).toFixed(2)).space(7,"s") + " " + //SUBTOTAL
                                    (parseFloat(tmpProSale[0].AMOUNT).toFixed(2) + "EUR").space(10,"s")
                            })
                        }
                    })

                    tmpArr.push( 
                    {
                        font: "b",
                        style: "b",
                        align: "lt",
                        data: "Remise ".space(40,"s") + ("  -" + parseFloat(tmpRemise).toFixed(2) + "EUR").space(10,"s")
                    })
                });
                //SATIR DETAYI
                data.possale.where({GUID:{'NIN':data.pospromo.toColumnArr('POS_SALE_GUID')}}).forEach(tmpSaleItem =>
                {
                    let tmpQt = ""            
                    
                    if(Number.isInteger(parseFloat(tmpSaleItem.QUANTITY)))
                    {
                        tmpQt = parseInt(tmpSaleItem.QUANTITY / tmpSaleItem.UNIT_FACTOR) + " " + tmpSaleItem.UNIT_SHORT;
                    }
                    else
                    {
                        tmpQt = parseFloat(parseFloat(tmpSaleItem.QUANTITY / tmpSaleItem.UNIT_FACTOR).toFixed(3)) + " " + tmpSaleItem.UNIT_SHORT;
                    }
                                        
                    tmpArr.push( 
                    {
                        font: "b",
                        style: tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "b" : undefined, //SUBTOTAL
                        align: tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "rt" : "lt", //SUBTOTAL
                        data: tmpSaleItem.VAT_TYPE + " " +
                            (tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? tmpSaleItem.ITEM_SNAME.space(30,'s') : (tmpSaleItem.TICKET_REST ? "*" + tmpSaleItem.ITEM_SNAME : tmpSaleItem.ITEM_SNAME).toString().space(34)) + " " +
                            (tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "" : tmpQt).space(8,'s') + " " + //SUBTOTAL
                            (tmpSaleItem.GUID == "00000000-0000-0000-0000-000000000000" ? "" : parseFloat(tmpSaleItem.PRICE * tmpSaleItem.UNIT_FACTOR).toFixed(2)).space(7,"s") + " " + //SUBTOTAL
                            (parseFloat(tmpSaleItem.AMOUNT).toFixed(2) + "EUR").space(10,"s")
                    }) 
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
                tmpArr.push({font:"a",align:"lt",data:"Sous-Total ".space(33) + (tmpOperator + decimal(data.possale.sum("AMOUNT",2)) + "EUR").space(15,"s")});
                tmpArr.push({font:"a",align:"lt",data:"Remise Fidelite ".space(33) + ((parseFloat(parseFloat(data.special.customerUsePoint) / 100) * -1).toFixed(2).toString() + ' EUR').space(15,"s")});
            }

            if(data.possale.sum("DISCOUNT",2) > 0)
            {
                if(data.special.customerUsePoint == 0)
                {
                    tmpArr.push({font:"a",align:"lt",data:"Sous-Total ".space(33) + (tmpOperator + decimal(data.possale.sum("AMOUNT",2)) + "EUR").space(15,"s")});
                }
                tmpArr.push({font:"a",align:"lt",data:"Remise ".space(33) + (decimal(data.possale.sum("DISCOUNT",2) * -1) + "EUR").space(15,"s")});
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
                    data: "Recu".space(33) +
                        (decimal(parseFloat(data.pospay.sum("AMOUNT",2)).toFixed(2)) + "EUR").space(15,"s")
                });
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    data: "Rendu".space(33) + (decimal(data.pospay.sum("CHANGE",2)) + "EUR").space(15,"s")
                });
            }
            else if(data.pospay.where({PAY_TYPE:3}).length > 0)
            {
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    data: "Surplus Tic. Rest.".space(33) + (decimal(data.pospay.sum("TICKET_PLUS",2)) + "EUR").space(15,"s")
                });
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    data: "Rendu".space(33) + ("0,00" + "EUR").space(15,"s")
                });
            }
            else if(data.pospay.where({PAY_TYPE:4}).length > 0)
            {
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    data: "Recu".space(33) +
                        (decimal(parseFloat(data.pospay.where({PAY_TYPE:4}).sum("AMOUNT",2) + data.pospay.sum("CHANGE",2)).toFixed(2)) + "EUR").space(15,"s")
                });
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
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
                align: "lt",
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
                    align: "lt",
                    data: tmpVatLst[i].VAT_TYPE.space(5) + " " +
                        (tmpVatLst[i].VAT_RATE + "%").space(10) + " " +
                        data.possale.where({VAT_TYPE:tmpVatLst[i].VAT_TYPE}).sum('FAMOUNT',2).space(10) + " " + 
                        data.possale.where({VAT_TYPE:tmpVatLst[i].VAT_TYPE}).sum('VAT',2).space(10) + " " + 
                        data.possale.where({VAT_TYPE:tmpVatLst[i].VAT_TYPE}).sum('TOTAL',2).space(10)
                })
            }
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
                    data:"TOTAL ART ELIGIBLE".space(56) + " " + 
                    data.possale.where({TICKET_REST:true}).sum('TOTAL',2).space(7,"s") 
                }
            }
        },
        {font:"b",style:"bu",align:"lt",data:" ".space(64)},
        ()=>{return {font:"b",align:"lt",data: (data.possale.where({GUID:{'<>':'00000000-0000-0000-0000-000000000000'}}).length.toString() + " Aricle(s)").space(14)}},
        ()=>
        {
            let tmpArr = [];
            if(data.pos[0].CUSTOMER_CODE != '')
            {            
                tmpArr.push({align:"ct",barcode:data.pos[0].CUSTOMER_CODE,options:{width: 1,height:30}});
                tmpArr.push({font:"b",style:"b",align:"lt",data:"****************************************************************".space(64)});
                tmpArr.push({font:"b",align:"lt",data:("CARTE DE FIDELITE / " + data.pos[0].CUSTOMER_CODE).space(64)});
                tmpArr.push({font:"b",align:"lt",data:"ANCIEN CUMUL ".space(56) + (data.special.customerPoint + ' Pts').space(8,"s")});
                tmpArr.push({font:"b",align:"lt",data:"POINT ACQUIS SUR CE TICKET ".space(56) + (parseInt(data.pos[0].TOTAL) + ' Pts').space(8,"s")});

                if(data.special.customerUsePoint > 0)
                {
                    tmpArr.push({font:"b",align:"lt",data:"UTILISE POINT ".space(56) + ((parseInt(data.special.customerUsePoint) * -1) + ' Pts').space(8,"s")});
                }
                tmpArr.push({font:"b",align:"lt",data:"NOUVEAU CUMUL ".space(56) + (parseInt(data.special.customerGrowPoint) + parseInt(data.pos[0].TOTAL) + ' Pts').space(8,"s")});
                tmpArr.push({font:"b",align:"lt",data:"EQUIVALENT REMISE ".space(56) + (decimal(parseFloat((parseInt(data.special.customerGrowPoint) + parseInt(data.pos[0].TOTAL)) / 100).toFixed(2)).toString() + 'EUR').space(8,"s")});

                tmpArr.push({font:"b",style:"b",align:"lt",data:"****************************************************************".space(64)});
            }
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        ()=>
        {   
            let tmpArr = [];
            if(data.pos[0].REBATE_CHEQPAY != '' && data.pospay.where({PAY_TYPE:4}).length > 0 && data.pos[0].TYPE == 1)
            {
                tmpArr.push({font:"b",style:"b",align:"ct",size : [1,0],data:"Bon d'avoir : " + decimal(parseFloat(data.pos[0].REBATE_CHEQPAY.substring(8,12) / 100).toFixed(2)) + "EUR"});
                tmpArr.push({align:"ct",barcode:data.pos[0].REBATE_CHEQPAY,options:{width: 1,height:90}});
                tmpArr.push({font:"b",style:"b",align:"lt",data:" ".space(64)});
                tmpArr.push({font:"b",style:"b",align:"ct",data:"Avoir valable 3 mois apres edition..."});
            }
            else if(data.pos[0].REBATE_CHEQPAY != '' && data.pospay.where({PAY_TYPE:4}).length > 0 && data.pos[0].TYPE == 0 && data.pospay.where({CHANGE:{'>':0}}).length > 0)
            {
                tmpArr.push({font:"b",style:"b",align:"ct",size : [1,0],data:"Reste Bon d'avoir : " + decimal(parseFloat(data.pos[0].REBATE_CHEQPAY.substring(8,12) / 100).toFixed(2)) + "EUR"});
                tmpArr.push({align:"ct",barcode:data.pos[0].REBATE_CHEQPAY,options:{width: 1,height:90}});
                tmpArr.push({font:"b",style:"b",align:"lt",data:" ".space(64)});
                tmpArr.push({font:"b",style:"b",align:"ct",data:"Avoir valable 3 mois apres edition..."});
            }
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        ()=>{return {font:"b",align:"ct",data:"Conservez moi comme preuve d'achat pour les"}},
        ()=>{return {font:"b",align:"ct",data:"garanties, echanges, ou remboursement sous 1 mois"}},
        ()=>{return {font:"b",align:"ct",data:"Ne sont ni repris ni echanges les produits suivants :"}},
        ()=>{return {font:"b",align:"ct",data:"Produits Frais, Viandes, Fromages."}},
        ()=>{return {font:"b",style:"b",align:"ct",data:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}},
        ()=>{return {font:"b",style:"b",align:"ct",data:"AUCUN REMBOURSEMENT ESPECES NE SERA EFFECTUE"}},
        ()=>{return {font:"b",style:"b",align:"ct",data:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}},
        ()=>{return {font:"b",style:"b",align:"ct",data:"Merci de votre fidelite a tres bientot ..."}},
        ()=>{return {font:"b",style:"b",align:"ct",data:data.pos[0].CERTIFICATE}},
        ()=>{return {font:"b",style:"b",align:"ct",data:"Nombre d'impression " + data.special.reprint}},
        ()=>{return {font:"b",style:"b",align:"ct",data:" "}},
    ]
}
