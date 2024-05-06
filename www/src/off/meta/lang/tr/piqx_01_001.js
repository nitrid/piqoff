// "Gelen Fatura Listesi"
const piqx_01_001 =
{
    btnGet :"Getir",
    dtFirst : "İlk Tarih",
    dtLast : "Son Tarih",
    grdList: 
    {
        clmDate : "Tarih",
        clmFromNo : "Vergi No",
        clmFromTitle : "Unvan",
        clmStatus : "Durum"
    },
    popImport:
    {
        title : "Import",
        btnImport : "Import",
        txtCustomerCode : "Tedarikçi Kodu",
        txtCustomerName : "Tedarikçi Adı",
        dtDocDate : "Tarih",
        dtShipDate : "Sevk Tarihi",
        cmbDepot : "Depo",
        txtHT : "Ara Toplam",
        txtTax : "Vergi",
        txtTTC : "Genel Toplam",
        clmItemCode : "Kodu",
        clmMulticode : "T.Kodu",
        clmItemName : "Adı",
        clmQuantity : "Adet",
        clmPrice : "Fiyat",
        clmDiscount : "İndirim",
        clmAmount : "Tutar",
        msgImport :
        {
            title : "Dikkat",
            btn01 : "Tamam",
            msg1 : "Aktarılacak data yok !",
            msg2 : "Lütfen depo seçiniz !",
            msg3 : "Tedarikçi bulunamadığından import işlemini yapamazsınız !",
            msg4 : "Listenizde tanımsız ürün varken aktarım yapamazsını !",
            msg5 : "No'lu alış faturası olarak sisteme kayıt edilmiştir.",
            msg6 : "Daha önceden import edilmiş faturayı tekrar sisteme kayıt edemezsiniz !",
        }
    },
}

export default piqx_01_001