// SKT operasyonu
const stk_04_004 =
{
    txtRef : "Ürün",
    dtFirstdate : "İlk Tarih",
    dtLastDate : "Son Tarih",
    btnGet : "Getir",
    btnPrint : "Seçili Ürüne Özel Etiket Bas",
    txtCustomerCode : "Müşteri",
    cmbItemGroup : "Ürün Grubu",
    grdExpdateList:  
    {
        clmQuantity : "Miktar",
        clmCode : "Kodu",
        clmName : "Adı",
        clmDiff : "Giriş tar. itibaren satılan",
        clmDate : "SKT Tarih",
        clmRemainder : "Kalan",
        clmCustomer :"Müşteri",
        clmRebate : "İade Alır",
        clmDescription :"Açıklama",
        clmUser : "Kullanıcı",
        clmCDate : "Giriş Tarih",
        clmPrintCount : "Yazdırma Sayısı",
        clmLUser : "Son yaz/işlem" 
    },
    popQuantity : 
    {
        title : "Miktar Fiyat Girişi",
        txtQuantity : "Miktar",
        txtPrice : "Fiyat",
        btnSave : "Kaydet ve Yazdır"
    },
    pg_txtRef:
    {
        title: "Ürün Seçimi",
        clmCode: "KODU",
        clmName: "ADI",
        clmStatus: "DURUM"
    },
    pg_txtCustomerCode : 
    {
        title : "Müşteri Seçimi",
        clmCode :  "CARİ KODU",
        clmTitle : "CARİ ADI",
        clmTypeName : "TİPİ",
        clmGenusName : "CİNSİ"
    },
    msgDoublePrint:
    {
        title: "Dikkat",
        btn01: "Tamam",
        btn02: "Vazgeç",
        msg: "Seçmiş olduğunuz ürün için daha önce özel etiket oluşturulmuş! Tekrar oluşturmak istediğinizden eminmisiniz?"
    },
    msgLabelCount:
    {
        title: "Dikkat",  
        btn01: "Tamam",  
        msg: "Kalan üründen fazla etiket basamazsınız.." 
    },
}

export default stk_04_004