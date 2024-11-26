// "Satış Fiş Raporu"
const pos_02_001 =
{
    TicketId :"Fiş I.D",
    cmbCustomer :"Müşteri",
    btnGet :"Getir",
    dtFirst : "İlk Tarih",
    dtLast : "Son Tarih",
    txtCustomerCode : "Müşteri",
    cmbDevice :"Cihaz",
    txtTicketno : "Fiş I.D",
    numFirstTicketAmount : "Alt Tutar",
    numLastTicketAmount : "Üst Tutar",
    cmbUser :"Kulanıcı",
    txtItem :"Ürün Kodu",
    ckhDoublePay : "Birden Fazla Ödeme",
    pg_txtCustomerCode : 
    {
        title : "Müşteri Seçimi",
        clmCode :  "CARİ KODU",
        clmTitle : "CARİ ADI",
        clmTypeName : "TİPİ",
        clmGenusName : "CİNSİ"
    },
    grdSaleTicketReport: 
    {
        clmDate: "Tarih",
        clmTime: "Saat",
        slmUser: "Kullanıcı",
        clmCustomer : "Müşteri",
        clmCardId : "Kard Id",
        clmDiscount : "İndirim",
        clmLoyalyt: "Loyalyt",
        clmHT : "Ara Toplam",
        clmVTA : "Vergi",
        clmTTC : "Toplam",
        clmTicketID :"Fiş I.D",
        clmFacRef : "Fact. No",
        clmRef : "Ref No",
    },
    pg_txtItem:
    {
        title: "Ürün Seçim",
        clmCode: "KODU",
        clmName: "ADI", 
    },
    grdSaleTicketItems :
    {
        clmBarcode : "Barkod",
        clmName : "Ürün Adı",
        clmQuantity : "Adet",
        clmPrice : "Fiyat",
        clmTotal : "Tutar",
        clmTime : "Saat"
    },
    grdSaleTicketPays : 
    {
        clmPayName : "Ödeme Tipi", 
        clmTotal : "Tutar",
    },
    popDetail : 
    {
        title : "Fiş Detayı"
    },
    cmbPayType : 
    {
        title : "Ödeme Tipi",
        esc:"Nakit",
        cb : "K. Kartı",
        check : "Çek",
        ticket : "T.Rest",
        bonD : "İade Fişi",
        avoir : "İade",
        virment : "Havale",
        prlv :"Oto. Ödeme",
        all :"Tümü",
    },
    payChangeNote : "Fiş üzerinde yapılan değişiklikler istisnai olarak yapılmalı ve hataların düzeltilmesine izin verilmelidir!",
    payChangeNote2 : "Değişikliklerin geçmişi kaydedilir!",
    txtPayChangeDescPlace : "Lütfen Açıklama Giriniz",
    txtPayChangeDesc :"Ödeme tipi hatalı girilmiştir.Düzeltmesi yapıldı.",
    popLastTotal : 
    {
        title : "Tahsilat"
    },
    trDeatil: "T.R Detay",
    lineDelete :"Satır İptal",
    cancel : "Vazgeç",
    popOpenTike :
    {
        title : "Tamamlanmamış Fişler"
    },
    grdOpenTike: 
    {
        clmUser : "Kullanıcı",
        clmDevice : "Cihaz",
        clmDate : "Tarih",
        clmTicketId : "Fiş No",
        clmTotal : "Tutar",
        clmDescription :"Açıklama",
    },
    popDesign : 
    {
        title: "Dizayn seçimi",
        design : "Dizayn",
        lang : "Evrak Dili"
    },
    btnMailSend : "Mail Gönder", 
    mailPopup : 
    {
        title : "Mail Adresi Girişi"
    },
    msgFacture:
    {
        title: "Dikkat",
        btn01: "Tamam",
        btn02: "İptal",
        msg: "Seçtiğiniz Fişler Faturaya Çevirilecektir! Onaylıyormusunuz ?"
    },
    msgFactureCustomer:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Müşteri tanımlayanmamış fiş faturaya çevrilemez !"
    },
}

export default pos_02_001