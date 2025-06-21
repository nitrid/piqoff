// Özellik Tanımları
const stk_01_018 = 
{
    txtCode : "Özellik Kodu",
    txtName : "Özellik Adı",
    txtDescription : "Açıklama",
    txtType : "Özellik Tipi",
    txtValue : "Değer",
    txtRequired : "Zorunlu",
    txtActive : "Aktif",
    txtSortOrder : "Sıralama",
    
    // Özellik tipleri
    typeText : "Metin",
    typeNumber : "Sayı",
    typeDate : "Tarih",
    typeBoolean : "Evet/Hayır",
    typeList : "Liste",
    typeColor : "Renk",
    typeImage : "Resim",
    
    // Popup başlıkları
    popPropertySelect : 
    {
        title : "Özellik Seç",
        clmCode : "Özellik Kodu",
        clmName : "Özellik Adı",
        clmType : "Tip"
    },
    
    // Mesajlar
    msgSave : {
        title : "Kaydetme İşlemi",
        msg : "Kaydetmek istediğinize emin misiniz?",
        btn01 : "Kaydet",
        btn02 : "İptal"
    },
    msgDelete : {
        title : "Silme İşlemi",
        msg : "Silmek istediğinize emin misiniz?",
        btn01 : "Sil",
        btn02 : "İptal"
    },
    msgError : {
        title : "Hata",
        msg : "Bir hata oluştu",
        btn01 : "Tamam"
    },
    msgSaveResult : {
        title : "Kaydetme Sonucu",
        msgSuccess : "Kaydetme işlemi başarıyla tamamlandı",
        msgError : "Kaydetme işlemi sırasında bir hata oluştu"
    },
    
    // Validasyon mesajları
    validCode: "Özellik kodu boş olamaz",
    validName: "Özellik adı boş olamaz",
    validType: "Özellik tipi seçilmelidir",
    validSortOrder: "Sıralama numarası girilmelidir",
    
    // Grid kolonları
    grdPropertyList: 
    {
        clmCode: "Kod",
        clmName: "Ad",
        clmType: "Tip",
        clmRequired: "Zorunlu",
        clmActive: "Aktif",
        clmSortOrder: "Sıra"
    }
}

export default stk_01_018 