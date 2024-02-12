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
        {font:"a",style:"b",align:"ct",data: this.firm.length > 0 ? this.firm[0].ADDRESS1 : "Bahnhafstrasse 13"},
        {font:"a",style:"b",align:"ct",data: this.firm.length > 0 ? this.firm[0].ZIPCODE + " " + this.firm[0].CITY + " " + this.firm[0].COUNTRY_NAME : "6020 EMMENBRUCKE"},
        {font:"a",style:"b",align:"ct",data: this.firm.length > 0 ? "Tel : " + this.firm[0].TEL : "Tel : +41 76 260 38 66"},
        {font:"a",style:"b",size : [1,1],align:"ct",data:""},
        {font:"a",style:"b",size : [1,1],align:"ct",data: "Z REPORT"},
        {font:"a",style:"b",size : [1,1],align:"ct",data:""},
        {font:"a",align:"lt",data:moment(new Date().toISOString()).utcOffset(0,false).locale('fr').format('dddd DD.MM.YYYY HH:mm:ss')},
        {font:"a",align:"lt",pdf:{fontSize:11},data:("Caissier: " + this.user.CODE).space(25,'e') + ("Caisse: " + window.localStorage.getItem('device')).space(23,'s')},
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
