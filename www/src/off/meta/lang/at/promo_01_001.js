//  "Promosyon Tanımları"
const promo_01_001 =
{
    txtCode: "Code",        
    txtName: "Name",
    dtStartDate: "Startdatum",
    dtFinishDate: "Enddatum",
    cmbDepot: "Lager",
    txtCustomerCode: "Kundencode",
    txtCustomerName: "Kundenname",
    cmbPrmType: "Angebotstyp",
    txtPrmItem: "Artikel",
    btnPrmItem: "Angebotsartikel auswählen / Artikelübersicht", 
    txtPrmItemGrp: "Gruppe",
    txtPrmQuantity: "Menge",
    txtPrmAmount: "Betrag",
    cmbRstType: "Typ",
    txtRstQuantity: "Wert",
    txtRstItem : "Artikel",
    cmbRstItemType: "Typ",
    txtRstItemQuantity: "Menge",
    txtRstItemAmount: "Wert",
    txtCodePlace: "Bitte den Angebotscode eingeben",
    txtNamePlace: "Bitte den Angebotsnamen eingeben",
    txtCustomerCodePlace: "Sie können den Kunden für die Angebot auswählen",
    txtRstItemPlace: "Bitte den Artikel auswählen, auf den die Angebot angewendet wird",
    pg_Grid:
    {
        title: "Auswahl",
        clmBarcode: "Barcode",
        clmCode: "Code",
        clmName: "Name", 
        clmGrpName: "Gruppe", 
        clmPrice : "Preis",
        btnItem: "Artikel oder Artikel für die Angebot auswählen"
    },
    msgRef:
    {
        title: "Achtung",
        btn01: "Zur Angebot gehen",
        btn02: "OK",
        msg: "Die eingegebene Angebot ist im System vorhanden!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten?"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Ihr Eintrag wurde erfolgreich gespeichert!",
        msgFailed: "Ihr Eintrag konnte nicht gespeichert werden!"
    },
    msgSpeichernValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie den Eintrag wirklich löschen?"
    },
    pop_PrmItemList:
    {
        title: "Ausgewählte Artikel",
        clmCode: "Code",
        clmName: "Name", 
    },
    popDiscount:
    {
        title: "Rabatt",
        txtDiscRate: "Prozentsatz",
        txtDiscAmount: "Preis",
        btnSpeichern: "Speichern"
    },
    msgDiscRate:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der eingegebene Rabatt darf nicht kleiner als 0 oder größer als 100 sein!",
    },
    cmbType:
    {
        item: "Artikel",
        generalAmount: "Gesamtmenge",
        discountRate: "Rabatt",
        moneyPoint: "Treuepunkte",
        giftCheck: "Geschenkgutschein",
        generalDiscount: "Gesamtrabatt",
        discountAmount: "Rabattbetrag",
        promoType01: "Bedingung",
        promoType02: "Anwendung",
    },
    msgHelp:
    {
        title: "Erklärung",
        btn01: "Ok",
        condItemQuantity: "Geben Sie die Anzahl der Artikel ein, für die das Angebot gelten soll. Z.B.: Wenn Sie den Wert auf 5 setzen, wird die Angebot ab dem 5. Artikel angewendet.",
        condItemAmount: "Geben Sie den Gesamtbetrag an, ab dem das Angebot für Der ausgewälte Artikel oder die ausgewählten Artikel gültig sein soll. Z.B.: Wenn Sie den Betrag auf 10€ setzen, wird die Angebot angewendet, sobald der Gesamtbetrag der ausgewählten Artikel 10€ erreicht.",
        condGeneralAmount: "Geben Sie den Betrag an, ab dem das Angebot auf den Gesamtbestellwert angewendet werden soll. Z.B.: Wenn Sie den Betrag auf 10€ setzen, wird die Angebot angewendet, sobald der Gesamtbestellwert 10€ erreicht.",
        appDiscRate: "Legen Sie den Rabattprozentsatz fest, der angewendet werden soll, wenn die Bedingung erfüllt ist. Z.B.: Der Rabatt soll 10% betragen, wenn die Bedingung erfüllt ist.",
        appDiscAmount: "Legen Sie den Rabattbetrag fest, der angewendet werden soll, wenn die Bedingung erfüllt ist. Z.B.: Der Preis soll auf 0,99€ festgelegt werden, wenn die Bedingung erfüllt ist und die ausgewählten Artikel in der Bedingung enthalten sind.",
        appPoint: "Legen Sie den Punktebetrag fest, der dem Kunden gutgeschrieben werden soll, wenn die Bedingung erfüllt ist. Z.B.: Dem Kunden sollen 100 Punkte gutgeschrieben werden, wenn die Bedingung erfüllt ist.",
        appGiftCheck: "Legen Sie den Wert des Geschenkgutscheins fest, der dem Kunden gegeben werden soll, wenn die Bedingung erfüllt ist. Z.B.: Ein Geschenkgutschein im Wert von 100€ soll erstellt werden, wenn die Bedingung erfüllt ist.",
        appGeneralAmount: "Legen Sie den Betrag des Gesamtrabatts fest, der dem Kunden gewährt werden soll, wenn die Bedingung erfüllt ist. Z.B.: Dem Kunden soll ein Rabatt in Höhe von 10€ auf den Bestellwert gewährt werden, wenn die Bedingung erfüllt ist.",
        appItemQuantity: "Geben Sie die Anzahl der ausgewählten Artikel ein, für die der prozentuale Rabatt oder Preis gültig sein soll, wenn die Bedingung erfüllt ist. Z.B.: Wenn der Wert auf 5 gesetzt wird, wird der prozentuale Rabatt oder Preis für die 5 ausgewählten Artikel angewendet.",
        appItemAmount: "Geben Sie den Preis ein, zu dem die ausgewählten Artikel gültig sein sollen, wenn die Bedingung erfüllt ist. Z.B.: Wenn der Preis auf 1€ oder 10% festgelegt werden soll, wird der Preis oder Rabatt von 1€ oder 10% für die ausgewählten Artikel angewendet.",
    },
    validation:
    {
        txtPrmQuantityValid: "Sie können die Menge nicht leer lassen!",
        txtPrmQuantityMinValid: "Der Mindestwert muss mindestens 0,001 betragen!",
        txtRstItemQuantityValid: "Die Menge kann nicht kleiner als null sein!",
    },
    msgDeleteAll:
    {
        title: "Achtung",
        btn01: "Ja",
        btn02: "Nein",
        msg: "Möchten Sie wirklich alles löschen?",
    },
    msgItemAlert:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits in Ihrer Liste!",
    },
    chkLoyalty: "Treuepunkte",
}
export default promo_01_001