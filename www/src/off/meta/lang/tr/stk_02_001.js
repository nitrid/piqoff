// Sayım Evrakı
const stk_02_001 = 
{
    txtRefRefno : "Seri-Sıra",
    cmbDepot: "Sayım Deposu",
    dtDocDate : "Tarih",
    txtBarcode : "Barkod Ekle",
    txtQuantity :"Miktar",
    txtAmount : "Toplam Değer",
    pg_Docs : 
    {
        title : "Evrak Seçimi",
        clmDate : "TARIH",
        clmRef : "SERİ",
        clmRefNo : "SIRA",
        clmDocDate : "TARIH",
        clmDepotName : "DEPO/MAĞAZA",
        clmQuantity :"Toplam Ürün Miktarı",
        clmTotalLine : "Satır Sayısı"
    },
    pg_txtItemsCode : 
    {
        title : "Ürün Seçimi",
        clmCode :  "ÜRÜN KODU",
        clmName : "ÜRÜN ADI",
        clmPrice : "ALIS FIYATI",
    },
    grdItemCount: 
    {
        clmItemCode: "Kodu",
        clmItemName: "Adı",
        clmQuantity : "Adet",
        clmCreateDate: "Kayıt Tarihi",
        clmDescription :"Açıklama",
        clmCostPrice :"Birim Maliyet",
        clmTotalCost :"Toplam Maliyet",
        clmCustomerName :"Tedarikci Müşteri",
        clmMulticode : "Tedarikçi Kodu",
        clmBarcode : "Barkod",
        clmCuser : "Kullanıcı"
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
    msgSave:
    {
        title: "Dikkat",
        btn01: "Tamam",
        btn02: "Vazgeç",
        msg: "Kayıt etmek istediğinize eminmisiniz !"
    },
    msgQuantity:
    {
        title: "Dikkat",
        btn01: "Ekle",
        btn02: "Vazgeç",
        msg: "Lütfen Miktar Giriniz !"
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
    msgBigQuantity:
    {
        title: "Dikkat",
        btn01: "Devam Et",
        btn02: "Vazgeç",
        msg: "Girdiğiniz Miktar 1000'den Büyük Devam Etmek İstediğinize Eminmisiniz ?"
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
    msgItemNotFound:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Ürün Bulunmadı !!"
    },
    msgCombineItem:
    {
        title: "Dikkat",
        btn01: "Birleştir",
        btn02: "Değiştir",
        btn03: "Vazgeç",
        msg: "Eklemek İstediğiniz Ürün Evrakta Mevcut ! Satırlar Birleştirilsin mi ?"
    },
    validRef :"Seri Boş Geçilemez",
    validRefNo : "Sıra Boş Geçilemez",
    validDepot : "Depo Seçmelisiniz",
    validCustomerCode : "Müşteri Kodu Boş Geçilemez",
    validDocDate : "Tarih Seçmelisiniz",
    popDesign : 
    {
        title: "Dizayn seçimi",
        design : "Dizayn",
        lang : "Evrak Dili"
    },
    pg_txtBarcode : 
    {
        title : "Barkod Seçimi",
        clmCode :  "ÜRÜN KODU",
        clmName : "ÜRÜN ADI",
        clmMulticode : "TEDARİKÇİ KODU",
        clmBarcode : "BARKOD"
    },
    msgCode :
    {
        title: "Dikkat",
        btn01: "Evrağa Git",
        btn02: "Vazgeç",
        msg: "Evrak Bulundu"
    },
}
export default stk_02_001