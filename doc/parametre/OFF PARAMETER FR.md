# Descriptions des Paramètres OFF

## Paramètres du Système

### Deuxième Unité
- **ID:** secondFactor
- **Description:** Définit l'ID de la deuxième unité. Valeur par défaut: `"003"`.

### Utilisation des Majuscules Uniquement
- **ID:** onlyBigChar
- **Description:** Active l'utilisation des majuscules uniquement. Valeur par défaut: `true`.

### Utiliser le Code Client pour la Série
- **ID:** refForCustomerCode
- **Description:** Permet d'utiliser le code fournisseur comme série. Valeur par défaut: `true`.

### Générer un Numéro de Série Aléatoire
- **ID:** randomRefNo
- **Description:** Permet de générer un numéro de série aléatoire. Valeur par défaut: `false`.

### Mise à Jour du Prix d'Achat à partir de la Facture d'Achat
- **ID:** purcInvoıcePriceSave
- **Description:** Active la mise à jour du prix d'achat à partir de la facture d'achat. Valeur par défaut: `true`.

### Entrée de Quantité Négative dans la Facture d'Achat
- **ID:** negativeQuantityForPruchase
- **Description:** Permet l'entrée de quantité négative dans la facture d'achat. Valeur par défaut: `true`.

### Obligation de Sélectionner une Facture pour les Opérations de Paiement
- **ID:** invoicesForPayment
- **Description:** Détermine l'obligation de sélectionner une facture pour les opérations de paiement et de recouvrement. Valeur par défaut: `false`.

### Symbole Monétaire
- **ID:** MoneySymbol
- **Description:** Définit le symbole de la devise. Par exemple, pour l'Euro `code: "EUR", sign: "€"`.

### Alerte Fournisseur à Prix Inférieur
- **ID:** pruchasePriceAlert
- **Description:** Active l'alerte fournisseur à prix inférieur. Valeur par défaut: `true`.

### Calcul Automatique d'Interfel
- **ID:** autoInterfel
- **Description:** Active le calcul automatique d'Interfel. Valeur par défaut: `false`.

### Ajouter le Coût à partir du Service dans la Facture
- **ID:** costForInvoıces
- **Description:** Active l'ajout du coût à partir du service dans la facture. Valeur par défaut: `false`.

### Vente à un Prix Inférieur au Coût
- **ID:** underMinCostPrice
- **Description:** Permet la vente à un prix inférieur au coût. Valeur par défaut: `false`.

### Montant Maximum de l'Arrondi
- **ID:** maxRoundAmount
- **Description:** Définit le montant maximum de l'arrondi. Valeur par défaut: `0.05`.

### Quantité Maximale Autorisée
- **ID:** maxUnitQuantity
- **Description:** Définit la quantité maximale autorisée. Valeur par défaut: `100000`.

### Prix Unitaire Maximum Autorisé
- **ID:** maxItemPrice
- **Description:** Définit le prix unitaire maximum autorisé. Valeur par défaut: `100000`.

### Description Obligatoire pour la Suppression de Documents
- **ID:** docDeleteDesc
- **Description:** Active la description obligatoire pour la suppression de documents. Valeur par défaut: `true`.

### Unité Fixe
- **ID:** cmbUnit
- **Description:** Définit l'unité fixe. Valeur par défaut: `"Colis"`.

### Modèles de Code-Barres
- **ID:** BarcodePattern
- **Description:** Liste les modèles de code-barres pris en charge. Par exemple, `'20XXXXXMMMCCF'`.

### Facteur de Prix de la Balance
- **ID:** ScalePriceFactory
- **Description:** Définit le facteur de prix de la balance. Valeur par défaut: `1`.

### Code de Transport par Défaut
- **ID:** DocTrasportType
- **Description:** Définit le code de transport par défaut. Valeur par défaut: `3`.

### Adresse de Pièce Jointe de Mail
- **ID:** autoMailAdress
- **Description:** Définit l'adresse mail par défaut. Valeur par défaut: `""`.

