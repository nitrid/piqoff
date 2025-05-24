// "Şube Alış Faturası"
const ftr_02_008 =
{
    txtRefRefno : "Seri-Sıra",
    cmbDepot: "Depo",
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
    getPayment : "Ödeme Girişi",
    cash : "Tutar",
    description :"Açıklama",
    checkReference : "Referans",
    btnCash : "Ödeme Ekle",
    btnCheck : "Çek",
    btnBank : "Havale",
    cmbCashSafe : "Kasa Seçimi",
    cmbCheckSafe : "Çek Kasası",
    cmbBank : "Banka Seçimi",
    txtPayInvoıceTotal : "Fatura Tutarı",
    txtPayTotal : "Ödeme Toplamı",
    txtRemainder : "Kalan",
    txtBarcode : "Barkod Ekle",
    txtBarcodePlace: "Barkod Okutunuz",
    txtQuantity :"Miktar",
    getOrders : "Sipariş Getir",
    tabTitleSubtotal : "Fatura Toplamı",
    tabTitlePayments : "Evrak Ödeme Bilgileri",
    tabTitleOldInvoices : "Geçmiş Fatura Bilgileri",
    getRemainder : "Kalan Tutarı Getir",
    txtbalance : "Müşteri Toplam Bakiyesi",
    txtUnitFactor : "Birim Katsayısı",
    txtUnitQuantity : "Birim Miktarı",
    txtTotalQuantity : "Toplam Miktar",
    txtUnitPrice: "Birim Fiyatı",
    txtExpFee : "Gecikme Cezası",
    dtExpDate : "Vade Tarihi", 
    btnView : "Görüntüle",
    btnMailsend : "Mail Gönder",
    placeMailHtmlEditor : "Mailinize açıklama girebilirsiniz.",
    validDesign : "Lütfen Dizayn seçiniz.",
    validMail : "Lütfen Boş Geçmeyin.",
    txtTotalHt : "İndirimli Tutar",
    txtDocNo : "Belge No",
    isMsgSave :
    {  
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Evrak Kayıt Edilmeden Işlem yapılamaz !"         
    },
    msgMailSendResult:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msgSuccess: "Mail gönderimi başarılı !",
        msgFailed: "Mail gönderimi başarısız !"
    },
    popMailSend : 
    {
        title :"E-Mail Gönder",
        txtMailSubject : "E-Mail Başlığı",
        txtSendMail : "E-Mail Adresi",
        btnSend : "Gönder",
        cmbMailAddress : "Gönderilecek E-Mail Adresi"
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
    pg_txtCustomerCode : 
    {
        title : "Müşteri Seçimi",
        clmCode :  "CARİ KODU",
        clmTitle : "CARİ ADI",
        clmTypeName : "TİPİ",
        clmGenusName : "CİNSİ"
    },
    pg_txtItemsCode : 
    {
        title : "Ürün Seçimi",
        clmCode :  "ÜRÜN KODU",
        clmName : "ÜRÜN ADI",
    },
    pg_dispatchGrid : 
    {
        title : "İrsaliye Seçimi",
        clmReferans : "Seri - Sıra",
        clmCode : "Kodu",
        clmName : "Adı",
        clmQuantity : "Adet",
        clmPrice : "Fiyat",
        clmTotal : "Tutar",
        clmDate : "Tarih",
    },
    grdSlsInv: 
    {
        clmItemCode: "Kodu",
        clmItemName: "Adı",
        clmPrice: "Fiyat",
        clmQuantity : "Adet",
        clmDiscount : "İndirim",
        clmDiscountRate : "İndirim %",
        clmVat : "KDV",
        clmAmount : "Tutar",
        clmTotal : "G.Toplam",
        clmTotalHt : "Ver.Haric Top.",
        clmDispatch : "İrsaliye No",
        clmCreateDate: "Kayıt Tarihi",
        clmMargin :"Marj",
        clmDescription :"Açıklama",
        clmCuser :"Kullanıcı",
        clmVatRate : "KDV %",
        clmSubQuantity : "Alt Birim",
        clmSubPrice : "Alt Birim Fiyatı",
        clmSubFactor : "Katsayı",
    },
    pg_partiLot : 
    {
        title : "Parti Lot Seçimi",
        clmLotCode : "Parti Kodu",
        clmSkt : "SKT",
    },
    grdInvoicePayment: 
    {
        clmInputName: "Kasa",
        clmTypeName: "Tipi",
        clmPrice: "Fiyat",
        clmCreateDate: "Kayıt Tarihi",

    },
    popPayment:
    {
        title: "Tahsilatlar",
    },
    popDiscount : 
    {
        title: "Satır İndirimi",
        chkFirstDiscount : "Satırdaki 1. İndirimleri Güncelleme",
        chkDocDiscount : "Evrak İndirimi Olarak Uygula",
        Percent1 : "1. İnd. Yüzde",
        Price1 : "1. İnd. Tutar",
        Percent2 : "2. İnd. Yüzde",
        Price2 : "2. İnd. Tutar",
        Percent3 : "3. İnd. Yüzde",
        Price3 : "3. İnd. Tutar"
    },
    popDocDiscount : 
    {
        title: "Evrak İndirimi",
        Percent1 : "1. İnd. Yüzde",
        Price1 : "1. İnd. Tutar",
        Percent2 : "2. İnd. Yüzde",
        Price2 : "2. İnd. Tutar",
        Percent3 : "3. İnd. Yüzde",
        Price3 : "3. İnd. Tutar"
    },
    popPassword : 
    {
        title: "Evrakı Açmak İçin Yönetici Şifresini Girmelisiniz",
        Password : "Şifre",
        btnApprove : "Onayla"
    },
    msgDocValid:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Evrak Üst Bilgileri Tamalanmadan Ürün Girilemez !"
    },
    msgMoreAmount:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Kalan Tutardan Fazla Tahsilat Girilemez !"
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
    msgVatDelete:
    {
        title: "Dikkat",
        btn01: "Tamam",
        btn02: "Vazgeç",
        msg: "Vergiyi Sıfırlamak istediğinize eminmisiniz !"
    },
    msgDiscountPrice:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Tutardan Büyük İndirim Yapılamaz !"
    },
    msgDiscountPercent:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Tutardan Büyük İndirim Yapılamaz !"
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
    msgPayNotDeleted:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Ödemesi Yapılmış Evrak Silinemez!"
    },
    msgDocLocked:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Evrak Kilidi Açılmadan İşlem Yapılamaz !"
    },
    msgDiscount:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "İndirim Tutardan Yüksek Olamaz !"
    },
    msgItemNotFound:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Ürün Bulunmadı !!"
    },
    msgNotCustomer:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Müşteri Bulunmadı !!"
    },
    msgCombineItem:
    {
        title: "Dikkat",
        btn01: "Birleştir",
        btn02: "Yeni Ekle",
        msg: "Eklemek İstediğiniz Ürün Evrakta Mevcut ! Satırlar Birleştirilsin mi ?"
    },
    msgCustomerSelect:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen Müşteri Seçiniz !"
    },
    popCash : 
    {
        title: "Nakit Girişi",
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
    popDesign : 
    {
        title: "Dizayn seçimi",
        design : "Dizayn",
        lang : "Evrak Dili"
    },
    msgMissItemCode:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Bulunamayan Kodlar :"
    },
    msgMultiCodeCount:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Eklenen Ürün Sayısı"
    },
    popMultiItem:
    {
        title: "Toplu Ürün Ekleme",
        btnApprove: "Ürünleri Getir",
        btnClear : "Temizle",
        btnSave : "Satırları Ekle",
    },
    cmbMultiItemType : 
    {
        title : "Arama Şekli",
        customerCode : "Tedarikçi Koduna Göre",
        ItemCode : "Ürün Koduna Göre"
    },
    grdMultiItem : 
    {
        clmCode : "Ürün Kodu",
        clmMulticode : "Tedarikçi Kodu",
        clmName : "Ürün Adı",
        clmQuantity : "Adet"
    },
    msgMultiData:
    {
        title: "Dikkat",
        btn01: "Listeyi Temizle ve Hepsini Ekle",
        btn02: "Yeni Yazılanları Listeye Ekle",
        msg: "Listede Ürünler Var! "
    },
    msgUnit:
    {
        title: "Birim Seçimi",
        btn01: "Onayla",
    },
    validRef :"Seri Boş Geçilemez",
    validRefNo : "Sıra Boş Geçilemez",
    validDepot : "Depo Seçmelisiniz",
    validCustomerCode : "Müşteri Kodu Boş Geçilemez",
    validDocDate : "Tarih Seçmelisiniz",
    tagItemCodePlaceholder: "Lütfen Eklemek İstediğiniz Kodları Giriniz",
    msgNotQuantity:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Depo Miktarı Eksiye Düşmeye Kapalıdır ! Eklenebilecek En Yüksek Miktar:"
    },
    pg_txtBarcode : 
    {
        title : "Barkod Seçimi",
        clmCode :  "ÜRÜN KODU",
        clmName : "ÜRÜN ADI",
        clmMulticode : "TEDARİKÇİ KODU",
        clmBarcode : "BARKOD"
    },
    msgQuantity:
    {
        title: "Miktar",
        btn01: "Ekle",
        msg: "Miktar Giriniz"
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
    popDetail:
    {
        title: "Evrak İçeriği",
        count: "Toplam Satır",
        quantity: "Toplam Miktar",
        quantity2: "2. Birim Toplamı ",
        margin : "Marj"
    },
    popUnit2 : 
    {
        title : "Birim Detayları"
    },
    grdUnit2 : 
    {
        clmName : "ADI",
        clmQuantity : "Adet"
    },
    pg_adress : 
    {
        title : "Adres Seçimi",
        clmAdress : "ADRES",
        clmCiyt : "ŞEHİR",
        clmZipcode : "POSTA  KODU",
        clmCountry : "ÜLKE",
    },
    msgCode : 
    {
        title: "Dikkat",
        btn01: "Evrağa Git",
        msg: "Evrak Bulundu"
    },
    popMailSend : 
    {
        title :"E-Mail Gönder",
        txtMailSubject : "E-Mail Başlığı",
        txtSendMail : "E-Mail Adresi",
        btnSend : "Gönder",
        cmbMailAddress : "Gönderilecek E-Mail Adresi"
    },
    msgMailSendResult:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msgSuccess: "Mail gönderimi başarılı !",
        msgFailed: "Mail gönderimi başarısız !"
    },
    popMailSend : 
    {
        title :"E-Mail Gönder",
        txtMailSubject : "E-Mail Başlığı",
        txtSendMail : "E-Mail Adresi",
        btnSend : "Gönder",
        cmbMailAddress : "Gönderilecek E-Mail Adresi"
    },
    msgMailSendResult:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msgSuccess: "Mail gönderimi başarılı !",
        msgFailed: "Mail gönderimi başarısız !"
    },
    popRound : 
    {
        title : "Lütfen Tuvarlamak İstediğiniz Tutarı Giriniz",
        total : "Tutar",
    },
    msgWorngRound:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg1: "Yuvarlamak istediğiniz tutarlar arasında en fazla ",
        msg2: "€ fark olabilir !"
    },
    msgDiscountEntry : 
    {
        title : "Tutarsal İndirim Girişi",
        btn01 : "Onayla"
    },
    txtDiscount1 : "1. İndirim Tutarı",
    txtDiscount2 : "2. İndirim Tutarı",
    txtDiscount3 : "3. İndirim Tutarı",
    txtTotalDiscount :"Toplam İndirim Tutarı",
    msgDiscountPerEntry : 
    {
        title : "Oransal İndirim Girişi",
        btn01 : "Onayla"
    },
    txtDiscountPer1 : "1. İndirim Oranı",
    txtDiscountPer2 : "2. İndirim Oranı",
    txtDiscountPer3 : "3. İndirim Oranı",
    serviceAdd : "Hizmet Ekle",
    pg_service : 
    {
        title : "Hizmetler",
        clmCode : "Kod",
        clmName : "Adı"
    },
    msgCustomerLock:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Ürün Eklendikten Sonra Müşteri Değiştirilemez !"
    },
    msgNewPrice : 
    {
        title: "Dikkat",
        btn01: "Hiç Birini Güncelleme",
        btn02: "Seçilen Fiyatları Güncelle",
        msg: "Lütfen Tedarikçi Fiyatını Güncellemek İstediğiniz Ürünleri Seçiniz.. "
    },
    msgNewPriceDate : 
    {
        title: "Dikkat",
        btn01: "Hiç Birini Güncelleme",
        btn02: "Seçilen Fiyatları Güncelle",
        msg: "Lütfen Tarihlerini Güncellemek İsteidiğiniz Ürünleri Seçiniz.. "
    },
    grdNewPrice: 
    {
        clmCode: "Kodu",
        clmName: "Adı",
        clmPrice: "Eski T. Fiyat",
        clmPrice2: "Yeni Fiyat",
        clmSalePrice :"Satış Fiyatı", 
        clmMargin : "Brüt Marj",
        clmCostPrice : "Maliyet Fiyatı",
        clmNetMargin : "Net Marj",
        clmMarge : "Marj"
    },
    grdNewPriceDate: 
    {
        clmCode: "Kodu",
        clmName: "Adı",
        clmPrice: "Eski T. Fiyat",
        clmPrice2: "Yeni Fiyat",
        clmSalePrice :"Satış Fiyatı", 
        clmMargin : "Brüt Marj",
        clmCostPrice : "Maliyet Fiyatı",
        clmNetMargin : "Net Marj",
        clmMarge : "Marj"
    },
    msgCompulsoryCustomer:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Seçilen Ürün Müşteriye Tanımlı Değil !"
    },
    msgNewVat : 
    {
        title: "Dikkat",
        btn01: "Hiç Birini Güncelleme",
        btn02: "Seçilen Oranları Güncelle",
        msg: "Fatura ile Sistemde Farklı KDV oranları mevcut.. "
    },
    grdNewVat: 
    {
        clmCode: "Kodu",
        clmName: "Adı",
        clmVat: "Sistemdeki KDV",
        clmVat2: "Yeni KDV",
    },
    msgPriceDateUpdate :
    {
        msg : "Değişmeyen Fiyatların Tarihlerini Güncellemek İstiyormusunuz? ",
        btn01 : "Evet",
        btn02 : "Hayır",
        title : "Dikkat"
    },
}

export default ftr_02_008