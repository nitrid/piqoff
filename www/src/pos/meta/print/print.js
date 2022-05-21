import moment from "moment";
//data.pos
//data.possale
//data.pospay
//data.special.type = 'Fatura'
//data.special.safe = 'Kasa Kodu'
//data.special.ticketCount = 'Günlük Ticket Sayısı'
//data.special.reprint = 'true' Tekrar yazdırma
//data.special.repas = 'TxtRepasMiktar'
//data.special.customerPoint = 'Müşteri Puanı'

export function print()
{
    let data = arguments.length > 0 ? arguments[0] : undefined;

    if(typeof data == 'undefined')
        return []

    return [
        {align:"ct",logo:"./resources/logop.png"},
        ()=>{return {font:"a",style:"b",align:"ct",data:""}},
        // ÜST BİLGİ
        ()=>{return {font:"a",style:"b",align:"ct",data:"ZAC HECKENWALD"}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"57740 LONGEVILLE-LES-ST-AVOLD"}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"Tel : 03 87 91 00 32"}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"longeville@prodorplus.fr"}},
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
        ()=>{return {font:"b",align:"lt",data:("Caissier: " + data.pos[0].CUSER).space(34) + ("Caisse: " + data.special.safe + " - Ticket: " + data.special.ticketCount).space(30)}},
        ()=>{return {font:"b",align:"lt",data:" ".space(64)}},
        ()=>
        {
            if(data.special.type == 'Fatura' || data.special.reprint)
            {
                return {font:"b",style:"b",align:"ct",data: "DUPLICATA"}
            }   
            return
        },
        ()=>
        {
            let tmpArr = []
            if(data.pospay.where({TYPE:0}).length > 0 && data.pos[0].TYPE == 1)
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
                            (data.possale.sum("AMOUNT",2) + "EUR").space(10,"s")
                });
            }
            else
            {
                for (let i = 0; i < data.possale.length; i++) 
                {
                    let tmpQt = ""            
                    
                    if(Number.isInteger(parseFloat(data.possale[i].QUANTITY)))
                    {
                        tmpQt = data.possale[i].QUANTITY + " " + data.possale[i].UNIT_SHORT;
                    }
                    else
                    {
                        tmpQt = parseFloat(parseFloat(data.possale[i].QUANTITY).toFixed(3)) + " " + data.possale[i].UNIT_SHORT;
                    }
                                        
                    tmpArr.push( 
                    {
                        font: "b",
                        style: data.possale[i].GUID == "00000000-0000-0000-0000-000000000000" ? "b" : undefined, //SUBTOTAL
                        align: data.possale[i].GUID == "00000000-0000-0000-0000-000000000000" ? "rt" : "lt", //SUBTOTAL
                        data: data.possale[i].VAT_TYPE + " " +
                            (data.possale[i].GUID == "00000000-0000-0000-0000-000000000000" ? data.possale[i].ITEM_NAME.space(30,'s') : (data.possale[i].TICKET_REST ? "*" + data.possale[i].ITEM_NAME : data.possale[i].ITEM_NAME).toString().space(34)) + " " +
                            (data.possale[i].GUID == "00000000-0000-0000-0000-000000000000" ? "" : tmpQt).space(8,'s') + " " + //SUBTOTAL
                            (data.possale[i].GUID == "00000000-0000-0000-0000-000000000000" ? "" : parseFloat(data.possale[i].PRICE).toFixed(2)).space(7,"s") + " " + //SUBTOTAL
                            (parseFloat(data.possale[i].AMOUNT).toFixed(2) + "EUR").space(10,"s")
                    })
                }
            } 
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        {font:"b",style:"bu",align:"lt",data:" ".space(64)},
        // ARA TOPLAM - REMIS
        ()=>
        {
            let tmpArr = [];
            let tmpOperator = data.pos[0].TYPE == 1 ? "-" : "";

            if(data.special.customerPoint > 0)
            {
                tmpArr.push({font:"a",align:"lt",data:"Sous-Total ".space(33) + (tmpOperator + data.possale.sum("AMOUNT",2) + " EUR").space(15,"s")});
                tmpArr.push({font:"a",align:"lt",data:"Remise Fidelite ".space(33) + (parseFloat(parseFloat(data.special.customerPoint) / 100).toFixed(2).toString() + ' EUR').space(15,"s")});
            }

            if(data.possale.sum("DISCOUNT",2) > 0)
            {
                if(data.special.customerPoint == 0)
                {
                    tmpArr.push({font:"a",align:"lt",data:"Sous-Total ".space(33) + (tmpOperator + data.possale.sum("AMOUNT",2) + " EUR").space(15,"s")});
                }
                tmpArr.push({font:"a",align:"lt",data:"Remise ".space(33) + (data.possale.sum("AMOUNT",2) + " EUR").space(15,"s")});
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
                (tmpOperator + parseFloat(data.possale.sum("AMOUNT",2) - (data.possale.sum("DISCOUNT",2) + parseFloat(parseFloat(data.special.customerPoint) / 100))).toFixed(2) + " EUR").space(15,"s")
            }
        },
        // ÖDEME TOPLAMLARI
        ()=>
        {
            for (let i = 0; i < data.pospay.length; i++) 
            {
                let TmpType = "";
                if(pTData[i].TYPE == 0)
                    TmpType = "Espece" //BUNLAR PARAMETRİK OLACAK.
                else if (pTData[i].TYPE == 1)
                    TmpType = "CB"
                else if(pTData[i].TYPE == 2)
                    TmpType = "Cheque"
                else if(pTData[i].TYPE == 3)
                    TmpType = "CHEQue"
                else if(pTData[i].TYPE == 4)
                    TmpType = "BON D'AVOIR"
                else if(pTData[i].TYPE == 5)
                    TmpType = "AVOIR"
                else if(pTData[i].TYPE == 6)
                    TmpType = "VIRMENT"
                else if(pTData[i].TYPE == 7)
                    TmpType = "PRLV"

                TmpLine = 
                {
                    font: "a",
                    align: "lt",
                    data: _PrintText(TmpType,33) +
                        _PrintText(TmpOperator + parseFloat(_SumColumn(pTData,"AMOUNT","TYPE = " + pTData[i].TYPE)).toFixed(2) + " EUR",15,"Start")
                }
                TmpData.push(TmpLine);
            }
            return {
                font: "b",
                size : [1,1],
                style: "b",
                align: "lt",
                data: "Total TTC".space(17) + 
                (tmpOperator + parseFloat(data.possale.sum("AMOUNT",2) - (data.possale.sum("DISCOUNT",2) + parseFloat(parseFloat(data.special.customerPoint) / 100))).toFixed(2) + " EUR").space(15,"s")
            }
        }
    ]
}