### Verrouiller la Saisie Manuelle du Prix de Revient
- **ID:** costPriceReadOnly
- **Description:** Active le verrouillage de la saisie manuelle du prix de revient. Valeur par défaut: `false`.

### Envoi Automatique de Mail
- **ID:** autoFactureMailSend
- **Description:** Active la fonctionnalité d'envoi automatique de mail. Valeur par défaut: `true`.

### Explication du Mail
- **ID:** MailExplanation
- **Description:** Définit le texte explicatif du mail. Valeur par défaut: `""`.

## Paramètres de Présentation des Stocks

### Référence
- **ID:** txtRef
- **Description:** Définit la référence dans la présentation des stocks. Ce champ appartient à un groupe de validation spécifique et est marqué comme obligatoire.

### Groupe de Produits
- **ID:** cmbItemGrp
- **Description:** Définit le groupe de produits dans la présentation des stocks. Ce champ appartient à un groupe de validation spécifique et est marqué comme obligatoire.

### Fournisseur
- **ID:** txtCustomer
- **Description:** Définit le fournisseur dans la présentation des stocks. Ce champ appartient à un groupe de validation spécifique et est marqué comme obligatoire.

### Type de Produit
- **ID:** cmbItemGenus
- **Description:** Définit le type de produit dans la présentation des stocks. Valeur par défaut: `"0"`.

### Code-Barres
- **ID:** txtBarcode
- **Description:** Définit le code-barres dans la présentation des stocks.

### Taxe
- **ID:** cmbTax
- **Description:** Définit le taux de taxe dans la présentation des stocks. Valeur par défaut: `"5.5"`.

### Type d'Unité Principale
- **ID:** cmbMainUnit
- **Description:** Définit le type d'unité principale dans la présentation des stocks. Valeur par défaut: `"001"`.

### Multiplicateur d'Unité Principale
- **ID:** txtMainUnit
- **Description:** Définit le multiplicateur d'unité principale dans la présentation des stocks. Ce champ appartient à un groupe de validation spécifique et doit être obligatoire, numérique et dans une certaine plage.

### Origine
- **ID:** cmbOrigin
- **Description:** Définit l'origine du produit par défaut dans la présentation des stocks.

### Type d'Unité Secondaire
- **ID:** cmbUnderUnit
- **Description:** Définit le type d'unité secondaire dans la présentation des stocks. Valeur par défaut: `"002"`.

### Multiplicateur d'Unité Secondaire
- **ID:** txtUnderUnit
- **Description:** Définit le multiplicateur d'unité secondaire dans la présentation des stocks. Ce champ appartient à un groupe de validation spécifique et doit être obligatoire, numérique et dans une certaine plage.

### Nom du Produit
- **ID:** txtItemName
- **Description:** Définit le nom du produit par défaut dans la présentation des stocks. Valeur par défaut: `""`.

### Nom Court
- **ID:** txtShortName
- **Description:** Définit le nom court du produit dans la présentation des stocks.

### Actif
- **ID:** chkActive
- **Description:** Détermine si le produit est actif ou non. Valeur par défaut: `true`.

### Pesé à la Caisse
- **ID:** chkCaseWeighed
- **Description:** Détermine si le produit sera pesé à la caisse. Valeur par défaut: `false`.

### Fusionner les Lignes
- **ID:** chkLineMerged
- **Description:** Détermine si les lignes de produits seront fusionnées ou non. Valeur par défaut: `true`.

### Ticket Rest.
- **ID:** chkTicketRest
- **Description:** Détermine si le produit a la fonctionnalité Ticket Rest. Valeur par défaut: `false`.

### Interfel
- **ID:** chkInterfel
- **Description:** Détermine si le produit a la fonctionnalité Interfel. Valeur par défaut: `false`.

### Prix de Revient
- **ID:** txtCostPrice
- **Description:** Définit le prix de revient du produit. Doit être supérieur à 0.

### Prix de Vente Minimum
- **ID:** txtMinSalePrice
- **Description:** Définit le prix de vente minimum du produit. Doit être supérieur à 0.

### Prix de Vente Maximum
- **ID:** txtMaxSalePrice
- **Description:** Définit le prix de vente maximum du produit. Doit être supérieur à 0.

