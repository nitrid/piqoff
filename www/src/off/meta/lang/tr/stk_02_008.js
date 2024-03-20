// Ürün Giriş Fişi
const stk_02_008 = 
{
    txtRefRefno : "Seri-Sıra",
    cmbOutDepot: "Giriş Deposu",
    dtDocDate : "Tarih",
    txtBarcode : "Barkod Ekle",
    txtTotalCost : "Toplam Maliyet",
    txtTotalQuantity: "Toplam Miktar",
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
    grdOutwasItems: 
    {
        clmItemCode: "Kodu",
        clmItemName: "Adı",
        clmQuantity : "Adet",
        clmCreateDate: "Kayıt Tarihi",
        clmDescription :"Açıklama",
        clmCuser : "Kullanıcı"
    },
    pg_dispatchGrid : 
    {
        title : "İrsaliye Seçimi",
        clmReferans : "Seri - Sıra",
        clmCode : "Kodu",
        clmName : "Adı",
        clmQuantity : "Adet",
        clmCuStomer : "Müşteri",
        clmDate : "Tarih",
    },
    popPassword : 
    {
        title: "Evrakı Açmak İçin Yönetici Şifresini Girmelisiniz",
        Password : "Şifre",
        btnApprove : "Onayla"
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
    msgDocValid:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Evrak Üst Bilgileri Tamalanmadan Ürün Girilemez !"
    },
    msgEmpDescription:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Satır Açıklamaları Boş Geçilemez !"
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
    validRef :"Seri Boş Geçilemez",
    validRefNo : "Sıra Boş Geçilemez",
    validDepot : "Depo Seçmelisiniz",
    validCustomerCode : "Müşteri Kodu Boş Geçilemez",
    validDocDate : "Tarih Seçmelisiniz",
    pg_quickDesc : 
    {
        title : "Hızlı Açıklama Seçimi",
        clmDesc:  "AÇIKLAMA"
    },
    popQDescAdd : 
    {
        title : "Hızlı Açıklama Ekle",
        description : "Yeni Açılama",
        btnApprove : "Kaydet"
    },
    popDesign : 
    {
        title: "Dizayn seçimi",
        design : "Dizayn",
        lang : "Evrak Dili"
    },
    msgNotQuantity:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Depo Miktarı Eksiye Düşmeye Kapalıdır ! Eklenebilecek En Yüksek Miktar:"
    },
    pg_txtBarcode : 
    {
        title : "Barkod Seçimi",
        clmCode :  "Ürün Kodu",
        clmName : "Ürün Adi",
        clmMulticode : "Tedarikçi Kodu",
        clmBarcode : "Barkod"
    },
    msgCode :
    {
        title: "Dikkat",
        btn01: "Evrağa Git",
        msg: "Evrak Bulundu"
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
export default stk_02_008