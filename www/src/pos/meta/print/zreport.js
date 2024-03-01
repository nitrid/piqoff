import moment from "moment";
//data.possale
//data.pospay
//data.firm = Firma bilgileri
//data.special.user = Kullanıcı kodu
//data.special.device = Cihaz kodu

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
        {font:"a",style:"b",size : [1,1],align:"ct",data:""},
        {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].ADDRESS1 : "Bahnhafstrasse 13"},
        {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].ZIPCODE + " " + data.firm[0].CITY + " " + data.firm[0].COUNTRY_NAME : "6020 EMMENBRUCKE"},
        {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? "Tel : " + data.firm[0].TEL : "Tel : +41 76 260 38 66"},
        {font:"a",style:"b",size : [1,1],align:"ct",data:""},
        {font:"a",style:"b",size : [1,1],align:"ct",data: "TAGESBERICHT"},
        {font:"a",style:"b",size : [1,1],align:"ct",data:""},
        {font:"a",align:"lt",data:moment(new Date().toISOString()).utcOffset(0,false).locale('de').format('dddd DD.MM.YYYY HH:mm:ss')},
        {font:"a",align:"lt",pdf:{fontSize:11},data:("Caissier: " + data.special.user).space(25,'e') + ("Caisse: " + data.special.device).space(23,'s')},
        {font:"a",style:"b",align:"lt",data:" ".space(48)},
        {font:"a",style:"bu",align:"rt",data:" ".space(5) + " " + "Steuer".space(8) + " " + "Netto".space(10) + " " + "MwSt".space(10) + " " + "Brutto".space(10)},
        ()=>
        {
            let tmpArr = []
            let tmpVatLst = data.possale.groupBy('VAT_TYPE').orderBy('VAT_TYPE','asc')

            for (let i = 0; i < tmpVatLst.length; i++) 
            {
                tmpArr.push(
                {
                    font: "a",
                    align: "rt",
                    data: tmpVatLst[i].VAT_TYPE.space(5) + " " +
                        (tmpVatLst[i].VAT_RATE + "%").space(8) + " " +
                        data.possale.where({VAT_RATE:tmpVatLst[i].VAT_RATE}).sum('FAMOUNT',2).space(10) + " " + 
                        data.possale.where({VAT_RATE:tmpVatLst[i].VAT_RATE}).sum('VAT',2).space(10) + " " + 
                        data.possale.where({VAT_RATE:tmpVatLst[i].VAT_RATE}).sum('TOTAL',2).space(10)
                })
            }
            tmpArr.push({font: "a",align: "rt",data: ("Total : ").space(16) + data.possale.sum('FAMOUNT',2).space(10) + " " + data.possale.sum('VAT',2).space(10) + " " + data.possale.sum('TOTAL',2).space(10)})
            tmpArr.push({font:"a",style:"bu",align:"lt",data:" ".space(48)})

            return tmpArr.length > 0 ? tmpArr : undefined
        },
        {font:"a",style:"b",align:"lt",data:" ".space(48)},
        ()=>
        {
            let tmpArr = []
            tmpArr.push({font:"a",style:"b",align:"lt",data:"Zahlungen"})
            tmpArr.push({font:"a",style:"bu",align:"lt",data:"Art".space(30) + " " + "Anzahl".space(5) + " " + "Betrag".space(8)})
            for (let i = 0; i < data.pospay.length; i++) 
            {
                if(data.pospay[i].PAY_TYPE_NAME == 'ESC')
                {
                    data.pospay[i].PAY_TYPE_NAME = 'BAR'
                }
                else if(data.pospay[i].PAY_TYPE_NAME == 'CB')
                {
                    data.pospay[i].PAY_TYPE_NAME = 'KARTE'
                }
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    data: data.pospay[i].PAY_TYPE_NAME.space(30) + " " +
                    Number(data.pospay[i].COUNTS).toFixed(0).space(5) + " " +
                    Number(data.pospay[i].AMOUNT).toFixed(2).space(8)
                })
            }
            tmpArr.push({font:"a",style:"b",align:"lt",data: ("Total : ").space(30) + " " + data.pospay.sum('COUNTS',0).space(5) + " " + data.pospay.sum('AMOUNT',2).space(8)})
            tmpArr.push({font:"a",style:"bu",align:"lt",data:" ".space(48)})

            return tmpArr.length > 0 ? tmpArr : undefined
        },
        ()=>
        {
            let tmpArr = []
            let tmpItemLst = data.possale.groupBy('ITEM_GRP_NAME').orderBy('ITEM_GRP_NAME','asc')
            
            tmpArr.push({font:"a",style:"bu",align:"lt",data:" ".space(48)})
            tmpArr.push({font:"a",style:"b",align:"lt",data:"Zahlungen Documentieren"})
            tmpArr.push({font:"a",style:"bu",align:"lt",data:"Artikel".space(30) + " " + "Anzahl".space(5) + " " + "Betrag".space(8)})
            
            for (let i = 0; i < tmpItemLst.length; i++) 
            {
                tmpArr.push(
                {
                    font: "a",
                    align: "lt",
                    data: tmpItemLst[i].ITEM_GRP_NAME.substring(0,29).space(30) + " " +
                    data.possale.where({ITEM_GRP_NAME:tmpItemLst[i].ITEM_GRP_NAME}).sum('QUANTITY',2).space(5) + " " +
                    data.possale.where({ITEM_GRP_NAME:tmpItemLst[i].ITEM_GRP_NAME}).sum('TOTAL',2).space(8)
                })
            }
            tmpArr.push({font:"a",style:"bu",align:"lt",data:" ".space(48)})
            tmpArr.push({font:"a",style:"b",align:"lt",data: ("Gesamt : ").space(30) + " " + data.possale.sum('QUANTITY',0).space(5) + " " + data.possale.sum('TOTAL',2).space(8)})

            return tmpArr.length > 0 ? tmpArr : undefined
        },
        {font:"a",style:"b",align:"lt",data:" ".space(48)}
    ]
}
