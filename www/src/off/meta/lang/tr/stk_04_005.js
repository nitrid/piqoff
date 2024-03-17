// "Ürün Giriş Çıkış Operasyonu"
const stk_04_005 =
{
    txtRef : "Seri-Sıra",
    cmbDepot: "Depo",
    dtDocDate : "Tarih",
    txtBarcode : "Barkod Ekle",
    getRecipe : "Ürün Recetesi",
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
    grdList: 
    {
        clmType: "Tip",
        clmItemCode: "Kodu",
        clmItemName: "Adı",
        clmQuantity : "Adet",
        clmDescription :"Açıklama"
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
    cmbType : 
    {
        input : "Giriş",
        output : "Çıkış"
    },
    popRecipe : 
    {
        title: "Ürün Recetesi Seçim",
        clmDate: "Tarih",
        clmCode: "Ürün Kodu",
        clmName: "Ürün Adı",
        clmQuantity: "Miktar"
    },
    popRecipeDetail : 
    {
        title: "Ürün Recetesi Detay Giriş",
        clmType: "Tip",
        clmCode: "Ürün Kodu",
        clmName: "Ürün Adı",
        clmQuantity: "Recete Miktarı",
        clmEntry: "Giriş Miktarı"
    },
}

export default stk_04_005