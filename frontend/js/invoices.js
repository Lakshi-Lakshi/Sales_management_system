// ==========================================
// INVOICES PAGE
// ==========================================

console.log("INVOICES JS LOADED");


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const invoiceSearch =
    document.getElementById("invoiceSearch");

const invoiceTableBody =
    document.getElementById("invoiceTableBody");

const invoiceDetails =
    document.getElementById("invoiceDetails");

const printInvoiceBtn =
    document.getElementById("printInvoiceBtn");


// ==========================================
// CHECK HTML ELEMENTS
// ==========================================

console.log("invoiceSearch:", invoiceSearch);
console.log("invoiceTableBody:", invoiceTableBody);
console.log("invoiceDetails:", invoiceDetails);
console.log("printInvoiceBtn:", printInvoiceBtn);


// ==========================================
// STORE INVOICES
// ==========================================

let allInvoices = [];


// ==========================================
// LOAD INVOICES
// ==========================================

async function loadInvoices() {

    console.log("Loading invoices...");

    try {

        const response = await fetch(
            "../../backend/invoices/get.php"
        );

        console.log("Response:", response);

        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }

        const invoices =
            await response.json();

        console.log("API DATA:", invoices);


        // ==================================
        // CHECK API DATA
        // ==================================

        if (!Array.isArray(invoices)) {

            console.error(
                "API did not return an array:",
                invoices
            );

            invoiceTableBody.innerHTML = `
                <tr>
                    <td colspan="8"
                        style="color:red; text-align:center;">
                        Invalid invoice data
                    </td>
                </tr>
            `;

            return;
        }


        // ==================================
        // SAVE DATA
        // ==================================

        allInvoices = invoices;

        console.log(
            "Total invoices:",
            allInvoices.length
        );


        // ==================================
        // DISPLAY INVOICES
        // ==================================

        displayInvoices(allInvoices);


    } catch (error) {

        console.error(
            "Invoice loading error:",
            error
        );

        invoiceTableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    style="color:red; text-align:center;">
                    Unable to load invoices
                </td>
            </tr>
        `;
    }
}


// ==========================================
// DISPLAY INVOICES
// ==========================================

function displayInvoices(invoices) {

    console.log(
        "DISPLAY FUNCTION CALLED"
    );

    console.log(
        "Displaying invoices:",
        invoices
    );


    // Clear old rows
    invoiceTableBody.innerHTML = "";


    // ==================================
    // NO INVOICES
    // ==================================

    if (
        !Array.isArray(invoices) ||
        invoices.length === 0
    ) {

        invoiceTableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;">
                    No invoices available
                </td>
            </tr>
        `;

        return;
    }


    // ==================================
    // CREATE INVOICE ROWS
    // ==================================

    invoices.forEach(
        function(invoice) {

            console.log(
                "Current invoice:",
                invoice
            );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${invoice.id || "-"}
                </td>

                <td>
                    ${invoice.sale_id || "-"}
                </td>

                <td>
                    ${invoice.product_details || "-"}
                </td>

                <td>
                    ${invoice.quantity || "0"}
                </td>

                <td>
                    ${invoice.price || "0.00"}
                </td>

                <td>
                    ${invoice.total || "0.00"}
                </td>

                <td>
                    ${invoice.invoice_date || "-"}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-primary view-invoice-btn"
                    >
                        View
                    </button>

                </td>

            `;


            // ==================================
            // VIEW BUTTON
            // ==================================

            const viewButton =
                row.querySelector(
                    ".view-invoice-btn"
                );


            viewButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    event.stopPropagation();

                    showInvoiceDetails(invoice);

                }
            );


            // Add row to table
            invoiceTableBody.appendChild(row);

        }
    );
}


// ==========================================
// SHOW INVOICE DETAILS
// ==========================================

function showInvoiceDetails(invoice) {

    console.log(
        "Selected invoice:",
        invoice
    );


    // ==================================
    // DISPLAY DETAILS
    // ==================================

    invoiceDetails.innerHTML = `

        <div class="invoice-content">

            <h2>
                Sales Invoice
            </h2>

            <hr>


            <p>
                <strong>Invoice ID:</strong>
                ${invoice.id || "-"}
            </p>


            <p>
                <strong>Sale ID:</strong>
                ${invoice.sale_id || "-"}
            </p>


            <p>
                <strong>Customer:</strong>
                ${invoice.customer_name || "-"}
            </p>


            <p>
                <strong>Product:</strong>
                ${invoice.product_details || "-"}
            </p>


            <p>
                <strong>Quantity:</strong>
                ${invoice.quantity || "0"}
            </p>


            <p>
                <strong>Price:</strong>
                Rs. ${invoice.price || "0.00"}
            </p>


            <p>
                <strong>Total:</strong>
                Rs. ${invoice.total || "0.00"}
            </p>


            <p>
                <strong>Invoice Date:</strong>
                ${invoice.invoice_date || "-"}
            </p>


            <hr>


            <h3>
                Total:
                Rs. ${invoice.total || "0.00"}
            </h3>

        </div>

    `;


    // Scroll to details
    invoiceDetails.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ==========================================
// SEARCH
// ==========================================

if (invoiceSearch) {

    invoiceSearch.addEventListener(
        "input",
        function() {

            const searchValue =
                invoiceSearch.value
                    .toLowerCase()
                    .trim();


            const filteredInvoices =
                allInvoices.filter(
                    function(invoice) {

                        return (

                            String(
                                invoice.id || ""
                            )
                            .toLowerCase()
                            .includes(searchValue)

                            ||

                            String(
                                invoice.sale_id || ""
                            )
                            .toLowerCase()
                            .includes(searchValue)

                            ||

                            String(
                                invoice.product_details || ""
                            )
                            .toLowerCase()
                            .includes(searchValue)

                            ||

                            String(
                                invoice.customer_name || ""
                            )
                            .toLowerCase()
                            .includes(searchValue)

                        );

                    }
                );


            displayInvoices(
                filteredInvoices
            );

        }
    );

}


// ==========================================
// PRINT INVOICE
// ==========================================

if (printInvoiceBtn) {

    printInvoiceBtn.addEventListener(
        "click",
        function() {

            const invoiceContent =
                invoiceDetails.querySelector(
                    ".invoice-content"
                );


            if (!invoiceContent) {

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


            if (!printWindow) {

                alert(
                    "Please allow pop-ups."
                );

                return;
            }


            printWindow.document.write(`

                <!DOCTYPE html>

                <html>

                <head>

                    <title>
                        Sales Invoice
                    </title>

                    <style>

                        body {

                            font-family:
                                Arial,
                                sans-serif;

                            padding:
                                40px;

                        }


                        .invoice {

                            max-width:
                                700px;

                            margin:
                                auto;

                            border:
                                1px solid #ddd;

                            padding:
                                30px;

                        }


                        h2 {

                            text-align:
                                center;

                        }


                        h3 {

                            text-align:
                                right;

                        }


                        p {

                            margin:
                                12px 0;

                        }


                        hr {

                            border:
                                none;

                            border-top:
                                1px solid #ccc;

                            margin:
                                20px 0;

                        }

                    </style>

                </head>


                <body>

                    <div class="invoice">

                        ${invoiceContent.innerHTML}

                    </div>

                </body>

                </html>

            `);


            printWindow.document.close();

            printWindow.focus();


            setTimeout(
                function() {

                    printWindow.print();

                },
                500
            );

        }
    );

}


// ==========================================
// START
// ==========================================

loadInvoices();

