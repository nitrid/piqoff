const lang =
{
    posSettings :
    {
        posItemsList : "Produkte",
        posSaleReport : "Verkaufsbericht",
        posCustomerPointReport : "Kundenpunktebericht",
        posTicketEndDescription : "Belegende Beschreibung",
        posGroupSaleReport : "Gruppenverkaufsbericht",
        posCompanyInfo : "Firmendaten",
    },
    posItemsList :
    {
        title : "Produktliste",
        btnItemSearch : "Suchen",
        txtItemSearchPholder : "Produktname oder -code eingeben",
        grdItemList :
        {
            CODE : "Produktcode",
            NAME : "Produktname",
            VAT : "MwSt"
        },
        popItemEdit :
        {
            title : "Neues Produkt",
            txtRef : "Produktcode",
            txtName : "Produktname",
            cmbMainUnit : "Haupteinheit",
            cmbUnderUnit : "Untereinheit",
            cmbItemGrp : "Produktgruppe",
            cmbOrigin : "Herkunft",
            cmbTax : "Steuer",
            chkActive : "Aktiv",
            chkCaseWeighed : "An der Kasse wiegen",
            chkLineMerged : "Zeilen zusammenführen",
            chkTicketRest : "Ticket Rest.",
            tabTitlePrice : "Preis",
            tabTitleUnit : "Einheit",
            tabTitleBarcode : "Barcode",
            msgItemValidation :
            {
                title : "Achtung",
                btn01 : "OK",
                msg1 : "Produktcode darf nicht leer sein!",
                msg2 : "Produktname darf nicht leer sein!",
            },
            msgPriceSave:
            {
                title: "Achtung",
                btn01: "OK",
                msg: "Bitte Preis eingeben!"
            },
            msgNewItem :
            {
                title : "Achtung",
                btn01 : "OK",
                btn02 : "Abbrechen",
                msg : "Sind Sie sicher, dass Sie ein neues Produkt erstellen möchten?"
            },
            msgSave:
            {
                title: "Achtung",
                btn01: "OK",
                btn02: "Abbrechen",
                msg: "Sind Sie sicher, dass Sie speichern möchten?"
            },
            msgSaveResult:
            {
                title: "Achtung",
                btn01: "OK",
                msgSuccess: "Speichern erfolgreich!",
                msgFailed: "Speichern fehlgeschlagen!"
            },
            msgDelete:
            {
                title: "Achtung",
                btn01: "OK",
                btn02: "Abbrechen",
                msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?"
            },
            msgNotDelete:
            {
                title: "Achtung",
                btn01: "OK",
                msg: "Dieses Produkt kann nicht gelöscht werden, da es verwendet wird!"
            },
            msgItemExist:
            {
                title: "Achtung",
                btn01: "Ja",
                btn02: "Nein",
                msg: "Das eingegebene Produkt existiert bereits. Möchten Sie zum Produkt gehen?"
            },
            grdPrice :
            {
                clmStartDate : "Startdatum",
                clmFinishDate : "Enddatum",
                clmQuantity : "Menge",
                clmPrice : "Preis",
                clmPriceHT : "Ohne MwSt",
                clmPriceTTC : "Mit MwSt",
            },
            grdUnit :
            {
                clmType : "Typ",
                clmName : "Name",
                clmFactor : "Faktor",
            },
            grdBarcode :
            {
                clmBarcode : "Barcode",
                clmUnit : "Einheit",
                clmType : "Typ",
            },
            cmbMainUnit : "Haupteinheit",
            cmbUnderUnit : "Untereinheit",
            popPrice :
            {
                title : "Preis",
                dtPopPriStartDate : "Startdatum",
                dtPopPriEndDate : "Enddatum",
                txtPopPriQuantity : "Menge",
                txtPopPriPrice : "Preis",
                btnSave : "Speichern",
                btnCancel : "Abbrechen",
                msgCheckPrice:
                {
                    title: "Achtung",
                    btn01: "OK",
                    msg: "Ähnliche Einträge sind nicht erlaubt!"
                },
                msgCostPriceValid:
                {
                    title: "Achtung",
                    btn01: "OK",
                    msg: "Bitte einen höheren Preis als den Einkaufspreis eingeben!"
                },
                msgPriceAdd:
                {
                    title: "Achtung",
                    btn01: "OK",
                    msg: "Bitte alle erforderlichen Felder ausfüllen!"
                },
                msgPriceEmpty :
                {
                    title: "Achtung",
                    btn01: "OK",
                    msg: "Preisfeld darf nicht leer oder null sein!"
                },
                msgPriceNotNumber :
                {
                    title: "Achtung",
                    btn01: "OK",
                    msg: "Preisfeld muss eine Zahl sein!"
                },
                msgPriceQuantityEmpty :
                {
                    title: "Achtung",
                    btn01: "OK",
                    msg: "Mengenfeld darf nicht leer oder null sein!"
                },
                msgPriceQuantityNotNumber :
                {
                    title: "Achtung",
                    btn01: "OK",
                    msg: "Mengenfeld muss eine Zahl sein!"
                }
            },
            popUnit :
            {
                title : "Einheit",
                cmbPopUnitName : "Einheit",
                txtPopUnitFactor : "Faktor",
                btnSave : "Speichern",
                btnCancel : "Abbrechen",
                msgUnitRowNotDelete :
                {
                    title: "Achtung",
                    btn01: "OK",
                    msg: "Haupteinheit oder Untereinheit kann nicht gelöscht werden!"
                },
                msgUnitRowNotEdit :
                {
                    title: "Achtung",
                    btn01: "OK",
                    msg: "Haupteinheit oder Untereinheit kann nicht bearbeitet werden!"
                },
                msgUnitFactorEmpty :
                {
                    title : "Achtung",
                    btn01 : "OK",
                    msg : "Faktorfeld darf nicht leer oder null sein!"
                },
                msgUnitFactorNotNumber :
                {
                    title : "Achtung",
                    btn01 : "OK",
                    msg : "Faktorfeld muss eine Zahl sein!"
                }
            },
            popBarcode :
            {
                title : "Barcode",
                txtPopBarcode : "Barcode",
                cmbPopBarType : "Typ",
                cmbPopBarUnitType : "Einheit",
                btnSave : "Speichern",
                btnCancel : "Abbrechen",
                msgBarcodeExist :
                {
                    title : "Achtung",
                    btn01 : "OK",
                    msg : "Dieser Barcode existiert bereits!"
                },
                msgBarcodeEmpty :
                {
                    title : "Achtung",
                    btn01 : "OK",
                    msg : "Barcodefeld darf nicht leer sein!"
                }
            },
            popAddItemGrp :
            {
                title : "Produktgruppe hinzufügen",
                txtAddItemGrpCode : "Code",
                txtAddItemGrpName : "Name",
                btnSave : "Speichern",
                btnCancel : "Abbrechen",
                msgAddItemGrpEmpty :
                {
                    title : "Achtung",
                    btn01 : "OK",
                    msg : "Bitte alle erforderlichen Felder ausfüllen!"
                },
                msgAddItemGrpExist :
                {
                    title : "Achtung",
                    btn01 : "OK",
                    msg : "Dieser Code existiert bereits!"
                }
            }
        }
    },
    posSaleReport :
    {
        btnGet : "Holen",
        txtTotalTicket : "Gesamtbeleganzahl",
        txtTicketAvg : "Durchschnittlicher Belegbetrag",
    },
    posCustomerPointReport :
    {
        txtCustomerCode : "Kundencode",
        txtCustomerName : "Kundenname",
        txtAmount : "Gesamtbetrag",
        btnGet : "Holen",
        popCustomers :
        {
            title : "Kundenauswahl",
            clmCode : "Code",
            clmTitle : "Name",
            clmTypeName : "Typ",
            clmGenusName : "Gattung",
            btnSelectCustomer : "Auswählen",
            btnCustomerSearch : "Suchen",
        },
        grdCustomerPointReport :
        {
            clmCode: "Code",
            clmTitle: "Name",
            clmPoint: "Punkte",
            clmLdate : "Letztes Aktualisierungsdatum",
            clmEur : "Euro"
        },
        popPointDetail :
        {
            title : "Punktedetails",
            clmDate : "Datum",
            clmPosId : "Pos Code",
            clmPoint : "Punkte",
            clmDescription : "Beschreibung",
            exportFileName : "kundenpunkte_detail",
            btnAddPoint : "Punkte hinzufügen",
        },
        popPointSaleDetail :
        {
            title : "Punkteverkaufsdetails",
            TicketId : "Belegnummer",
            clmBarcode : "Barcode",
            clmName : "Produktname",
            clmQuantity : "Menge",
            clmPrice : "Preis",
            clmTotal : "Gesamt",
            clmPayName : "Zahlungsart",
            clmLineTotal : "Gesamt",
            exportFileName : "kundenpunkte_verkaufsdetails",
        },
        popPointEntry :
        {
            title : "Punkteingabe",
            cmbPointType : "Typ",
            cmbTypeData :
            {
                in : "Eingang",
                out : "Ausgang",
            },
            txtPoint : "Punkte",
            txtPointAmount : "Punktebetrag",
            txtDescription : "Beschreibung",
            descriptionPlace : "Beschreibung eingeben",
            btnAdd : "Hinzufügen",
            msgDescription :
            {
                title : "Achtung",
                btn01 : "OK",
                msg : "Beschreibung muss mindestens 14 Zeichen lang sein!",
            },
            msgPointNotNumber :
            {
                title : "Achtung",
                btn01 : "OK",
                msg : "Punktefeld muss eine Zahl sein!",
            }
        }
    },
    posTicketEndDescription :
    {
        cmbFirm : "Firma",
        txtDescriptionPlaceHolder : "Beschreibung eingeben",
        msgSaveResult :
        {
            title : "Achtung",
            btn01 : "OK",
            msgSuccess : "Speichern erfolgreich!",
        }
    },
    posGrpSalesReport :
    {
        chkTicket : "Beleganzahl",
        txtTotalTicket : "Gesamtbeleganzahl",
        txtTicketAvg : "Durchschnittlicher Belegbetrag",
        btnGet : "Holen",
        btnGetAnalysis : "Analyse",
        grdGroupSalesReport :
        {
            clmGrpCode : "Code",
            clmGrpName : "Name",
            clmTicket : "Beleganzahl",
            clmQuantity : "Menge",
            clmTotalCost : "Gesamtkosten",
            clmFamount : "Ohne MwSt",
            clmVat : "MwSt",
            clmTotal : "Gesamt",
            clmRestTotal : "Restbetrag",
            exportFileName : "gruppenverkaufsbericht",
        },
        grpGrpDetail :
        {
            title : "Produktgruppendetails",
            clmCode : "Code",
            clmName : "Name",
            clmQuantity : "Menge",
            clmTotalCost : "Gesamtkosten",
            clmFamount : "Ohne MwSt",
            clmVat : "MwSt",
            clmTotal : "Gesamt",
            clmRestTotal : "Restbetrag",
            exportFileName : "gruppen_details",
        },
        popAnalysis :
        {
            title : "Analyse",
        }
    },
    posCompanyInfo :
    {
        validation :
        {
            notValid : "Bitte alle erforderlichen Felder ausfüllen!",
        },
        txtTitle : "Firmenname",
        txtBrandName : "Markenname",
        txtCustomerName : "Verantwortlicher Name",
        txtCustomerLastname : "Verantwortlicher Nachname",
        txtAddress : "Adresse",
        txtCountry : "Land",
        txtZipCode : "Postleitzahl",
        txtCity : "Stadt",
        txtPhone : "Telefon",
        txtFax : "Fax",
        txtEmail : "Email",
        txtWeb : "Webseite",
        txtApeCode : "Ape Code",
        txtRSC : "RSC",
        txtTaxOffice : "Finanzamt",
        txtTaxNo : "Steuernummer",
        txtIntVatNo : "USt-IdNr",
        txtSirenNo : "Siren Nr",
        txtSiretId : "Siret Nr",
        msgSave :
        {
            title : "Achtung",
            btn01 : "Ja",
            btn02 : "Nein",
            msg : "Sind Sie sicher, dass Sie speichern möchten?",
        },
        msgSaveResult :
        {
            title : "Achtung",
            btn01 : "OK",
            msgSuccess : "Speichern erfolgreich!",
            msgFailed : "Speichern fehlgeschlagen!",
        },
        msgSaveValid :
        {
            title : "Achtung",
            btn01 : "OK",
            msg : "Bitte alle erforderlichen Felder ausfüllen!",
        }
    }
}
export default lang