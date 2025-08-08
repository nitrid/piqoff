//Yeni Ürün Tanımlama
const stk_01_001 = 
{
    txtRef: "Referans",
    cmbItemGrp: "Ürün Grubu",
    txtCustomer: "Tedarikçi",
    cmbItemGenus: "Ürün Cinsi",
    txtBarcode: "Barkod",
    cmbTax: "Vergi",
    cmbMainUnit: "Ana Birim",
    cmbOrigin: "Menşei",
    cmbUnderUnit: "Alt Birim",
    txtItemName: "Ürün Adı",
    txtShortName: "Kısa Adı",
    chkPartiLot : "Parti Lot",
    chkActive: "Aktif",
    chkCaseWeighed: "Kasada Tartılsın",
    chkLineMerged: "Satış da Satırları Ayır",
    chkTicketRest: "Ticket Rest.",
    chkInterfel : "Interfel",
    txtCostPrice: "Maliyet Fiyatı",
    txtSalePrice : "Satış Fiyatı",
    txtMinSalePrice: "Min. Satış Fiyatı",
    txtMaxSalePrice: "Max. Satış Fiyatı",
    txtLastBuyPrice: "Önceki Alış Fiyatı",
    txtLastSalePrice: "Önceki SaT.Fiyatı",
    tabTitlePrice: "Fiyat",
    tabTitleUnit: "Birim",
    tabTitleBarcode: "Barkod",
    tabTitleCustomer: "Tedarikçi",
    tabExtraCost: "Ek Maliyetler",
    tabTitleCustomerPrice: "Tedarikçi Fiyat Geçmişi",
    tabTitleSalesContract: "Satış Anlaşmaları",
    tabTitleInfo: "Bilgi",
    tabTitleOtherShop :"Diğer Şube Bilgileri",
    tabTitleDetail : "Detay Bilgileri",
    txtTaxSugar: "Şeker Oranı(100ML/GR)",
    txtTotalExtraCost : "Ek Maliyetler",
    clmtaxSugar : "Şeker Vergisi",
    priceUpdate : "Fiyat Güncelle",
    underUnitPrice : "Alt Birim Fiyatı",
    minBuyPrice : "Minimum Alış Fiyatı",
    maxBuyPrice : "Maximum Alış Fiyatı",
    sellPriceAdd : "Satış Fiyatı Ekle",
    clmInvoiceCost : "Hizmet Bedeli",
    validOrigin : "Menşei boş geçemezsiniz !",
    validTaxSucre : "Lütfen şeker oranını doğru giriniz !",
    validName : "Adı boş geçemezsiniz !",
    validQuantity : "Miktar'ı boş geçemezsiniz !" ,
    validPrice :"Fiyatı boş geçemezsiniz !",
    validPriceFloat : "Fiyat 0'dan yüksek olmalıdır !",
    validCustomerCode :"Tedarikci Kodu Giriniz !",
    validOriginMax8 :"Lütfen 8 karakter giriniz !",
    validTax : "Vergi boş geçemezsiniz !",
    mainUnitName :"Ana Birim",
    underUnitName : "Alt Birim",
    chkDayAnalysis : "Günlük",
    chkMountAnalysis : "Aylık",
    txtUnitFactor : "Birim Mikarı",
    cmbAnlysType : "Tip",
    txtCustoms : "Gümrük Kodu",
    txtGenus : "Ürün Cinsi",
    txtRayon : "Rayon",
    chkTaxSugarControl : "Şeker Vergisi",
    cmbAnlysTypeData : 
    {
        pos: "Pos",
        invoice : "Fatura"
    },
    pg_txtRef:
    {
        title: "Ürün Seçimi",
        clmCode: "KODU",
        clmName: "ADI",
        clmStatus: "DURUM"
    },
    pg_txtPopCustomerCode:
    {
        title: "Müşteri Seçimi",
        clmCode: "KODU",
        clmName: "ADI", 
    },
    popPrice:
    {
        title: "Fiyat Ekle",
        cmbPopPriListNo: "Liste No",
        dtPopPriStartDate: "Baş.Tarih",
        dtPopPriEndDate: "Bit.Tarih", 
        cmbPopPriDepot: "Depo",
        txtPopPriQuantity: "Miktar",
        txtPopPriPrice: "Fiyat",
        txtPopPriHT: "Vargisiz Fiyat",
        txtPopPriTTC : "Vergili Fiyat",
        txtPopPriceMargin : "Marj %",
        txtPopPriceGrossMargin : "Brüt Marj %",
        txtPopPriceNetMargin : "Net Marj %"
    },
    msgDateInvalid:
    {
        title: "Uyari",
        msg: "Yanlis tarih",
        btn01: "tamam"
    },
    popUnit:
    {
        title: "Birim Ekle",
        cmbPopUnitType: "Tip",
        cmbPopUnitName: "Birim Adı", 
        txtPopUnitFactor: "Katsayı",
        txtPopUnitWeight: "Ağırlık",
        txtPopUnitVolume: "Hacim",
        txtPopUnitWidth: "En",
        txtPopUnitHeight: "Boy",
        txtPopUnitSize: "Yükseklik"
    },
    popBarcode:
    {
        title: "Barkod Ekle",
        txtPopBarcode: "Barkodu",
        cmbPopBarUnit: "Birim", 
        cmbPopBarType: "Tip"
    },
    popCustomer:
    {
        title: "Tedarikçi Ekle",
        txtPopCustomerCode: "Kodu",
        txtPopCustomerName: "Adı", 
        txtPopCustomerItemCode: "Ürün Kodu",
        txtPopCustomerPrice: "Fiyat"
    },
    grdPrice: 
    {
        clmListNo: "Liste No",
        clmDepot: "Depo",
        clmCustomerName: "Müşteri",
        clmStartDate: "Baş.Tarih",
        clmFinishDate: "Bit.Tarih",
        clmQuantity: "Miktar",
        clmPriceHT: "Vergi Hariç",
        clmPriceTTC : "Vergili Fiyat",
        clmPrice: "Fiyat",
        clmGrossMargin: "Brüt Marj",
        clmNetMargin: "Net Marj",
        clmMargin : "Marj %",
        clmListName: "Liste Adı"
    },
    grdUnit: 
    {
        clmType: "Tip",
        clmName: "Adı",
        clmFactor: "Katsayı",
        clmWeight: "Ağırlık",
        clmVolume: "Hacim",
        clmWidth: "En",
        clmHeight: "Boy",
        clmSize: "Yükseklik"
    },
    grdBarcode: 
    {
        clmBarcode: "Barkod",
        clmUnit: "Birim",
        clmType: "Tip"
    },
    grdExtraCost: 
    {
        clmDate: "Tarih",
        clmPrice: "Ek Maliyet",
        clmTypeName: "Tip",
        clmCustomerPrice : "Tedarikçi Fiyat",
        clmCustomer : "Tedarikçi",
        clmDescription : "Açıklama",
    },
    grdCustomer: 
    {
        clmCode: "Kodu",
        clmName: "Adı",
        clmPriceUserName: "Kullanıcı",
        clmPriceDate: "Son Fiyat Tarih",
        clmPrice: "Fiyat",
        clmMulticode: "Tedarikçi Ürün Kodu"
    },
    grdSalesContract: 
    {
        clmUser: "Kullanıcı",
        clmCode: "Kodu",
        clmName: "Adı",
        clmDate: "Son Fiyat Tarih",
        clmPrice: "Fiyat",
        clmMulticode: "Tedarikçi Ürün Kodu"
    },
    grdCustomerPrice: 
    {
        clmUser: "Kullanıcı",
        clmCode: "Kodu",
        clmName: "Adı",
        clmDate: "Son Fiyat Tarih",
        clmPrice: "Fiyat",
        clmMulticode: "Tedarikçi Ürün Kodu"
    },
    grdOtherShop: 
    {
        clmCode: "Ürün Kodu",
        clmName: "Ürün Adı",
        clmBarcode: "Barkod",
        clmPrice: "Fiyat",
        clmMulticode: "T.Kodu",
        clmCustomer: "Tedarikçi",
        clmCustomerPrice: "T.Fiyatı",
        clmShop: "Şube",
        clmDate: "Güncelleme Tarihi"
    },
    msgRef:
    {
        title: "Dikkat",
        btn01: "Ürüne Git",
        btn02: "Tamam",
        msg: "Girmiş olduğunuz ürün sistem de kayıtlı !"
    },
    msgBarcode:
    {
        title: "Dikkat",
        btn01: "Ürüne Git",
        btn02: "Tamam",
        msg: "Girmiş olduğunuz barkod sistem de kayıtlı !"
    },
    msgCustomer:
    {
        title: "Dikkat",
        btn01: "Ürüne Git",
        btn02: "Tamam",
        msg: "Girmiş olduğunuz tedarikçi ürün kodu sistem de kayıtlı !"
    },
    msgPriceSave:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen fiyat giriniz !"
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
    msgCostPriceValid:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen alış fiyatından yüksek fiyat giriniz !"
    },
    msgPriceAdd:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen gerekli alanları doldurunuz !"
    },
    tabTitleSalesPriceHistory : "Satış Fiyat Geçmişi",
    grdSalesPrice : 
    {
        clmUser : "Kullanıcı",
        clmDate : "Değişim Tarihi",
        clmPrice : "Fiyat",
    },
    grdItemInfo: 
    {
        cDate: "Oluşturulma Tarihi",
        cUser: "Oluşturan Kullanıcı",
        lDate: "Son Değiştirilme Tarihi",
        lUser : "Son Değiştiren Kullanıcı",
    },
    msgCheckPrice:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Benzer kayıt oluşturamazsınız !"
    },
    msgCheckCustomerCode:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Girmiş olduğunuz tedarikçi zaten tanımlı !"
    },
    msgSalePriceToCustomerPrice:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Girmiş olduğunuz tedarikçi fiyatı satış fiyatından yüksek olamaz! Lütfen satış fiyatınızı kontrol ediniz."
    },
    popAnalysis :
    {
        title : "Satış İstatistiği"
    },
    popDescription :
    {
        title : "Ürün Dili ve Açıklaması",
        label : "Ürün Açıklaması"
    },
    grdLang : 
    {
        clmLang : "Dil",
        clmName : "Ürün adı",
    },
    popItemLang : 
    {
        title : "Ürün Dili",
        cmbPopItemLanguage : "Dil",
        cmbPopItemLangName : "Ürün adı",
    },
    grdAnalysis: 
    {
        clmToday: "Bugün",
        clmYesterday: "Dün",
        clmWeek: "Bu Hafta",
        clmMount : "Bu Ay",
        clmYear : "Bu Yıl",
        clmLastYear : "Geçen Yıl"
    },
    dtFirstAnalysis : "Başlangıç",
    dtLastAnalysis : "Bitiş",
    btnGet : "Getir",
    msgNotDelete:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Bu ürün işlem gördüğü için silinemez !!"
    },
    cmbItemGenusData :
    {
        item : "Mal",
        service : "Hizmet",
        deposit : "Depozit"
    },
    msgUnit:
    {
        title: "Birim Hesaplama",
        btn01: "Onayla",
    },
    msgUnitRowNotDelete :
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Ana birim yada Alt birim i silemezsiniz !"
    },
    pg_customsCode : 
    {
        title : "Gümrük Kodları",
        clmCode : "KODU",
        clmName : "ADI"
    },
    pg_txtGenre : 
    {
        title : "Ürün Cinsi",   
        clmCode : "KODU",   
        clmName : "ADI"   
    },
    pg_rayonCode : 
    {
        title : "Rayon Seçimi",   
        clmCode : "KODU",   
        clmName : "ADI"   
    },
    msgNewItem:
    {
        title: "Dikkat",
        btn01: "Evet",
        btn02: "Vazgeç",
        msg: "Yeni ürüne geçmek istediğinize emin misiniz !"
    },
    msgItemBack:
    {
        title: "Dikkat",
        btn01: "Evet",
        btn02: "Vazgeç",
        msg: "Ürünü tekrar getirmek istediğinize emin misiniz !"
    },
    btnSubGroup : "Alt Grup Ekle",
    pg_subGroup : 
    {
        title : "Alt Grup Seçim",
        clmName : "Adı",
    },
    grdProperty : 
    {
        clmProperty : "Özellik",
        clmValue : "Değer",
    },
    propertyPopup : 
    {
        title : "Özellik Ekle",
        property : "Özellik",
        value : "Değer",
        add : "Ekle",
    },
    btnProperty : "Özellik Ekle",
    grdProperty : 
    {
        clmProperty : "Özellik",
        clmValue : "Değer",
    },
}
export default stk_01_001