### Dernier Prix d'Achat
- **ID:** txtLastBuyPrice
- **Description:** Définit le dernier prix d'achat du produit.

### Dernier Prix de Vente
- **ID:** txtLastSalePrice
- **Description:** Définit le dernier prix de vente du produit.

### Validation de l'Origine par Groupe de Produits
- **ID:** ItemGrpForOrginsValidation
- **Description:** Définit la validation de l'origine par groupe de produits.

### Autorisation Min Max par Groupe de Produits
- **ID:** ItemGrpForMinMaxAccess
- **Description:** Définit l'autorisation minimum et maximum par groupe de produits.

### Enregistrement sans Prix par Groupe de Produits
- **ID:** ItemGrpForNotPriceSave
- **Description:** Permet l'enregistrement sans prix par groupe de produits.

### Pourcentage Minimum de Vente du Produit
- **ID:** ItemMinPricePercent
- **Description:** Définit le pourcentage minimum de vente du produit.

### Pourcentage Maximum de Vente du Produit
- **ID:** ItemMaxPricePercent
- **Description:** Définit le pourcentage maximum de vente du produit.

### Contrôle du Prix de Vente par Rapport au Coût
- **ID:** SalePriceCostCtrl
- **Description:** Active le contrôle du prix de vente par rapport au coût.

### Contrôle du Prix de Vente par Rapport au Prix Fournisseur
- **ID:** SalePriceToCustomerPriceCtrl
- **Description:** Contrôle que le prix fournisseur ne peut pas être supérieur au prix de vente.

### Groupes Applicables pour Tax Sugar
- **ID:** taxSugarGroupValidation
- **Description:** Définit les groupes applicables pour Tax Sugar.

### Type de Produit
- **ID:** txtGenre
- **Description:** Définit le type de produit dans la présentation des stocks. Valeur par défaut: `"11"`.

## Paramètres de la Liste des Stocks

### Ajouter une Ligne Vide pour les Produits Introuvables
- **ID:** emptyCode
- **Description:** Détermine si une ligne vide sera ajoutée à la liste des stocks pour les produits introuvables. Valeur par défaut: `true`.

## Paramètres de Présentation des Clients

### Type
- **ID:** cmbType
- **Description:** Définit le type dans la présentation des clients. Valeur par défaut: `"0"`.

### Genre
- **ID:** cmbGenus
- **Description:** Définit le genre dans la présentation des clients. Valeur par défaut: `"0"`.

### Code
- **ID:** txtCode
- **Description:** Définit le code dans la présentation des clients. Ce champ appartient à un groupe de validation spécifique et est marqué comme obligatoire. Message: "Vous ne pouvez pas laisser le code vide!"

### Titre
- **ID:** txtTitle
- **Description:** Définit le titre dans la présentation des clients. Valeur par défaut: `""`.

### Nom
- **ID:** txtCustomerName
- **Description:** Définit le nom dans la présentation des clients. Ce champ appartient à un groupe de validation spécifique et est marqué comme obligatoire. Message: "Vous ne pouvez pas laisser le nom vide. !"

### Prénom
- **ID:** txtCustomerLastname
- **Description:** Définit le prénom dans la présentation des clients. Ce champ appartient à un groupe de validation spécifique et est marqué comme obligatoire. Message: "Vous ne pouvez pas laisser le nom vide"

## Paramètres de Définition de la Liste de Prix

### Numéro
- **ID:** txtNo
- **Description:** Définit le numéro dans la définition de la liste de prix. Ce champ appartient à un groupe de validation spécifique et est marqué comme obligatoire.

### Nom
- **ID:** txtName
- **Description:** Définit le nom dans la définition de la liste de prix. Ce champ appartient à un groupe de validation spécifique et est marqué comme obligatoire.

## Paramètres de la Facture de Vente

### Série
- **ID:** txtRef
- **Description:** Définit la série dans la facture de vente. Valeur par défaut: `""`.

### Rang
- **ID:** txtRefno
- **Description:** Définit le rang dans la facture de vente. Valeur par défaut: `"0"`.

