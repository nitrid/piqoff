// Depo/Mağaza Arası Sevk
const stk_02_002 = 
{
    txtRefRefno : "Seri-Sıra",
    cmbOutDepot: "Çıkış Deposu",
    cmbInDepot: "Giriş Deposu",
    dtDocDate : "Tarih",
    txtBarcode : "Barkod Ekle",
    pg_Docs : 
    {
        title : "Evrak Seçimi",
        clmDate : "TARIH",
        clmRef : "SERİ",
        clmRefNo : "SIRA",
        clmDocDate : "TARIH",
        clmInputName : "GİRİŞ",
        clmOutputName : "ÇIKIŞ",
    },
    pg_txtItemsCode : 
    {
        title : "Ürün Seçimi",
        clmCode :  "ÜRÜN KODU",
        clmName : "ÜRÜN ADI",
    },
    grdTrnsfItems: 
    {
        clmItemCode: "Kodu",
        clmItemName: "Adı",
        clmQuantity : "Adet",
        clmCreateDate: "Kayıt Tarihi",
        clmDescription :"Açıklama",
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
    msgNotQuantity:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Depo Miktarı Eksiye Düşmeye Kapalıdır ! Eklenebilecek En Yüksek Miktar:"
    },
    msgDblDepot:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Giriş Ve Çıkış Depoları Aynı Olamaz !"
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
        msgSuccess: "Transfer İşleminiz  Gerçekleştirilmiş ve Başarıyla Kayıt Edilmiştir. !",
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
        btn02: "Yeni Ekle",
        msg: "Eklemek İstediğiniz Ürün Evrakta Mevcut ! Satırlar Birleştirilsin mi ?"
    },
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
    msgQuantity:
    {
        title: "Dikkat",
        btn01: "Ekle",
        btn02: "Vazgeç",
        msg: "Lütfen Miktar Giriniz !"
    },
    txtQuantity : "Miktar",
}
export default stk_02_002