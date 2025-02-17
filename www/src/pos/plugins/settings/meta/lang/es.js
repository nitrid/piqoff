const lang =
{
    posSettings :
    {
        posItemsList : "Productos",
        posSaleReport : "Informe de Ventas",
        posCustomerPointReport : "Informe de Puntos de Cliente",
        posTicketEndDescription : "Descripción Final del Recibo",
        posGroupSaleReport : "Informe de Ventas por Grupo",
        posCompanyInfo : "Información de la Empresa",
    },
    posItemsList :
    {
        title : "Lista de Productos",
        btnItemSearch : "Buscar",
        txtItemSearchPholder : "Ingrese nombre o código del producto",
        grdItemList :
        {
            CODE : "Código del Producto",
            NAME : "Nombre del Producto",
            VAT : "IVA"
        },
        popItemEdit :
        {
            title : "Nuevo Producto",
            txtRef : "Código del Producto",
            txtName : "Nombre del Producto",
            cmbMainUnit : "Unidad Principal",
            cmbUnderUnit : "Unidad Secundaria",
            cmbItemGrp : "Grupo de Productos",
            cmbOrigin : "Origen",
            cmbTax : "Impuesto",
            chkActive : "Activo",
            chkCaseWeighed : "Pesar en Caja",
            chkLineMerged : "Unir Líneas",
            chkTicketRest : "Ticket Rest.",
            tabTitlePrice : "Precio",
            tabTitleUnit : "Unidad",
            tabTitleBarcode : "Código de Barras",
            msgItemValidation :
            {
                title : "Atención",
                btn01 : "OK",
                msg1 : "¡El código del producto no puede estar vacío!",
                msg2 : "¡El nombre del producto no puede estar vacío!",
            },
            msgPriceSave:
            {
                title: "Atención",
                btn01: "OK",
                msg: "¡Por favor ingrese un precio!"
            },
            msgNewItem :
            {
                title : "Atención",
                btn01 : "OK",
                btn02 : "Cancelar",
                msg : "¿Está seguro de que desea crear un nuevo producto?"
            },
            msgSave:
            {
                title: "Atención",
                btn01: "OK",
                btn02: "Cancelar",
                msg: "¿Está seguro de que desea guardar?"
            },
            msgSaveResult:
            {
                title: "Atención",
                btn01: "OK",
                msgSuccess: "¡Guardado exitoso!",
                msgFailed: "¡Guardado fallido!"
            },
            msgDelete:
            {
                title: "Atención",
                btn01: "OK",
                btn02: "Cancelar",
                msg: "¿Está seguro de que desea eliminar el registro?"
            },
            msgNotDelete:
            {
                title: "Atención",
                btn01: "OK",
                msg: "¡Este producto no se puede eliminar porque ya ha sido procesado!"
            },
            msgItemExist:
            {
                title: "Atención",
                btn01: "Sí",
                btn02: "No",
                msg: "El producto ingresado ya existe. ¿Desea ir al producto?"
            },
            grdPrice :
            {
                clmStartDate : "Fecha Inicio",
                clmFinishDate : "Fecha Fin",
                clmQuantity : "Cantidad",
                clmPrice : "Precio",
                clmPriceHT : "Sin IVA",
                clmPriceTTC : "Con IVA",
            },
            grdUnit :
            {
                clmType : "Tipo",
                clmName : "Nombre",
                clmFactor : "Factor",
            },
            grdBarcode :
            {
                clmBarcode : "Código de Barras",
                clmUnit : "Unidad",
                clmType : "Tipo",
            },
            cmbMainUnit : "Unidad Principal",
            cmbUnderUnit : "Unidad Secundaria",
            popPrice :
            {
                title : "Precio",
                dtPopPriStartDate : "Fecha Inicio",
                dtPopPriEndDate : "Fecha Fin",
                txtPopPriQuantity : "Cantidad",
                txtPopPriPrice : "Precio",
                btnSave : "Guardar",
                btnCancel : "Cancelar",
                msgCheckPrice:
                {
                    title: "Atención",
                    btn01: "OK",
                    msg: "¡No puede crear un registro similar!"
                },
                msgCostPriceValid:
                {
                    title: "Atención",
                    btn01: "OK",
                    msg: "¡Por favor ingrese un precio mayor al precio de costo!"
                },
                msgPriceAdd:
                {
                    title: "Atención",
                    btn01: "OK",
                    msg: "¡Por favor complete los campos necesarios!"
                },
                msgPriceEmpty :
                {
                    title: "Atención",
                    btn01: "OK",
                    msg: "¡El campo de precio no puede estar vacío o ser cero!"
                },
                msgPriceNotNumber :
                {
                    title: "Atención",
                    btn01: "OK",
                    msg: "¡El campo de precio debe ser un valor numérico!"
                },
                msgPriceQuantityEmpty :
                {
                    title: "Atención",
                    btn01: "OK",
                    msg: "¡El campo de cantidad no puede estar vacío o ser cero!"
                },
                msgPriceQuantityNotNumber :
                {
                    title: "Atención",
                    btn01: "OK",
                    msg: "¡El campo de cantidad debe ser un valor numérico!"
                }
            },
            popUnit :
            {
                title : "Unidad",
                cmbPopUnitName : "Unidad",
                txtPopUnitFactor : "Factor",
                btnSave : "Guardar",
                btnCancel : "Cancelar",
                msgUnitRowNotDelete :
                {
                    title: "Atención",
                    btn01: "OK",
                    msg: "¡No puede eliminar la unidad principal o secundaria!"
                },
                msgUnitRowNotEdit :
                {
                    title: "Atención",
                    btn01: "OK",
                    msg: "¡No puede editar la unidad principal o secundaria!"
                },
                msgUnitFactorEmpty :
                {
                    title: "Atención",
                    btn01 : "OK",
                    msg : "¡El campo de factor no puede estar vacío o ser cero!"
                },
                msgUnitFactorNotNumber :
                {
                    title: "Atención",
                    btn01 : "OK",
                    msg : "¡El campo de factor debe ser un valor numérico!"
                }
            },
            popBarcode :
            {
                title : "Código de Barras",
                txtPopBarcode : "Código de Barras",
                cmbPopBarType : "Tipo",
                cmbPopBarUnitType : "Unidad",
                btnSave : "Guardar",
                btnCancel : "Cancelar",
                msgBarcodeExist :
                {
                    title : "Atención",
                    btn01 : "OK",
                    msg : "¡Este código de barras ya existe!"
                },
                msgBarcodeEmpty :
                {
                    title : "Atención",
                    btn01 : "OK",
                    msg : "¡El campo de código de barras no puede estar vacío!"
                }
            },
            popAddItemGrp :
            {
                title : "Agregar Grupo de Productos",
                txtAddItemGrpCode : "Código",
                txtAddItemGrpName : "Nombre",
                btnSave : "Guardar",
                btnCancel : "Cancelar",
                msgAddItemGrpEmpty :
                {
                    title : "Atención",
                    btn01 : "OK",
                    msg : "¡Por favor complete los campos necesarios!"
                },
                msgAddItemGrpExist :
                {
                    title : "Atención",
                    btn01 : "OK",
                    msg : "¡Este código ya existe!"
                }
            }
        }
    },
    posSaleReport :
    {
        btnGet : "Obtener",
        txtTotalTicket : "Total de Recibos",
        txtTicketAvg : "Promedio de Recibo",
    },
    posCustomerPointReport :
    {
        txtCustomerCode : "Código del Cliente",
        txtCustomerName : "Nombre del Cliente",
        txtAmount : "Monto Total",
        btnGet : "Obtener",
        popCustomers :
        {
            title : "Selección de Cliente",
            clmCode : "Código",
            clmTitle : "Nombre",
            clmTypeName : "Tipo",
            clmGenusName : "Género",
            btnSelectCustomer : "Seleccionar",
            btnCustomerSearch : "Buscar",
        },
        grdCustomerPointReport :
        {
            clmCode: "Código",
            clmTitle: "Nombre",
            clmPoint: "Puntos",
            clmLdate : "Última Actualización",
            clmEur : "Euro"
        },
        popPointDetail :
        {
            title : "Detalle de Puntos",
            clmDate : "Fecha",
            clmPosId : "Código POS",
            clmPoint : "Puntos",
            clmDescription : "Descripción",
            exportFileName : "detalle_puntos_cliente",
            btnAddPoint : "Agregar Puntos",
        },
        popPointSaleDetail :
        {
            title : "Detalle de Venta de Puntos",
            TicketId : "No. de Recibo",
            clmBarcode : "Código de Barras",
            clmName : "Nombre del Producto",
            clmQuantity : "Cantidad",
            clmPrice : "Precio",
            clmTotal : "Total",
            clmPayName : "Tipo de Pago",
            clmLineTotal : "Total",
            exportFileName : "detalle_venta_puntos_cliente",
        },
        popPointEntry :
        {
            title : "Entrada de Puntos",
            cmbPointType : "Tipo",
            cmbTypeData :
            {
                in : "Entrada",
                out : "Salida",
            },
            txtPoint : "Puntos",
            txtPointAmount : "Monto de Puntos",
            txtDescription : "Descripción",
            descriptionPlace : "Ingrese descripción",
            btnAdd : "Agregar",
            msgDescription :
            {
                title : "Atención",
                btn01 : "OK",
                msg : "¡La descripción debe tener al menos 14 caracteres!",
            },
            msgPointNotNumber :
            {
                title : "Atención",
                btn01 : "OK",
                msg : "¡El campo de puntos debe ser un valor numérico!",
            }
        }
    },
    posTicketEndDescription :
    {
        cmbFirm : "Empresa",
        txtDescriptionPlaceHolder : "Ingrese descripción",
        msgSaveResult :
        {
            title : "Atención",
            btn01 : "OK",
            msgSuccess : "¡Guardado exitoso!",
        }
    },
    posGrpSalesReport :
    {
        chkTicket : "Cantidad de Recibos",
        txtTotalTicket : "Total de Recibos",
        txtTicketAvg : "Promedio de Recibo",
        btnGet : "Obtener",
        btnGetAnalysis : "Análisis",
        grdGroupSalesReport :
        {
            clmGrpCode : "Código",
            clmGrpName : "Nombre",
            clmTicket : "Cantidad de Recibos",
            clmQuantity : "Cantidad",
            clmTotalCost : "Costo Total",
            clmFamount : "Sin IVA",
            clmVat : "IVA",
            clmTotal : "Total",
            clmRestTotal : "Total Restante",
            exportFileName : "informe_ventas_grupo",
        },
        grpGrpDetail :
        {
            title : "Detalle del Grupo de Productos",
            clmCode : "Código",
            clmName : "Nombre",
            clmQuantity : "Cantidad",
            clmTotalCost : "Costo Total",
            clmFamount : "Sin IVA",
            clmVat : "IVA",
            clmTotal : "Total",
            clmRestTotal : "Total Restante",
            exportFileName : "detalle_grupo_productos",
        },
        popAnalysis :
        {
            title : "Análisis",
        }
    },
    posCompanyInfo :
    {
        validation :
        {
            notValid : "¡Por favor complete los campos necesarios!",
        },
        txtTitle : "Nombre de la Empresa",
        txtBrandName : "Nombre de la Marca",
        txtCustomerName : "Nombre del Responsable",
        txtCustomerLastname : "Apellido del Responsable",
        txtAddress : "Dirección",
        txtCountry : "País",
        txtZipCode : "Código Postal",
        txtCity : "Ciudad",
        txtPhone : "Teléfono",
        txtFax : "Fax",
        txtEmail : "Correo Electrónico",
        txtWeb : "Sitio Web",
        txtApeCode : "Código Ape",
        txtRSC : "RSC",
        txtTaxOffice : "Oficina de Impuestos",
        txtTaxNo : "Número de Impuestos",
        txtIntVatNo : "Número de IVA Internacional",
        txtSirenNo : "Número Siren",
        txtSiretId : "Número Siret",
        msgSave :
        {
            title : "Atención",
            btn01 : "Sí",
            btn02 : "No",
            msg : "¿Está seguro de que desea guardar?",
        },
        msgSaveResult :
        {
            title : "Atención",
            btn01 : "OK",
            msgSuccess : "¡Guardado exitoso!",
            msgFailed : "¡Guardado fallido!",
        },
        msgSaveValid :
        {
            title : "Atención",
            btn01 : "OK",
            msg : "¡Por favor complete los campos necesarios!",
        }
    }
}
export default lang