### Dépôt
- **ID:** cmbDepot
- **Description:** Définit le dépôt dans la facture de vente. Valeur par défaut: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

### Code Client
- **ID:** txtCustomerCode
- **Description:** Définit le code client dans la facture de vente. Valeur par défaut: `""`.

### Nom du Client
- **ID:** txtCustomerName
- **Description:** Définit le nom du client dans la facture de vente. Valeur par défaut: `""`.

### Autoriser la Quantité Négative
- **ID:** negativeQuantity
- **Description:** Détermine si la quantité négative est autorisée dans la facture de vente. Valeur par défaut: `false`.

### Adresse de Mail Automatique
- **ID:** autoMailAdress
- **Description:** Définit l'adresse de mail automatique dans la facture de vente. Valeur par défaut: `""`.

### Contrôle du Numéro de Document
- **ID:** checkDocNo
- **Description:** Active le contrôle du numéro de document dans la facture de vente. Valeur par défaut: `true`.

## Paramètres de la Facture d'Achat de Déchets

### Série
- **ID:** txtRef
- **Description:** Définit la série dans la facture d'achat de déchets. Valeur par défaut: `""`.

### Rang
- **ID:** txtRefno
- **Description:** Définit le rang dans la facture d'achat de déchets. Valeur par défaut: `"0"`.

### Dépôt
- **ID:** cmbDepot
- **Description:** Définit le dépôt dans la facture d'achat de déchets. Valeur par défaut: `""`.

### Code Client
- **ID:** txtCustomerCode
- **Description:** Définit le code client dans la facture d'achat de déchets. Valeur par défaut: `""`.

### Nom du Client
- **ID:** txtCustomerName
- **Description:** Définit le nom du client dans la facture d'achat de déchets. Valeur par défaut: `""`.

### Autoriser la Quantité Négative
- **ID:** negativeQuantity
- **Description:** Détermine si la quantité négative est autorisée dans la facture d'achat de déchets. Valeur par défaut: `false`.

### Contrôle du Numéro de Document
- **ID:** checkDocNo
- **Description:** Active le contrôle du numéro de document dans la facture d'achat de déchets. Valeur par défaut: `false`.

## Paramètres de la Facture de Vente Inter-Branches

### Série
- **ID:** txtRef
- **Description:** Définit la série dans la facture de vente inter-branches. Valeur par défaut: `""`.

### Rang
- **ID:** txtRefno
- **Description:** Définit le rang dans la facture de vente inter-branches. Valeur par défaut: `"0"`.

### Dépôt
- **ID:** cmbDepot
- **Description:** Définit le dépôt dans la facture de vente inter-branches. Valeur par défaut: `""`.

### Code Client
- **ID:** txtCustomerCode
- **Description:** Définit le code client dans la facture de vente inter-branches. Valeur par défaut: `""`.

### Nom du Client
- **ID:** txtCustomerName
- **Description:** Définit le nom du client dans la facture de vente inter-branches. Valeur par défaut: `""`.

### Autoriser la Quantité Négative
- **ID:** negativeQuantity
- **Description:** Détermine si la quantité négative est autorisée dans la facture de vente inter-branches. Valeur par défaut: `false`.

### Contrôle du Numéro de Document
- **ID:** checkDocNo
- **Description:** Active le contrôle du numéro de document dans la facture d'achat inter-branches. Valeur par défaut: `false`.

## Paramètres de la Facture d'Achat de Différence de Prix

### Contrôle du Numéro de Document
- **ID:** checkDocNo
- **Description:** Active le contrôle du numéro de document dans la facture d'achat de différence de prix. Valeur par défaut: `false`.

## Paramètres de la Facture d'Achat de Retour Reçu

### Contrôle du Numéro de Document
- **ID:** checkDocNo
- **Description:** Active le contrôle du numéro de document dans la facture d'achat de retour reçu. Valeur par défaut: `false`.

## Paramètres de la Facture d'Achat

### Série
- **ID:** txtRef
- **Description:** Définit la série dans la facture d'achat. Valeur par défaut: `""`.

