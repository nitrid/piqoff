const lang =
{
    posSettings :
    {
        posItemsList : "Prodotti",
        posSaleReport : "Rapporto di Vendita",
        posCustomerPointReport : "Rapporto Punti Cliente",
        posTicketEndDescription : "Descrizione Fine Scontrino",
        posGroupSaleReport : "Rapporto Vendite di Gruppo",
        posCompanyInfo : "Informazioni Azienda",
    },
    posItemsList :
    {
        title : "Lista Prodotti",
        btnItemSearch : "Cerca",
        txtItemSearchPholder : "Inserisci nome o codice prodotto",
        grdItemList :
        {
            CODE : "Codice Prodotto",
            NAME : "Nome Prodotto",
            VAT : "IVA"
        },
        popItemEdit :
        {
            title : "Nuovo Prodotto",
            txtRef : "Codice Prodotto",
            txtName : "Nome Prodotto",
            cmbMainUnit : "Unità Principale",
            cmbUnderUnit : "Unità Secondaria",
            cmbItemGrp : "Gruppo Prodotti",
            cmbOrigin : "Origine",
            cmbTax : "Tassa",
            chkActive : "Attivo",
            chkCaseWeighed : "Pesare alla Cassa",
            chkLineMerged : "Unire Linee",
            chkTicketRest : "Ticket Rest.",
            tabTitlePrice : "Prezzo",
            tabTitleUnit : "Unità",
            tabTitleBarcode : "Codice a Barre",
            msgItemValidation :
            {
                title : "Attenzione",
                btn01 : "OK",
                msg1 : "Il codice prodotto non può essere vuoto!",
                msg2 : "Il nome prodotto non può essere vuoto!",
            },
            msgPriceSave:
            {
                title: "Attenzione",
                btn01: "OK",
                msg: "Inserisci un prezzo!"
            },
            msgNewItem :
            {
                title : "Attenzione",
                btn01 : "OK",
                btn02 : "Annulla",
                msg : "Sei sicuro di voler creare un nuovo prodotto?"
            },
            msgSave:
            {
                title: "Attenzione",
                btn01: "OK",
                btn02: "Annulla",
                msg: "Sei sicuro di voler salvare?"
            },
            msgSaveResult:
            {
                title: "Attenzione",
                btn01: "OK",
                msgSuccess: "Salvataggio riuscito!",
                msgFailed: "Salvataggio fallito!"
            },
            msgDelete:
            {
                title: "Attenzione",
                btn01: "OK",
                btn02: "Annulla",
                msg: "Sei sicuro di voler eliminare?"
            },
            msgNotDelete:
            {
                title: "Attenzione",
                btn01: "OK",
                msg: "Questo prodotto non può essere eliminato!"
            },
            msgItemExist:
            {
                title: "Attenzione",
                btn01: "Sì",
                btn02: "No",
                msg: "Il prodotto inserito esiste già. Vuoi andare al prodotto?"
            },
            grdPrice :
            {
                clmStartDate : "Data Inizio",
                clmFinishDate : "Data Fine",
                clmQuantity : "Quantità",
                clmPrice : "Prezzo",
                clmPriceHT : "Prezzo Escluso IVA",
                clmPriceTTC : "Prezzo IVA Inclusa",
            },
            grdUnit :
            {
                clmType : "Tipo",
                clmName : "Nome",
                clmFactor : "Fattore",
            },
            grdBarcode :
            {
                clmBarcode : "Codice a Barre",
                clmUnit : "Unità",
                clmType : "Tipo",
            },
            cmbMainUnit : "Unità Principale",
            cmbUnderUnit : "Unità Secondaria",
            popPrice :
            {
                title : "Prezzo",
                dtPopPriStartDate : "Data Inizio",
                dtPopPriEndDate : "Data Fine",
                txtPopPriQuantity : "Quantità",
                txtPopPriPrice : "Prezzo",
                btnSave : "Salva",
                btnCancel : "Annulla",
                msgCheckPrice:
                {
                    title: "Attenzione",
                    btn01: "OK",
                    msg: "Non puoi creare un record simile!"
                },
                msgCostPriceValid:
                {
                    title: "Attenzione",
                    btn01: "OK",
                    msg: "Inserisci un prezzo superiore al costo!"
                },
                msgPriceAdd:
                {
                    title: "Attenzione",
                    btn01: "OK",
                    msg: "Compila i campi richiesti!"
                },
                msgPriceEmpty :
                {
                    title: "Attenzione",
                    btn01: "OK",
                    msg: "Il campo prezzo non può essere vuoto o zero!"
                },
                msgPriceNotNumber :
                {
                    title: "Attenzione",
                    btn01: "OK",
                    msg: "Il campo prezzo deve essere numerico!"
                },
                msgPriceQuantityEmpty :
                {
                    title: "Attenzione",
                    btn01: "OK",
                    msg: "Il campo quantità non può essere vuoto o zero!"
                },
                msgPriceQuantityNotNumber :
                {
                    title: "Attenzione",
                    btn01: "OK",
                    msg: "Il campo quantità deve essere numerico!"
                }
            },
            popUnit :
            {
                title : "Unità",
                cmbPopUnitName : "Unità",
                txtPopUnitFactor : "Fattore",
                btnSave : "Salva",
                btnCancel : "Annulla",
                msgUnitRowNotDelete :
                {
                    title: "Attenzione",
                    btn01: "OK",
                    msg: "Non puoi eliminare l'unità principale o secondaria!"
                },
                msgUnitRowNotEdit :
                {
                    title: "Attenzione",
                    btn01: "OK",
                    msg: "Non puoi modificare l'unità principale o secondaria!"
                },
                msgUnitFactorEmpty :
                {
                    title: "Attenzione",
                    btn01 : "OK",
                    msg : "Il campo fattore non può essere vuoto o zero!"
                },
                msgUnitFactorNotNumber :
                {
                    title : "Attenzione",
                    btn01 : "OK",
                    msg : "Il campo fattore deve essere numerico!"
                }
            },
            popBarcode :
            {
                title : "Codice a Barre",
                txtPopBarcode : "Codice a Barre",
                cmbPopBarType : "Tipo",
                cmbPopBarUnitType : "Unità",
                btnSave : "Salva",
                btnCancel : "Annulla",
                msgBarcodeExist :
                {
                    title : "Attenzione",
                    btn01 : "OK",
                    msg : "Questo codice a barre esiste già!"
                },
                msgBarcodeEmpty :
                {
                    title : "Attenzione",
                    btn01 : "OK",
                    msg : "Il campo codice a barre non può essere vuoto!"
                }
            },
            popAddItemGrp :
            {
                title : "Aggiungi Gruppo Prodotti",
                txtAddItemGrpCode : "Codice",
                txtAddItemGrpName : "Nome",
                btnSave : "Salva",
                btnCancel : "Annulla",
                msgAddItemGrpEmpty :
                {
                    title : "Attenzione",
                    btn01 : "OK",
                    msg : "Compila i campi richiesti!"
                },
                msgAddItemGrpExist :
                {
                    title : "Attenzione",
                    btn01 : "OK",
                    msg : "Questo codice esiste già!"
                }
            }
        }
    },
    posSaleReport :
    {
        btnGet : "Ottieni",
        txtTotalTicket : "Numero Totale Scontrini",
        txtTicketAvg : "Importo Medio Scontrino",
    },
    posCustomerPointReport :
    {
        txtCustomerCode : "Codice Cliente",
        txtCustomerName : "Nome Cliente",
        txtAmount : "Importo Totale",
        btnGet : "Ottieni",
        popCustomers :
        {
            title : "Selezione Cliente",
            clmCode : "Codice",
            clmTitle : "Nome",
            clmTypeName : "Tipo",
            clmGenusName : "Genere",
            btnSelectCustomer : "Seleziona",
            btnCustomerSearch : "Cerca",
        },
        grdCustomerPointReport :
        {
            clmCode: "Codice",
            clmTitle: "Nome",
            clmPoint: "Punti",
            clmLdate : "Ultima Data Agg.",
            clmEur : "Euro"
        },
        popPointDetail :
        {
            title : "Dettaglio Punti",
            clmDate : "Data",
            clmPosId : "Codice Pos",
            clmPoint : "Punti",
            clmDescription : "Descrizione",
            exportFileName : "dettaglio_punti_cliente",
            btnAddPoint : "Aggiungi Punti",
        },
        popPointSaleDetail :
        {
            title : "Dettaglio Vendita Punti",
            TicketId : "Numero Scontrino",
            clmBarcode : "Codice a Barre",
            clmName : "Nome Prodotto",
            clmQuantity : "Quantità",
            clmPrice : "Prezzo",
            clmTotal : "Totale",
            clmPayName : "Tipo Pagamento",
            clmLineTotal : "Totale",
            exportFileName : "dettaglio_vendita_punti_cliente",
        },
        popPointEntry :
        {
            title : "Inserimento Punti",
            cmbPointType : "Tipo",
            cmbTypeData :
            {
                in : "Entrata",
                out : "Uscita",
            },
            txtPoint : "Punti",
            txtPointAmount : "Importo Punti",
            txtDescription : "Descrizione",
            descriptionPlace : "Inserisci descrizione",
            btnAdd : "Aggiungi",
            msgDescription :
            {
                title : "Attenzione",
                btn01 : "OK",
                msg : "La descrizione deve essere di almeno 14 caratteri!",
            },
            msgPointNotNumber :
            {
                title : "Attenzione",
                btn01 : "OK",
                msg : "Il campo punti deve essere numerico!",
            }
        }
    },
    posTicketEndDescription :
    {
        cmbFirm : "Azienda",
        txtDescriptionPlaceHolder : "Inserisci descrizione",
        msgSaveResult :
        {
            title : "Attenzione",
            btn01 : "OK",
            msgSuccess : "Salvataggio riuscito!",
        }
    },
    posGrpSalesReport :
    {
        chkTicket : "Numero Scontrini",
        txtTotalTicket : "Numero Totale Scontrini",
        txtTicketAvg : "Importo Medio Scontrino",
        btnGet : "Ottieni",
        btnGetAnalysis : "Analisi",
        grdGroupSalesReport :
        {
            clmGrpCode : "Codice",
            clmGrpName : "Nome",
            clmTicket : "Numero Scontrini",
            clmQuantity : "Quantità",
            clmTotalCost : "Costo Totale",
            clmFamount : "Escluso IVA",
            clmVat : "IVA",
            clmTotal : "Totale",
            clmRestTotal : "Totale Residuo",
            exportFileName : "rapporto_vendite_gruppo",
        },
        grpGrpDetail :
        {
            title : "Dettaglio Gruppo Prodotti",
            clmCode : "Codice",
            clmName : "Nome",
            clmQuantity : "Quantità",
            clmTotalCost : "Costo Totale",
            clmFamount : "Escluso IVA",
            clmVat : "IVA",
            clmTotal : "Totale",
            clmRestTotal : "Totale Residuo",
            exportFileName : "dettaglio_gruppo_prodotti",
        },
        popAnalysis :
        {
            title : "Analisi",
        }
    },
    posCompanyInfo :
    {
        validation :
        {
            notValid : "Compila i campi richiesti!",
        },
        txtTitle : "Nome Azienda",
        txtBrandName : "Nome Marchio",
        txtCustomerName : "Nome Responsabile",
        txtCustomerLastname : "Cognome Responsabile",
        txtAddress : "Indirizzo",
        txtCountry : "Paese",
        txtZipCode : "CAP",
        txtCity : "Città",
        txtPhone : "Telefono",
        txtFax : "Fax",
        txtEmail : "Email",
        txtWeb : "Sito Web",
        txtApeCode : "Codice Ape",
        txtRSC : "RSC",
        txtTaxOffice : "Ufficio Tasse",
        txtTaxNo : "Numero Tasse",
        txtIntVatNo : "Numero IVA",
        txtSirenNo : "Numero Siren",
        txtSiretId : "Numero Siret",
        msgSave :
        {
            title : "Attenzione",
            btn01 : "Sì",
            btn02 : "No",
            msg : "Sei sicuro di voler salvare?",
        },
        msgSaveResult :
        {
            title : "Attenzione",
            btn01 : "OK",
            msgSuccess : "Salvataggio riuscito!",
            msgFailed : "Salvataggio fallito!",
        },
        msgSaveValid :
        {
            title : "Attenzione",
            btn01 : "OK",
            msg : "Compila i campi richiesti!",
        }
    }
}
export default lang