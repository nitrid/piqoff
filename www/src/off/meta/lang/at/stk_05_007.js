// "Lagerbewegungs-Bericht"
const stk_05_007 =
{
    txtRef : "Produktcode",
    cmbDepot : "Lager",
    chkZeroQuantity : "Nullmengen",
    btnGet :"Suchen",
    grdListe: 
    {
        clmName: "Name",
        clmCode: "Code",
        clmSkt: "MHD", 
        clmQuantity : "Menge",
        clmLotCode : "Losnummer",
        clmDepoQuantity: "Lagerbestand",
    },
    pg_txtRef:
    {
        title: "Produktauswahl",
        clmCode: "CODE",
        clmName: "NAME", 
        clmBarcode: "BARCODE", 
        clmStatus : "STATUS"
    },
    cancel : "Abbrechen",
    msgItemSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie ein Produkt aus!"
    },
}
export default stk_05_007