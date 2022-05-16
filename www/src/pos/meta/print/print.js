import moment from "moment";
//data.pos
//data.possale
//data.pospay
//data.special.type = 'Fatura'
//data.special.safe = 'Kasa Kodu'
//data.special.ticketCount = 'Günlük Ticket Sayısı'
//data.special.reprint = 'true' Tekrar yazdırma
//data.special.repas = 'TxtRepasMiktar'

export function print()
{
    let data = arguments.length > 0 ? arguments[0] : undefined;
    if(typeof data == 'undefined')
        return []

    return [
        ()=>{return {font:"a",style:"b",align:"ct",data:""}},
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
        ()=>{return {font:"b",style:"bu",align:"lt",data:"T " + "Libelle".space(37) + " " + "Qte".space(8) + " " + "P/u".space(7) + " " + "Prix".space(7)}},
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
                        tmpQt = data.possale[i].QUANTITY + " " + data.possale[i].UNIT_NAME;
                    }
                    else
                    {
                        tmpQt = parseFloat(parseFloat(data.possale[i].QUANTITY).toFixed(3)) + " " + data.possale[i].UNIT_NAME;
                    }
                    
                    tmpArr.push( 
                    {
                        font: "b",
                        align: "lt",
                        data: data.possale[i].VAT_RATE + " " +
                                (data.possale[i].TICKET_REST ? "*" + data.possale[i].ITEM_NAME : data.possale[i].ITEM_NAME).toString().space(34) + " " +
                                tmpQt.space(8,'s') + " " + 
                                parseFloat(data.possale[i].PRICE).toFixed(2).space(7,"s") + " " + 
                                (parseFloat(data.possale[i].AMOUNT).toFixed(2) + "EUR").space(10,"s")
                    })
                }
            } 
            return tmpArr.length > 0 ? tmpArr : undefined
        },
    ]
}
