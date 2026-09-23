const invoiceSearch =
    document.getElementById("invoiceSearch");

const invoiceTableBody =
    document.getElementById("invoiceTableBody");

const invoiceDetails =
    document.getElementById("invoiceDetails");

const printInvoiceBtn =
    document.getElementById("printInvoiceBtn");


// ===============================
// LOAD INVOICES
// ===============================

async function loadInvoices() {

    try {

        const response = await fetch(
            "../../backend/invoices/get.php"
        );

        const invoices =
            await response.json();

        console.log(
            "Invoices:",
            invoices
        );

        displayInvoices(invoices);

    } catch (error) {

        console.error(
            "Error loading invoices:",
            error
        );

        invoiceTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load invoices
                </td>
            </tr>
        `;
    }
}


// ===============================
// DISPLAY INVOICES
// ===============================

function displayInvoices(invoices) {

    invoiceTableBody.innerHTML = "";


    if (
        !Array.isArray(invoices) ||
        invoices.length === 0
    ) {

        invoiceTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No invoices available
                </td>
            </tr>
        `;

        return;
    }


    invoices.forEach(invoice => {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                ${invoice.id}
            </td>

            <td>
                ${invoice.sale_id}
            </td>

            <td>
                ${invoice.product_details ?? "-"}
            </td>

            <td>
                ${invoice.quantity}
            </td>

            <td>
                ${invoice.price}
            </td>

            <td>
                ${invoice.total}
            </td>

            <td>
                ${invoice.invoice_date ?? "-"}
            </td>
        `;


        row.addEventListener(
            "click",
            function () {

                showInvoiceDetails(invoice);

            }
        );


        invoiceTableBody.appendChild(row);

    });
}


// ===============================
// SHOW INVOICE DETAILS
// ===============================

function showInvoiceDetails(invoice) {

    invoiceDetails.innerHTML = `
        <div class="invoice-content">

            <h2>
                Sales Invoice
            </h2>

            <hr>

            <p>
                <strong>Invoice ID:</strong>
                ${invoice.id}
            </p>

            <p>
                <strong>Sale ID:</strong>
                ${invoice.sale_id}
            </p>

            <p>
                <strong>Product:</strong>
                ${invoice.product_details ?? "-"}
            </p>

            <p>
                <strong>Quantity:</strong>
                ${invoice.quantity}
            </p>

            <p>
                <strong>Price:</strong>
                ${invoice.price}
            </p>

            <p>
                <strong>Total:</strong>
                ${invoice.total}
            </p>

            <p>
                <strong>Date:</strong>
                ${invoice.invoice_date ?? "-"}
            </p>

            <hr>

            <h3>
                Total: ${invoice.total}
            </h3>

        </div>
    `;

}


// ===============================
// SEARCH INVOICES
// ===============================

invoiceSearch.addEventListener(
    "input",
    async function () {

        const searchValue =
            invoiceSearch.value
                .toLowerCase()
                .trim();


        try {

            const response =
                await fetch(
                    "../../backend/invoices/get.php"
                );


            const invoices =
                await response.json();


            const filteredInvoices =
                invoices.filter(invoice => {

                    const invoiceId =
                        String(
                            invoice.id
                        ).toLowerCase();


                    const saleId =
                        String(
                            invoice.sale_id
                        ).toLowerCase();


                    const productDetails =
                        String(
                            invoice.product_details ?? ""
                        ).toLowerCase();


                    return (
                        invoiceId.includes(searchValue) ||
                        saleId.includes(searchValue) ||
                        productDetails.includes(searchValue)
                    );

                });


            displayInvoices(
                filteredInvoices
            );


        } catch (error) {

            console.error(
                "Invoice search error:",
                error
            );
        }

    }
);


// ===============================
// PRINT INVOICE
// ===============================

printInvoiceBtn.addEventListener(
    "click",
    function () {

        if (
            !invoiceDetails.innerHTML.trim()
        ) {

            alert(
                "Please select an invoice first."
            );

            return;
        }


        const printWindow =
            window.open(
                "",
                "_blank",
                "width=800,height=600"
            );


        printWindow.document.write(`
            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    Sales Invoice
                </title>

                <style>

                    body {
                        font-family: Arial, sans-serif;
                        padding: 40px;
                    }

                    .invoice {
                        max-width: 700px;
                        margin: auto;
                    }

                    h1,
                    h2,
                    h3 {
                        text-align: center;
                    }

                    p {
                        margin: 12px 0;
                    }

                    hr {
                        border: none;
                        border-top: 1px solid #ccc;
                        margin: 20px 0;
                    }

                </style>

            </head>

            <body>

                <div class="invoice">

                    ${invoiceDetails.innerHTML}

                </div>

            </body>

            </html>
        `);


        printWindow.document.close();

        printWindow.focus();

        printWindow.print();

        printWindow.close();

    }
);


// ===============================
// INITIAL LOAD
// ===============================

loadInvoices();