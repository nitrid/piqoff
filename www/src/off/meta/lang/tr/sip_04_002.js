// "Satış Siparişi Dağıtım Operasyonu"
const sip_04_002 =
{
    cmbCustomer :"Müşteri",
    btnGet :"Getir",
    dtFirst : "İlk Tarih",
    dtLast : "Son Tarih",
    cmbDepot : "Depo",
    menu:"Satış Sipariş",
    itemTotalQyt : "Sevk edilebilecek Miktar",
    popOrderDetail : 
    {
        title : "Sipariş Detayı"
    },
    pg_txtCustomerCode : 
    {
        title : "Müşteri Seçimi",
        clmCode :  "CARİ KODU",
        clmTitle : "CARİ ADI",
        clmTypeName : "TİPİ",
        clmGenusName : "CİNSİ"
    },
    grdSlsOrdList: 
    {
        clmItemCode: "Ürün Kodu",
        clmItemName: "Ürün Adı",
        clmDepotQuantity: "Depodaki Miktar",
        clmComingQuantity : "Gelecek Miktar",
        clmTotalQuantity : "Toplam Gönderilebilecek",
        clmQuantity: "Sipariş Miktarı",
        clmApprovedQuantity : "Onaylanacak Miktar",
        clmTotalHt : "Vergisiz Tutar",
        clmTotal : "Toplam",
        clmLivre : "Gönderildi"
    },
    btnSave: "Seçilen Satırları Onayla",
    msgApprovedBig:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Onaylanan miktar sipariş miktarından fazla olamaz !",
    },
    grdOrderDetail: 
    {
        clmCode: "Ürün Kodu",
        clmName: "Ürün Adı",
        clmDate: "Sipariş Tarihi",
        clmCustomer : "Müşteri Adı",
        clmQuantity: "Sipariş Miktarı",
        clmApprovedQuantity : "Onaylanacak Miktar",
    },
    btnDetailCancel : "Vazgeç",
    btnDetailApproved : "Onayla",
    msgSave:
    {
        title: "Dikkat",
        btn01: "Evet",
        btn02: "Hayır",
        msg: "Seçilen Satırları Onaylıyor musunuz?",
    },
    msgSaveSuccess:
    {
        title: "Dikkat",
        btn01: "Yazdır",
        btn02: "Kapat",
        msg: "Seçilen Satırları Onaylandı. Siparişleri yazdırmak istermisiniz? ",
    },
}

export default sip_04_002