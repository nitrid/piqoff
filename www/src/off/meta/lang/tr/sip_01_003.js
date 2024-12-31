// "Hazırlanacak Sipariş Listesi"
const sip_01_003 =
{
    cmbCustomer :"Müşteri",
    btnGet :"Getir",
    chkInvOrDisp :"Sadece açık siparişleri göster",
    dtFirst : "İlk Tarih",
    dtLast : "Son Tarih",
    txtCustomerCode : "Müşteri",
    menu:"Satış Sipariş",
    pg_txtCustomerCode : 
    {
        title : "Müşteri Seçimi",
        clmCode :  "CARİ KODU",
        clmTitle : "CARİ ADI",
        clmTypeName : "TİPİ",
        clmGenusName : "CİNSİ"
    },
    grdSlsOrdList: 
    {
        clmRef: "Seri",
        clmRefNo: "Sıra",
        clmPrice: "Fiyat",
        clmInputCode : "Müşteri Kodu",
        clmInputName : "Müşteri Adı",
        clmDate: "Tarih",
        clmVat : "KDV",
        clmAmount : "Tutar",
        clmTotal : "Toplam",
        clmOutputName :"Depo",
        clmMainGroup : "Müşteri Grubu",
        clmStatus : "Durum",
        clmColis : "Koli",
        clmPalet : "Palet",
        clmBox : "Kutu",
        clmLivre : "Gönderildi"
    },
    popDesign : 
    {
        title: "Dizayn seçimi",
        design : "Dizayn",
        lang : "Evrak Dili"
    },
    msgConvertDispatch :
    {  
        title: "Dikkat",
        btn01: "Tamam",
        btn02: "Vazgeç",
        msg: "Seçilen Evrakları İrsaliyeye çevirmek istediğinize emin misiniz?"         
    },
    msgConvertSucces :
    {  
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Seçilen Evrakları İrsaliyeye çevrildi.."         
    },
    btnView : "Görüntüle",
    btnMailsend : "Mail Gönder",
    cmbMainGrp : "Müşteri Grubu",
    statusType : 
    {
        blue : "Hazırlanıyor",
        green : "Hazırlandı",
        yellow : "Eksik Tamamlandı",
        grey : "Bekliyor"
    }
}

export default sip_01_003