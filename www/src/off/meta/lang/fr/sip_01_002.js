// "Satış Sipariş Listesi"
const sip_01_002 =
{
    cmbCustomer :"Client",
    btnGet :"Rechercher",
    chkInvOrDisp: "Afficher uniquement les commandes ouvertes",
    dtFirst : "Date Début",
    dtLast : "Date Fin",
    txtCustomerCode : "Client",
    menu:"Liste de vente  ",
    pg_txtCustomerCode : 
    {
        title : "Choix Client",
        clmCode :  "Code Client",
        clmTitle : "Nom Client",
        clmTypeName : "Type",
        clmGenusName : "Genre"
    },
    grdSlsOrdList: 
    {
        clmRef: "Référence",
        clmRefNo: "Ligne",
        clmPrice: "Prix ",
        clmInputCode : "Sélection Document",
        clmInputName : "Nom Client",
        clmDate: "Date",
        clmVat : "TVA",
        clmAmount : "Total HT" ,
        clmTotal : "Total",
        clmOutputName :"Réserve",
        clmMainGroup : "Client Groupe"
    },
    popDesign : 
    {
        title: "Choix du Design",
        design : "Design" ,
        lang : "Langue Document" 
    },
    msgConvertDispatch :
    {  
        title: "Dikkat",   // BAK
        btn01: "Tamam",   // BAK
        btn01: "Vazgeç",   // BAK
        msg: "Seçilen Evrakları İrsaliyeye çevirmek istediğinize emin misiniz?"            // BAK
    },
    msgConvertSucces :
    {  
        title: "Dikkat",  // BAK
        btn01: "Tamam",  // BAK
        msg: "Seçilen Evraklar İrsaliyeye çevrildi.."           // BAK
    },
    btnView : "Aperçu", 
    btnMailsend : "Envoyer E-Mail", 
    cmbMainGrp : "Client Groupe"
}
export default sip_01_002