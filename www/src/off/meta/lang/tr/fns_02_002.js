// Tahsilat
const fns_02_002 = 
{
    txtRefRefno : "Seri-Sıra",
    menu : "Tahsilat",
    cmbDepot: "Depo",
    cmbCashSafe : "Kasa Seçimi",
    cmbCheckSafe : "Çek Kasası",
    cmbBank : "Banka Seçimi",
    txtCustomerCode : "Müşteri Kodu",
    txtCustomerName : "Müşteri Adı",
    dtDocDate : "Tarih",
    txtAmount : "Tutar",
    txtTotal : "Genel Toplam",
    dtShipDate :"Sevk Tarihi",
    cash : "Tutar",
    description :"Açıklama",
    checkReference : "Referans",
    btnCash : "Tahsilat Girişi",
    invoiceSelect : "Fatura Seçimi",
    installmentSelect : "Taksit Seçimi",
    ValidCash : "0'dan büyük bir tutar giriniz",
    checkDate : "Çek Tarihi",
    extraAmount : " Fazla Tutar",
    msgClearGrid : 
    {
        title : "Uyarı",
        btn01 : "Evet, Temizle",
        btn02 : "Vazgeç",
        msg : "Önceden seçilmiş faturalarınız var. Yeni fatura girişleri için sayfanız temizlensin mi?"
    },
    cmbPayType : {
        title : "Ödeme Tipi",
        cash : "Nakit",
        check : "Çek",
        bankTransfer : "Hesaba Havale",
        otoTransfer : "Otomatik Ödeme",
        foodTicket : "Yemek Çeki",
        bill : "Senet",
    },
    pg_Docs : 
    {
        title : "Evrak Seçimi",
        clmDate : "TARIH",
        clmRef : "SERİ",
        clmRefNo : "SIRA",
        clmOutputName : "CARİ ADI",
        clmOutputCode  : "CARİ KODU",
        clmTotal : "KDVLİ TOPLAM"
    },
    pg_invoices : 
    {
        title : "Fatura Seçimi",
        clmRef : "REF",
        clmRefNo : "REF NO",
        clmTypeName : "EVRAK TIP",
        clmCustomer : "CARİ ADI",
        clmDate : "TARIH",
        clmTotal : "TOPLAM",
        clmClosed : "KAPANAN",
        clmBalance  : "KALAN",
    },
    pg_txtCustomerCode : 
    {
        title : "Müşteri Seçimi",
        clmCode :  "CARİ KODU",
        clmTitle : "CARİ ADI",
        clmTypeName : "TİPİ",
        clmGenusName : "CİNSİ"
    },
    grdDocPayments: 
    {
        clmCreateDate: "Kayıt Tarihi",
        clmAmount : "Tutar",
        clmInputName : "Kasa/Banka",
        clmDescription : "Açıklama",
        clmInvoice : "Ödenen Fatura",
        clmFacDate : "Fatura Tarihi ",
        clmDocDate : "Tarih",
        clmMatchedDoc : "Ödemeyle Eşleşen Fatura"
    },
    msgDocValid:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Evrak Üst Bilgileri Tamalanmadan Ürün Girilemez !"
    },
    msgSave:
    {
        title: "Dikkat",
        btn01: "Tamam",
        btn02: "Vazgeç",
        msg: "Kayıt etmek istediğinize eminmisiniz !"
    },
    msgSaveResult:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msgSuccess: "Kayıt işleminiz başarılı !",
        msgFailed: "Kayıt işleminiz başarısız !"
    },
    msgSaveValid:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen gerekli alanları doldurunuz !"
    },
    msgDelete:
    {
        title: "Dikkat",
        btn01: "Tamam",
        btn02: "Vazgeç",
        msg: "Kaydı silmek istediğinize eminmisiniz ?"
    },
    msgLocked:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Evrak Kayıt Edildi Ve Kilitlendi !"
    },
    msgPasswordSucces:
    {
        title: "Başarılı",
        btn01: "Tamam",
        msg: "Evrakın Kilidi Açıldı !",
    },
    msgPasswordWrong:
    {
        title: "Başarısız",
        btn01: "Tamam",
        msg: "Şifreniz Hatalı !"
    },
    msgGetLocked:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Evrak Kilitlenmiş !  \n  Değişiklikleri Kaydetmek İçin Yönetici Şifresi İle Kilidi Açmalısınız !"
    },
    msgDocLocked:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Evrak Kilidi Açılmadan İşlem Yapılamaz !"
    },
    msgNotCustomer:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Müşteri Bulunmadı !!"
    },
    popCash : 
    {
        title: "Tahsilat Girişi",
        btnApprove : "Ekle"
    },
    popCheck : 
    {
        title: "Çek Girişi",
        btnApprove : "Ekle"
    },
    popBank : 
    {
        title: "Havale Girişi",
        btnApprove : "Ekle"
    },
    popCloseInvoice : 
    {
        title: "Ödeme Yapılan Faturalar",
    },
    validRef :"Seri Boş Geçilemez",
    validRefNo : "Sıra Boş Geçilemez",
    validDepot : "Depo Seçmelisiniz",
    validCustomerCode : "Müşteri Kodu Boş Geçilemez",
    validDocDate : "Tarih Seçmelisiniz",
    msgInvoiceSelect:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Fatura seçmeden işlem yapamazsınız !"
    },
    msgRowNotUpdate:
    {
        title:"Dikkat",
        btn01:"Tamam",
        msg:"Bu işlemi yapabilmeniz için ilgili bağlantıyı koparın.",
    },
}

export default fns_02_002