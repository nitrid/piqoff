// Barkod Tanımları
const stk_01_002 = 
{
    txtBarcode: "Barkod",
    txtItem: "Ürün Kodu",
    txtItemName: "Ürün Adı",
    cmbBarUnit: "Birim",
    txtBarUnitFactor: "Katsayı",
    cmbPopBarType : "Tip",
    MainUnit :"Bu Barkod Ana Birime Tanımlanacaktır",
    SubUnit : "Bu Barkod Alt Birime Tanımlanacaktır",
    txtUnitTypeName :"Açıklama",
    barcodePlace : "Seçilen Ürün için Eklemek İstediğiniz Barkodu Giriniz..",
    txtPartiLot : "Parti Lot Numarası",
    pg_partiLot:
    {
        title: "Parti Lot Seçimi",
        clmLotCode: "Parti Lot Numarası",
        clmSkt: "Son Kullanma Tarihi"
    },
    pg_txtItem:
    {
        title: "Ürün Seçim",
        clmCode: "KODU",
        clmName: "ADI", 
    },
    pg_txtBarcode:
    {
        title: "Barkod Seçim",
        clmBarcode: "BARKOD",
        clmItemName: "ÜRÜN ADI", 
        clmItemCode: "ÜRÜN KODU"
    },
   
    msgCheckBarcode:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Girmiş olduğunuz barkod sistem de kayıtlı ! Ürün Getirildi."
    },
    msgBarcode:
    {
        title: "Dikkat",
        btn01: "Barkoda Git",
        btn02: "Tamam",
        msg: "Girmiş olduğunuz barkod sistem de kayıtlı !"
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
    validCode :"Ürün Seçmelisiniz",
}
export default stk_01_002