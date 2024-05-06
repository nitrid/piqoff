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
        {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].ADDRESS1 : "7 ALLEE DU MIDI"},
        {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].ZIPCODE + " " + data.firm[0].CITY + " " + data.firm[0].COUNTRY_NAME : "54270 ESSEY LES NANCY FRANCE"},
        {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? "Tel : " + data.firm[0].TEL : "Tel : 03 83 52 62 34"},
        {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].MAIL : "info@piqsoft.fr"},
        {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].WEB : "www.piqsoft.fr"},
        {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? "Siret " + data.firm[0].SIRET_ID + " - APE " + data.firm[0].APE_CODE : "Siret 94 929 096 900 011 - APE 6201Z"},
        {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? "Nr. TVA " + data.firm[0].INT_VAT_NO : "Nr. TVA FR61949290969"},
        {font:"a",style:"b",size : [1,1],align:"ct",data:""},
        {font:"a",style:"b",size : [1,1],align:"ct",data: "Z REPORT"},
        {font:"a",style:"b",size : [1,1],align:"ct",data:""},
        {font:"a",align:"lt",data:moment(new Date().toISOString()).utcOffset(0,false).locale('fr').format('dddd DD.MM.YYYY HH:mm:ss')},
        {font:"a",align:"lt",pdf:{fontSize:11},data:("Caissier: " + data.special.user).space(25,'e') + ("Caisse: " + data.special.device).space(23,'s')},
        {font:"a",style:"b",align:"lt",data:" ".space(48)},
        {font:"a",style:"bu",align:"rt",data:" ".space(5) + " " + "Taux".space(8) + " " + "HT".space(10) + " " + "TVA".space(10) + " " + "TTC".space(10)},
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
                        data.possale.where({VAT_RATE:tmpVatLst[i].VAT_RATE}).sum('PFAMOUNT',2).space(10) + " " + 
                        data.possale.where({VAT_RATE:tmpVatLst[i].VAT_RATE}).sum('PVAT',2).space(10) + " " + 
                        data.possale.where({VAT_RATE:tmpVatLst[i].VAT_RATE}).sum('PTOTAL',2).space(10)
                })
            }
            tmpArr.push({font: "a",align: "rt",data: ("Total : ").space(16) + data.possale.sum('PFAMOUNT',2).space(10) + " " + data.possale.sum('PVAT',2).space(10) + " " + data.possale.sum('PTOTAL',2).space(10)})
            tmpArr.push({font:"a",style:"bu",align:"lt",data:" ".space(48)})

            return tmpArr.length > 0 ? tmpArr : undefined
        },
        {font:"a",style:"b",align:"lt",data:" ".space(48)},
        ()=>
        {
            let tmpArr = []
            for (let i = 0; i < data.pospay.length; i++) 
            {
                tmpArr.push({font: "b",align: "lt",size : [1,1],data: data.pospay[i].PAY_TYPE_NAME.space(16) + " " + Number(data.pospay[i].AMOUNT).toFixed(2).space(10)})
                tmpArr.push({font:"a",style:"b",align:"lt",data:" ".space(48)})
            }
            tmpArr.push({font: "b",align: "lt",size : [1,1],data: ("Total : ").space(16) + " " + data.pospay.sum('AMOUNT',2).space(10)})

            return tmpArr.length > 0 ? tmpArr : undefined
        },
        {font:"a",style:"b",align:"lt",data:" ".space(48)}
    ]
}