### Rang
- **ID:** txtRefno
- **Description:** Définit le rang dans la facture d'achat. Valeur par défaut: `"0"`.

### Groupes Applicables pour Tax Sugar
- **ID:** taxSugarGroupValidation
- **Description:** Définit les groupes applicables pour Tax Sugar dans la facture d'achat.

### Dépôt
- **ID:** cmbDepot
- **Description:** Définit le dépôt dans la facture d'achat. Valeur par défaut: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

### Code Client
- **ID:** txtCustomerCode
- **Description:** Définit le code client dans la facture d'achat. Valeur par défaut: `""`.

### Nom du Client
- **ID:** txtCustomerName
- **Description:** Définit le nom du client dans la facture d'achat. Valeur par défaut: `""`.

### Excel Formatı
- **ID:** excelFormat
- **Açıklama:** Alış faturasında Excel formatını tanımlar. Varsayılan değerler: `CODE:'CODE', QTY:'QTY', PRICE:'PRICE', DISC:'DISC', DISC_PER:'DISC_PER', TVA:'TVA'`.

### Tedarikçişi olmayan ürünü kaydetme
- **ID:** compulsoryCustomer
- **Açıklama:** Alış faturasında tedarikçisi olmayan ürünü kaydetmeyi engeller. Varsayılan değer: `true`.

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Alış faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

## Gönderilen İade Faturası Parametreleri

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Gönderilen iade faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

## Fiyat Farki Faturası Parametreleri

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Fiyat farkı faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

## Şubeler Arası Alış Faturası Parametreleri

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Şubeler arası alış faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

### Tedarikçişi olmayan ürünü kaydetme
- **ID:** compulsoryCustomer
- **Açıklama:** Şubeler arası alış faturasında tedarikçisi olmayan ürünü kaydetmeyi engeller. Varsayılan değer: `true`.

## Promosyon Parametreleri

### Kodu
- **ID:** txtCode
- **Açıklama:** Promosyon tanımlarında kod bilgisini tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli olarak işaretlenmiştir.

## Proforma Satış Faturası Parametreleri

### Seri
- **ID:** txtRef
- **Açıklama:** Proforma satış faturasında seri bilgisini tanımlar. Varsayılan değer: `""`.

### Sıra
- **ID:** txtRefno
- **Açıklama:** Proforma satış faturasında sıra bilgisini tanımlar. Varsayılan değer: `"0"`.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Proforma satış faturasında depo bilgisini tanımlar. Varsayılan değer: `""`.

### Cari Kodu
- **ID:** txtCustomerCode
- **Açıklama:** Proforma satış faturasında cari kod bilgisini tanımlar. Varsayılan değer: `""`.

### Cari Adı
- **ID:** txtCustomerName
- **Açıklama:** Proforma satış faturasında cari ad bilgisini tanımlar. Varsayılan değer: `""`.

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Proforma satış faturasında eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

## Depo Miktar Listesi Parametreleri

### Varsayılan Depo
- **ID:** cmbDepot
- **Açıklama:** Depo miktar listesinde varsayılan depo bilgisini tanımlar. Varsayılan değer: `'1A428DFC-48A9-4AC6-AF20-4D0A4D33F316'`.

## Depo Sevk Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Depolar arası transferde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

## İade Ürün Toplama Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** İade ürün toplamada eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

### Çıkış Depo
- **ID:** cmbDepot1
- **Açıklama:** İade ürün toplamada çıkış depo bilgisini tanımlar. Varsayılan değer: `""`.

### Giriş Depo
- **ID:** cmbDepot2
- **Açıklama:** İade ürün toplamada giriş depo bilgisini tanımlar. Varsayılan değer: `""`.

## Kayıp Ürün Parametreleri

### Satır Açıklamalarını Zorunlu Kıl
- **ID:** descriptionControl
- **Açıklama:** Kayıp ürün fişinde satır açıklamalarını zorunlu kılar. Varsayılan değer: `true`.

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Kayıp ürün fişinde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

## Gün Sonu Parametreleri

