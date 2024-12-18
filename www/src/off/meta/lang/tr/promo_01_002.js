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
    txtCodePlace: "Lütfen Tanimlamak istediginiz Promosyon Kodunu Giriniz",
    txtNamePlace: "Lütfen Tanimlamak istediginiz Promosyon Adıni Giriniz",
    txtCustomerCodePlace: "Promosyon Taninlamak istediginiz Müşteriyi Seçebilirsiniz",
    txtRstItemPlace: "Lütfen Promosyon Uygulanacak ürünü Seçiniz",
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
        btnItem: "Promosyon Uygulanacak Ürün yada Ürün Grubu Seç",
        btnCustomer: "Promosyon Uygulanacak Müşteri yada Müşteri Grubu Seç",
    },
    msgRef:
    {
        title: "Dikkat",
        btn01: "Promosyona Git",
        btn02: "Tamam",
        msg: "Girmiş olduğunuz promosyon sistem de kayıtlı !"
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
    pop_PrmItemList:
    {
        title: "Seçilmiş Ürünlar",
        clmCode: "Kodu",
        clmName: "Adi", 
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
        itemGroup: "Ürün Grubu"
    },
    msgHelp:
    {
        title: "Açıklama",
        btn01: "Tamam",
        condItemQuantity: "Promosyon tanımlamak istediğiniz ürün yada ürünler için promosyonun geçerli olacağı ürün adetini belirleyiniz. Örnğ: Değeri 5 yaptığınızda promosyon 5. üründen sonra geçerli olacaktır.",
        condItemAmount: "Promosyon tanımlamak istediğiniz ürün yada ürünler için promosyonun hangi toplam tutardan itibaren geçerli olacağını belirleyiniz. Örnğ: Tutarı 10€ yaptığınızda promosyon seçilen ürünlerin toplam tutarı 10€ olduktan sonra geçerli olacaktır.",
        condGeneralAmount: "Toplam ticket tutarına hangi tutardan sonra promosyon Uygulamak ıstediğinizi belirleyiniz. Örnğ: Tutarı 10€ yaptığınızda ticket toplam tutarı 10€ olduktan sonra geçerli olacaktır.",
        appDiscRate: "Koşul oluştuğunda uygulayacağı iskonto oranını belirleyiniz. Örnğ: Koşul oluştuğunda %10 indirim uygulasın.",
        appDiscAmount: "Koşul oluştuğunda tutarsal olarak yapmak istediğiniz indirim uygulanacak fiyatı belirleyiniz. Örnğ: Koşul oluştuğunda koşulda seçili ürünlere 0,99€ fiyat uygulasın.",
        appPoint: "Koşul oluştuğunda müşteriye vermek istediğiniz puan tutarını belirleyiniz. Örnğ: Koşul oluştuğunda müşterinin kartına 100 puan eklesin.",
        appGiftCheck: "Koşul oluştuğunda müşteriye vermek istediğiniz hediye çeki tutarını belirleyiniz. Örnğ: Koşul oluştuğunda müşteriye 100€ luk hediye çeki uluştursun.",
        appGeneralAmount: "Koşul oluştuğunda uygulanacak rakamsal toplam indirim tutarını belirleyiniz. Örnğ: Koşul oluştuğunda müşteriye tike tutarına 10€ luk indirim yapsın.",
        appItemQuantity: "Koşul oluştuğunda seçeceğiniz ürün yada ürünler için geçerli olacağı ürün adetini belirleyiniz. Örnğ: Değeri 5 yaptığınızda sectiğiniz ürün yada ürünleri 5 adete kadar belirlediğiniz % lik indirimi yada fiyatı uygulasın.",
        appItemAmount: "Koşul oluştuğunda seçeceğiniz ürün yada ürünler için geçerli olacağı fiyatı belirleyiniz. Örnğ: Fiyatı 1€ yada %10 yaptığınızda sectiğiniz ürün yada ürünleri 1€ dan yada %10 luk indirim uygulasın.",
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
    msgQuantityOrAmount:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen Adet veya Tutar Giriniz !",
    },
}

export default promo_01_002