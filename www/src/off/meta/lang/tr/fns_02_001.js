// Ödeme
const fns_02_001 =
{
    txtRefRefno : "Seri-Sıra",
    menu  : "Ödeme",
    cmbDepot: "Depo",
    cmbCashSafe : "Kasa Seçimi",
    cmbCheckSafe : "Çek Kasası",
    cmbBank : "Banka Seçimi",
    txtCustomerCode : "Müşteri Kodu",
    txtCustomerName : "Müşteri Adı",
    dtDocDate : "Tarih",
    txtAmount : "Tutar",
    txtDiscount : "Satır İndirimi",
    txtDocDiscount : "Evrak İndirimi",
    txtSubTotal : "Ara Toplam",
    txtMargin : "Marj",
    txtVat : "Kdv",
    txtTotal : "Genel Toplam",
    dtShipDate :"Sevk Tarihi",
    getDispatch : "İrsaliye Getir",
    cash : "Tutar",
    description :"Açıklama",
    checkReference : "Referans",
    btnAddPay : "Ödeme Girişi",
    invoiceSelect : "Fatura Seçimi",
    btnCash : "Ödeme Girişi",
    ValidCash : "0'dan büyük bir tutar giriniz",
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
        clmInputName : "CARİ ADI",
        clmInputCode  : "CARİ KODU",
        clmTotal : "KDVLİ TOPLAM"
    },
    pg_invoices : 
    {
        title : "Fatura Seçimi",
        clmReferans : "REFERANS",
        clmOutputName : "CARİ ADI",
        clmDate : "TARIH",
        clmTotal : "TOPLAM",
        clmRemaining  : "KALAN",
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
        clmOutputName : "Kasa/Banka",
        clmDescription : "Açıklama",
        clmInvoice : "Fatura Referansı",
        clmFacDate : "Fatura Tarihi",
        clmDocDate : "Tarih"
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
        msg: "Kayıt etmek istediğinize emin misiniz !"
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
        msg: "Kaydı silmek istediğinize emin misiniz ?"
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
    validRef :"Seri Boş Geçilemez",
    validRefNo : "Sıra Boş Geçilemez",
    validDepot : "Depo Seçmelisiniz",
    validCustomerCode : "Müşteri Kodu Boş Geçilemez",
    validDocDate : "Tarih Seçmelisiniz",
    msgInvoiceSelect:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Fatura seçmeden ödeme ekleyemezsiniz !"
    },
    msgNotBank : "Lütfen bir hesap seçiniz",
}

export default fns_02_001