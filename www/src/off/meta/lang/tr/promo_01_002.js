//  "İndirim Tanımları"
const promo_01_002 =
{
    txtCode: "Kodu",        
    txtName: "Adı",
    txtCustomer: "Müşteri",
    dtStartDate: "Baş.Tarih",
    dtFinishDate: "Bit.Tarih",
    cmbDepot: "Depo",
    txtCustomerCode: "Müşteri Kodu",
    txtCustomerName: "Müşteri Adı",
    cmbPrmType: "Müşteri Türü",
    txtPrmCustomer: "Müşteri",
    btnPrmCustomer: "Müşteri Seçimi / listesi", 
    cmbPrmType2: "Ürün Türü",
    txtPrmItem2: "Ürün",
    btnPrmItem2: "Ürün Seçimi / listesi", 
    txtPrmItemGrp: "Grup",
    txtPrmQuantity: "Adet",
    txtPrmAmount: "Tutar",
    cmbRstType: "Tipi",
    txtRstQuantity: "Değer",
    txtRstItem : "Ürün",
    cmbRstItemType: "Tip",
    txtRstItemQuantity: "Miktar",
    txtRstItemAmount: "Değer",
    txtCodePlace: "Lütfen Tanimlamak istediginiz İndirim Kodunu Giriniz",
    txtNamePlace: "Lütfen Tanimlamak istediginiz İndirim Adıni Giriniz",
    txtAmount: "Tutar",
    pg_Grid:
    {
        title: "Seçim",
        clmBarcode: "Barcodu",
        clmCode: "Kodu",
        clmName: "Adi", 
        clmItem : "Ürün",
        clmStartDate : "Başlangıç",
        clmFinishDate : "Bitiş",
        clmGrpName: "Grubu", 
        clmPrice : "Fiyat",
        btnItem: "İndirim Uygulanacak Ürün yada Ürün Grubu Seç",
        btnCustomer: "İndirim Uygulanacak Müşteri yada Müşteri Grubu Seç",
    },
    msgRef:
    {
        title: "Dikkat",
        btn01: "İndirime Git",
        btn02: "Tamam",
        msg: "Girmiş olduğunuz indirim sistem de kayıtlı !"
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
    popDiscount:
    {
        title: "İndirim",
        txtDiscRate : "Yüzde",
        txtDiscAmount : "Fiyat",
        btnSave: "Kaydet"
    },
    msgDiscRate:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Girdiğiniz indirim 0 dan küçük, 100 den büyük olamaz !",
    },
    cmbType:
    {
        customer: "Müşteri",
        customerGroup: "Müşteri Grubu"
    },
    cmbType2:
    {
        item: "Ürün",
        itemGroup: "Ürün Grubu",
        discountRate: "İndirim Oranı",
        discountAmount: "İndirim Tutarı"
    },
    validation:
    {
        txtPrmQuantityValid: "Miktar'ı boş geçemezsiniz !",
        txtPrmQuantityMinValid: "Minimum değer en az 0.001 olmalıdır !",
        txtRstItemQuantityValid: "Miktar sıfırdan küçük olamaz !",
    },
    msgDeleteAll:
    {
        title: "Dikkat",
        btn01: "Evet",
        btn02: "Hayır",
        msg: "Tümünü silmek istediğinize eminmisiniz ?",
    },
    msgItemAlert:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Eklemeye çalıştığınız ürün zaten listenizde var !",
    },
    msgAmount:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen Tutar Giriniz !",
    },
    msgCondOrApp:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen Müşteri veya Ürün Giriniz !",
    },
}

export default promo_01_002