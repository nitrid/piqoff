// "Sipariş Ayrıştırma"
const sip_04_001 =  
{
    txtCustomerCode : "Müşteri",
    validDepot : "Lütfen Depo Seçiniz",
    ItemNamePlaceHolder :"Ürün Adının Tamamını yada İçinde Geçen Bir Hece Giriniz",
    pg_txtCustomerCode : 
    {
        title : "Müşteri Seçimi",
        clmCode :  "CARİ KODU",
        clmTitle : "CARİ ADI",
        clmTypeName : "TİPİ",
        clmGenusName : "CİNSİ"
    },
    cmbDepot : 'Depo',
    btnGet : 'Getir',
    btnOrder : 'Sipariş Oluştur',
    grdOrderList : 
    {
        clmCode: "Kodu",
        clmName : "Adı",
        clmQuantity : "Adet",
        clmCustomer : "Müşteri",
        clmPrice : "Fiyat"
    },
    msgSave:
    {
        title: "Dikkat",
        btn01: "Onayla",
        btn02: "Vazgeç",
        msg: "Seçili Satırları İade Etmek İstediğinize Eminmisiniz !"
    },
    msgSaveResult:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msgSuccess: " İade Evraklarınız Oluşturuldu..!",
        msgFailed: "Kayıt işleminiz başarısız !"
    },
    msgDublicateItem : 
    {
        title: " Dikkat",
        btn01 : "Tamam",
        msg : "Ürünü Birden Fazla Müşteri İçin Seçilmiş Lütfen Kontol Ediniz"
    },
    msgCustomerFound : 
    {
        title: " Dikkat",
        btn01 : "Tamam",
        msg : "Müşterisi Tanımlanmamış Ürünler Seçilemez. Lütfen Müşteri Tanımlayın"
    }
}

export default sip_04_001