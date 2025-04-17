const lang =
{
    posSettings :
    {
        posItemsList : "Products",
        posSaleReport : "Sales Report",
        posCustomerPointReport : "Customer Points Report",
        posTicketEndDescription : "Receipt End Description",
        posGroupSaleReport : "Group Sales Report",
        posCompanyInfo : "Company Info",
    },
    posItemsList :
    {
        title : "Product List",
        btnItemSearch : "Search",
        txtItemSearchPholder : "Enter product name or code",
        grdItemList :
        {
            CODE : "Product Code",
            NAME : "Product Name",
            VAT : "VAT"
        },
        popItemEdit :
        {
            title : "New Product",
            txtRef : "Product Code",
            txtName : "Product Name",
            cmbMainUnit : "Main Unit",
            cmbUnderUnit : "Sub Unit",
            cmbItemGrp : "Product Group",
            cmbOrigin : "Origin",
            cmbTax : "Tax",
            chkActive : "Active",
            chkCaseWeighed : "Weigh at Checkout",
            chkLineMerged : "Merge Lines",
            chkTicketRest : "Ticket Rest.",
            tabTitlePrice : "Price",
            tabTitleUnit : "Unit",
            tabTitleBarcode : "Barcode",
            msgItemValidation :
            {
                title : "Attention",
                btn01 : "OK",
                msg1 : "Product code cannot be empty!",
                msg2 : "Product name cannot be empty!",
            },
            msgPriceSave:
            {
                title: "Attention",
                btn01: "OK",
                msg: "Please enter a price!"
            },
            msgNewItem :
            {
                title : "Attention",
                btn01 : "OK",
                btn02 : "Cancel",
                msg : "Are you sure you want to create a new product?"
            },
            msgSave:
            {
                title: "Attention",
                btn01: "OK",
                btn02: "Cancel",
                msg: "Are you sure you want to save?"
            },
            msgSaveResult:
            {
                title: "Attention",
                btn01: "OK",
                msgSuccess: "Save successful!",
                msgFailed: "Save failed!"
            },
            msgDelete:
            {
                title: "Attention",
                btn01: "OK",
                btn02: "Cancel",
                msg: "Are you sure you want to delete the record?"
            },
            msgNotDelete:
            {
                title: "Attention",
                btn01: "OK",
                msg: "This product cannot be deleted as it is in use!"
            },
            msgItemExist:
            {
                title: "Attention",
                btn01: "Yes",
                btn02: "No",
                msg: "The entered product already exists. Do you want to go to the product?"
            },
            grdPrice :
            {
                clmStartDate : "Start Date",
                clmFinishDate : "End Date",
                clmQuantity : "Quantity",
                clmPrice : "Price",
                clmPriceHT : "Excl. VAT",
                clmPriceTTC : "Incl. VAT",
            },
            grdUnit :
            {
                clmType : "Type",
                clmName : "Name",
                clmFactor : "Factor",
            },
            grdBarcode :
            {
                clmBarcode : "Barcode",
                clmUnit : "Unit",
                clmType : "Type",
            },
            cmbMainUnit : "Main Unit",
            cmbUnderUnit : "Sub Unit",
            popPrice :
            {
                title : "Price",
                dtPopPriStartDate : "Start Date",
                dtPopPriEndDate : "End Date",
                txtPopPriQuantity : "Quantity",
                txtPopPriPrice : "Price",
                btnSave : "Save",
                btnCancel : "Cancel",
                msgCheckPrice:
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Cannot create duplicate record!"
                },
                msgCostPriceValid:
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Please enter a price higher than the cost price!"
                },
                msgPriceAdd:
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Please fill in the required fields!"
                },
                msgPriceEmpty :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Price field cannot be empty or zero!"
                },
                msgPriceNotNumber :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Price field must be a numeric value!"
                },
                msgPriceQuantityEmpty :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Quantity field cannot be empty or zero!"
                },
                msgPriceQuantityNotNumber :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Quantity field must be a numeric value!"
                }
            },
            popUnit :
            {
                title : "Unit",
                cmbPopUnitName : "Unit",
                txtPopUnitFactor : "Factor",
                btnSave : "Save",
                btnCancel : "Cancel",
                msgUnitRowNotDelete :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Cannot delete main or sub unit!"
                },
                msgUnitRowNotEdit :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Cannot edit main or sub unit!"
                },
                msgUnitFactorEmpty :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "Factor field cannot be empty or zero!"
                },
                msgUnitFactorNotNumber :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "Factor field must be a numeric value!"
                }
            },
            popBarcode :
            {
                title : "Barcode",
                txtPopBarcode : "Barcode",
                cmbPopBarType : "Type",
                cmbPopBarUnitType : "Unit",
                btnSave : "Save",
                btnCancel : "Cancel",
                msgBarcodeExist :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "This barcode already exists!"
                },
                msgBarcodeEmpty :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "Barcode field cannot be empty!"
                }
            },
            popAddItemGrp :
            {
                title : "Add Product Group",
                txtAddItemGrpCode : "Code",
                txtAddItemGrpName : "Name",
                btnSave : "Save",
                btnCancel : "Cancel",
                msgAddItemGrpEmpty :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "Please fill in the required fields!"
                },
                msgAddItemGrpExist :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "This code already exists!"
                }
            }
        }
    },
    posSaleReport :
    {
        btnGet : "Get",
        txtTotalTicket : "Total Receipts",
        txtTicketAvg : "Avg. Receipt Amount",
    },
    posCustomerPointReport :
    {
        txtCustomerCode : "Customer Code",
        txtCustomerName : "Customer Name",
        txtAmount : "Total Amount",
        btnGet : "Get",
        popCustomers :
        {
            title : "Select Customer",
            clmCode : "Code",
            clmTitle : "Name",
            clmTypeName : "Type",
            clmGenusName : "Genus",
            btnSelectCustomer : "Select",
            btnCustomerSearch : "Search",
        },
        grdCustomerPointReport :
        {
            clmCode: "Code",
            clmTitle: "Name",
            clmPoint: "Points",
            clmLdate : "Last Update",
            clmEur : "Euro"
        },
        popPointDetail :
        {
            title : "Point Detail",
            clmDate : "Date",
            clmPosId : "POS Code",
            clmPoint : "Points",
            clmDescription : "Description",
            exportFileName : "customer_point_detail",
            btnAddPoint : "Add Points",
        },
        popPointSaleDetail :
        {
            title : "Point Sale Detail",
            TicketId : "Receipt No",
            clmBarcode : "Barcode",
            clmName : "Product Name",
            clmQuantity : "Quantity",
            clmPrice : "Price",
            clmTotal : "Total",
            clmPayName : "Payment Type",
            clmLineTotal : "Line Total",
            exportFileName : "customer_point_sale_detail",
        },
        popPointEntry :
        {
            title : "Point Entry",
            cmbPointType : "Type",
            cmbTypeData :
            {
                in : "In",
                out : "Out",
            },
            txtPoint : "Points",
            txtPointAmount : "Point Amount",
            txtDescription : "Description",
            descriptionPlace : "Enter description",
            btnAdd : "Add",
            msgDescription :
            {
                title : "Attention",
                btn01 : "OK",
                msg : "Description must be at least 14 characters!"
            },
            msgPointNotNumber :
            {
                title : "Attention",
                btn01 : "OK",
                msg : "Points field must be a numeric value!"
            }
        }
    },
    posTicketEndDescription :
    {
        cmbFirm : "Company",
        txtDescriptionPlaceHolder : "Enter description",
        msgSaveResult :
        {
            title : "Attention",
            btn01 : "OK",
            msgSuccess : "Save successful!",
        }
    },
    posGrpSalesReport :
    {
        chkTicket : "Receipt Count",
        txtTotalTicket : "Total Receipts",
        txtTicketAvg : "Avg. Receipt Amount",
        btnGet : "Get",
        btnGetAnalysis : "Analyze",
        grdGroupSalesReport :
        {
            clmGrpCode : "Code",
            clmGrpName : "Name",
            clmTicket : "Receipt Count",
            clmQuantity : "Quantity",
            clmTotalCost : "Total Cost",
            clmFamount : "Excl. VAT",
            clmVat : "VAT",
            clmTotal : "Total",
            clmRestTotal : "Remaining Total",
            exportFileName : "grp_sales_report",
        },
        grpGrpDetail :
        {
            title : "Product Group Detail",
            clmCode : "Code",
            clmName : "Name",
            clmQuantity : "Quantity",
            clmTotalCost : "Total Cost",
            clmFamount : "Excl. VAT",
            clmVat : "VAT",
            clmTotal : "Total",
            clmRestTotal : "Remaining Total",
            exportFileName : "grp_grp_detail",
        },
        popAnalysis :
        {
            title : "Analysis",
        }
    },
    posCompanyInfo :
    {
        validation :
        {
            notValid : "Please fill in the required fields!",
        },
        txtTitle : "Company Name",
        txtBrandName : "Brand Name",
        txtCustomerName : "Authorized Name",
        txtCustomerLastname : "Authorized Surname",
        txtAddress : "Address",
        txtCountry : "Country",
        txtZipCode : "Postal Code",
        txtCity : "City",
        txtPhone : "Phone",
        txtFax : "Fax",
        txtEmail : "Email",
        txtWeb : "Website",
        txtApeCode : "Ape Code",
        txtRSC : "RSC",
        txtTaxOffice : "Tax Office",
        txtTaxNo : "Tax No",
        txtIntVatNo : "Int. VAT No",
        txtSirenNo : "Siren No",
        txtSiretId : "Siret No",
        msgSave :
        {
            title : "Attention",
            btn01 : "Yes",
            btn02 : "No",
            msg : "Are you sure you want to save?"
        },
        msgSaveResult :
        {
            title : "Attention",
            btn01 : "OK",
            msgSuccess : "Save successful!",
            msgFailed : "Save failed!"
        },
        msgSaveValid :
        {
            title : "Attention",
            btn01 : "OK",
            msg : "Please fill in the required fields!"
        }
    }
}
export default lang