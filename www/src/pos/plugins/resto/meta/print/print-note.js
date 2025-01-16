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
        ()=>{return {font:"a",style:"b",align:"ct",data:""}},
        // ÜST BİLGİ
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].ADDRESS1 : "7 ALLEE DU MIDI"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].ZIPCODE + " " + data.firm[0].CITY + " " + data.firm[0].COUNTRY_NAME : "54270 ESSEY LES NANCY FRANCE"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? "Tel : " + data.firm[0].TEL : "Tel : 03 83 52 62 34"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].MAIL : "info@piqsoft.fr"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? data.firm[0].WEB : "www.piqsoft.fr"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? "Siret " + data.firm[0].SIRET_ID + " - APE " + data.firm[0].APE_CODE : "Siret 94 929 096 900 011 - APE 6201Z"}},
        ()=>{return {font:"a",style:"b",align:"ct",data: data.firm.length > 0 ? "Nr. TVA " + data.firm[0].INT_VAT_NO : "Nr. TVA FR61949290969"}},
        ()=>{return {font:"b",align:"lt",pdf:{fontSize:11},data:moment(new Date(data.rest[0].LDATE).toISOString()).utcOffset(0,false).locale('fr').format('dddd DD.MM.YYYY HH:mm:ss')}},
        ()=>{return {font:"b",align:"lt",pdf:{fontSize:11},data:("Caissier: " + data.rest[0].CUSER).space(32,'e')}},
        // //FIS NO BARKODU
        ()=>{return {align:"ct",barcode:data.rest[0].GUID.substring(19,36),options:{width: 1,height:40,position:'OFF'}}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"****** Numero de Note de Caisse ******"}},
        ()=>{return {font:"a",style:"b",align:"ct",data:"****** " + data.rest[0].REF + " ******"}},
        ()=>{return {font:"b",align:"lt",data:" ".space(64)}},
        ()=>
        {
            if(data.special.reprint > 0)
            {
                return {font:"b",style:"b",align:"ct",data: "DUPLICATA"}
            }   
            return
        },
        ()=>
        {
            let tmpArr = []
            tmpArr.push({font:"b",style:"b",align:"ct",data:"NOTE DE VENTE"})
            tmpArr.push({font:"b",style:"b",align:"ct",data: " ".space(64)})
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        // BAŞLIK 2
        ()=>
        {
            let tmpTitle = {}
            tmpTitle = {font:"b",style:"bu",align:"lt",
            data:"Libelle".space(32) + " " + "Qte".space(8) + " " + "U ou EUR/kg".space(11) + " " + "Prix EUR".space(8)}
            return tmpTitle
        },
        // SATIŞ LİSTESİ
        ()=>
        {
            let tmpArr = []
            for(let i = 0; i < data.rest.length; i++)
            {
                tmpArr.push( 
                {
                    font: "b",
                    align:"lt",
                    data:   (data.rest[i].ITEM_NAME).toString().space(32) + " " +
                            parseFloat(data.rest[i].QUANTITY).toFixed(2).toString().space(13,'e') + " " +
                            parseFloat(data.rest[i].PRICE).toFixed(2).toString().space(7,"e") + " " +
                            parseFloat(data.rest[i].AMOUNT).toFixed(2).toString().space(7,"s")
                })
            }
            return tmpArr.length > 0 ? tmpArr : undefined
        },
        {font:"b",style:"bu",align:"lt",data:" ".space(64)},
        // DIP TOPLAM
        ()=>
        {
            return {
                font: "b",
                size : [1,1],
                style: "b",
                align: "lt",
                data: "Total TTC".space(17) + 
                (decimal(parseFloat(data.rest.sum("TOTAL")).toFixed(2)) + "EUR").space(15,"s")
            }
        },
        {font:"b",style:"bu",align:"lt",data:" ".space(64)},
        ()=>{return {font:"b",align:"lt",data: (data.rest.length.toString() + " Article(s)").space(14)}},
        ()=>
        {
            return {font:"b",style:"b",align:"ct",data:data.special.certificate}
        },
        ()=>
        {
            if(data.special.reprint > 0)
            {
                let tmpArr = []

                tmpArr.push({font:"b",style:"b",align:"ct",data:"Numéro de Réimpression " + (data.special.reprint)})
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