### Merkez Kasa
- **ID:** SafeCenter
- **Açıklama:** Gün sonu işlemlerinde merkez kasayı tanımlar. Varsayılan değer: `"FB529408-4AE5-4B34-9262-7956E3477F47"`.

### Kredi Kartı Kasası
- **ID:** BankSafe
- **Açıklama:** Gün sonu işlemlerinde kredi kartı kasasını tanımlar. Varsayılan değer: `"3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3"`.

### Ticket Restorant Kasası
- **ID:** TicketRestSafe
- **Açıklama:** Gün sonu işlemlerinde Ticket Restorant kasasını tanımlar. Varsayılan değer: `"3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3"`.

### Çek Kasası
- **ID:** CheckSafe
- **Açıklama:** Gün sonu işlemlerinde çek kasasını tanımlar. Varsayılan değer: `"3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3"`.

### Avans Tutarı
- **ID:** advanceAmount
- **Açıklama:** Gün sonu işlemlerinde avans tutarını tanımlar. Varsayılan değer: `"450"`.

## Satış İrsaliye Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Satış irsaliyesinde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Satış irsaliyesinde depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

## Şube Satış İrsaliye Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Şube satış irsaliyesinde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

### Otomatik mail gönderme
- **ID:** autoMailSend
- **Açıklama:** Şube satış irsaliyesinde otomatik mail gönderme özelliğini etkinleştirir. Varsayılan değer: `true`.

## Alış Anlaşması Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Alış anlaşmasında depo bilgisini tanımlar. Varsayılan değer: `"1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"`.

## Satış Anlaşması Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Satış anlaşmasında depo bilgisini tanımlar. Varsayılan değer: `"1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"`.

### İzin Verilen En Yüksek İndirim Yüzde
- **ID:** maxDiscount
- **Açıklama:** Satış anlaşmasında izin verilen en yüksek indirim yüzdesini tanımlar. Varsayılan değer: `30`.

## Özel Etiket Basımı Parametreleri

### Maliyet Fiyatından Düşük Etikete İzin Verme
- **ID:** underMinCostPrice
- **Açıklama:** Özel etiket basımında maliyet fiyatından düşük etikete izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

## Stok Çıkış Fişi Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Stok çıkış fişinde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

## Ürün Giriş Çıkış Fişi Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Ürün giriş çıkış fişinde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Ürün giriş çıkış fişinde depo bilgisini tanımlar. Varsayılan değer: `"00000000-0000-0000-0000-000000000000"`.

## Toplu Tahsilat Giriş Parametreleri

### Seri
- **ID:** txtRef
- **Açıklama:** Toplu tahsilat girişinde seri bilgisini tanımlar. Varsayılan değer: `""`.

### Excel Formatı
- **ID:** excelFormat
- **Açıklama:** Toplu tahsilat girişinde Excel formatını tanımlar. Varsayılan değerler: `DATE:'DATE', DESC:'DESC', AMOUNT:'AMOUNT'`.

## Tax Sugar Report Parametreleri

### Tax Sugar Uygulanacak Gruplar
- **ID:** taxSugarGroupValidation
- **Açıklama:** Tax Sugar raporunda uygulanacak grupları tanımlar.

## Satış Sipariş Parametreleri

### Kapanmış Sipaişleri Gösterme
- **ID:** closedOrder
- **Açıklama:** Satış siparişinde kapanmış siparişlerin gösterilip gösterilmeyeceğini belirler. Varsayılan değer: `true`.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Satış siparişinde depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

## Alış Sipariş Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Alış siparişinde depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

## Alış İrsaliye Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Alış irsaliyesinde depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

## Satış Teklif Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Satış teklifinde depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

### Mail Açıklaması
- **ID:** mailText
- **Açıklama:** Satış teklifinde mail açıklamasını tanımlar. Varsayılan değer: `""`.

## Satış Sipariş Onaylama Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Satış sipariş onaylamada depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

### Yazdırma Dizaynı Tagı
- **ID:** printDesing
- **Açıklama:** Satış sipariş onaylamada yazdırma dizaynı tagını tanımlar. Varsayılan değer: `"55"`.
