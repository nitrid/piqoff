// "Alış Teklifi"
const tkf_02_001 =
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
    txtBarcode : "Barkod Ekle",
    txtBarcodePlace: "Barkod Okutunuz",
    txtQuantity :"Miktar",
    txtUnitFactor : "Birim Katsayısı",
    txtUnitQuantity : "Birim Miktarı",
    txtTotalQuantity : "Toplam Miktar",
    txtUnitPrice: "Birim Fiyatı",
    btnView : "Görüntüle",
    btnMailsend : "Mail Gönder",
    validMail : "Lütfen Boş Geçmeyin.",
    placeMailHtmlEditor : "Mailinize açıklama girebilirsiniz.",
    validDesign : "Lütfen Dizayn seçiniz.",
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
        clmOutputName : "CARİ ADI",
        clmOutputCode  : "CARİ KODU",
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
        clmMulticode : "TEDARİKÇİ KODU",
        clmPrice : "ALIŞ FİYATI"
    },
    grdPurcoffers: 
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
        clmCreateDate: "Kayıt Tarihi",
        clmMargin :"Marj",
        clmMulticode :"T.Kodu",
        clmBarcode :"Barkodu",
        clmDescription :"Açıklama",
        clmCuser :"Kullanıcı",
        clmVatRate : "KDV %"
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
    popDesign : 
    {
        title: "Dizayn seçimi",
        design : "Dizayn",
        lang : "Evrak Dili"
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
    msgVatDelete:
    {
        title: "Dikkat",
        btn01: "Tamam",
        btn02: "Vazgeç",
        msg: "Vergiyi Sıfırlamak istediğinize emin misiniz !"
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
    msgLockedType2:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Siparişe Çevirilmiş Evrak Kilidi Açılamaz"
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
    msgCustomerNotFound:
    {
        title: "Dikkat",
        btn01: "Devam Et",
        btn02: "Vazgeç",
        msg: "Seçilen Ürün Müşteriye Tanımlı Değil ! Devam Etmek İstiyormusunuz"
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
    msgQuantity:
    {
        title: "Miktar",
        btn01: "Ekle",
        msg: "Miktar Giriniz"
    },
    pg_txtBarcode : 
    {
        title : "Barkod Seçimi",
        clmCode :  "ÜRÜN KODU",
        clmName : "ÜRÜN ADI",
        clmMulticode : "TEDARİKÇİ KODU",
        clmBarcode : "BARKOD"
    },
    msgRowNotUpdate:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Bu Satır Siparişe Çevirilmiştir Değişiklik Yapamazsınız!"
    },
    msgRowNotDelete :
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Bu Satır Siparişe Çevirilmiştir Silme İşlemi Yapamazsınız !"
    },
    msgdocNotDelete : 
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Evrakınızda siparişe çevirilmiş satır var.. Bu evrak silinemez !"
    },
    msgCode :
    {
        title: "Dikkat",
        btn01: "Evrağa Git",
        msg: "Evrak Bulundu"
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
    txtTotalHt: "İndirimli Toplam",
}

export default tkf_02_001