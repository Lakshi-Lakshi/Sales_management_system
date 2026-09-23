// ===============================
// GET HTML ELEMENTS
// ===============================

const reportForm =
    document.getElementById("reportForm");

const reportType =
    document.getElementById("reportType");

const reportPeriod =
    document.getElementById("reportPeriod");

const startDate =
    document.getElementById("startDate");

const endDate =
    document.getElementById("endDate");

const reportMessage =
    document.getElementById("reportMessage");

const reportTotalSales =
    document.getElementById("reportTotalSales");

const reportTotalPurchases =
    document.getElementById("reportTotalPurchases");

const reportItemsSold =
    document.getElementById("reportItemsSold");

const reportItemsPurchased =
    document.getElementById("reportItemsPurchased");

const printReportBtn =
    document.getElementById("printReportBtn");

const reportTableBody =
    document.getElementById("reportTableBody");


// ===============================
// SHOW MESSAGE
// ===============================

function showReportMessage(message) {

    reportMessage.textContent = message;

    setTimeout(function () {

        reportMessage.textContent = "";

    }, 3000);
}


// ===============================
// UPDATE DATE INPUTS
// ===============================

function updateDateInputs() {

    if (reportPeriod.value === "custom") {

        startDate.disabled = false;
        endDate.disabled = false;

    } else {

        startDate.disabled = false;
        endDate.disabled = false;
    }
}

// ===============================
// REPORT PERIOD CHANGE
// ===============================

reportPeriod.addEventListener(
    "change",
    function () {

        updateDateInputs();

    }
);


// ===============================
// INITIAL DATE STATE
// ===============================

// Run when page loads
updateDateInputs();


// ===============================
// OPEN CALENDAR
// ===============================

startDate.addEventListener(
    "click",
    function () {

        if (
            !startDate.disabled &&
            typeof startDate.showPicker === "function"
        ) {

            startDate.showPicker();

        }

    }
);


endDate.addEventListener(
    "click",
    function () {

        if (
            !endDate.disabled &&
            typeof endDate.showPicker === "function"
        ) {

            endDate.showPicker();

        }

    }
);


// ===============================
// LOAD REPORT
// ===============================

reportForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const type =
            reportType.value;

        const period =
            reportPeriod.value;


        // Check report type
        if (!type) {

            showReportMessage(
                "Please select a report type."
            );

            return;
        }


        // Check report period
        if (!period) {

            showReportMessage(
                "Please select a report period."
            );

            return;
        }


        // Check custom dates
        if (
            period === "custom" &&
            (!startDate.value || !endDate.value)
        ) {

            showReportMessage(
                "Please select start and end dates."
            );

            return;
        }


        // Check date order
        if (
            period === "custom" &&
            startDate.value > endDate.value
        ) {

            showReportMessage(
                "Start date cannot be after end date."
            );

            return;
        }


        // Show loading message
        reportMessage.textContent =
            "Loading report...";


        try {

            const params =
                new URLSearchParams();


            params.append(
                "type",
                type
            );


            params.append(
                "period",
                period
            );


            // Add dates only for custom period
            if (period === "custom") {

                params.append(
                    "start_date",
                    startDate.value
                );

                params.append(
                    "end_date",
                    endDate.value
                );
            }


            const response =
                await fetch(
                    `../../backend/reports/get.php?${params.toString()}`
                );


            const data =
                await response.json();


            console.log(
                "Report:",
                data
            );


            if (!response.ok) {

                showReportMessage(
                    data.message ||
                    "Unable to generate report."
                );

                return;
            }


            displayReport(data);


            showReportMessage(
                "Report generated successfully."
            );


        } catch (error) {

            console.error(
                "Report error:",
                error
            );


            showReportMessage(
                "Unable to generate report."
            );

        }

    }
);


// ===============================
// DISPLAY REPORT
// ===============================

function displayReport(data) {

    const summary =
        data.summary || data;


    // Total Sales
    reportTotalSales.textContent =
        formatNumber(
            summary.total_sales ?? 0
        );


    // Total Purchases
    reportTotalPurchases.textContent =
        formatNumber(
            summary.total_purchases ?? 0
        );


    // Items Sold
    reportItemsSold.textContent =
        formatNumber(
            summary.items_sold ?? 0
        );


    // Items Purchased
    reportItemsPurchased.textContent =
        formatNumber(
            summary.items_purchased ?? 0
        );


    // Display records
    displayReportTable(
        data.records ||
        data.sales ||
        data.purchases ||
        []
    );

}


// ===============================
// DISPLAY REPORT TABLE
// ===============================

function displayReportTable(records) {

    reportTableBody.innerHTML = "";


    if (
        !Array.isArray(records) ||
        records.length === 0
    ) {

        reportTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No report data available
                </td>
            </tr>
        `;

        return;
    }


    records.forEach(function (record) {

        const row =
            document.createElement("tr");


        // Date
        const date =
            record.sale_date ??
            record.purchase_date ??
            record.created_at ??
            "-";


        // Amount
        const amount =
            record.total ??
            record.amount ??
            record.price ??
            "-";


        row.innerHTML = `

            <td>
                ${record.id ?? "-"}
            </td>

            <td>
                ${date}
            </td>

           <td>
                ${record.type ??
                    (
                        reportType.value === "sales"
                            ? "Sale"
                            : reportType.value === "purchases"
                                ? "Purchase"
                                : "Inventory"
                    )
                }
            </td>

            <td>
                ${record.product_name ?? "-"}
            </td>

            <td>
                ${record.quantity ?? "-"}
            </td>

            <td>
                ${amount}
            </td>

        `;


        reportTableBody.appendChild(row);

    });

}


// ===============================
// FORMAT NUMBER
// ===============================

function formatNumber(value) {

    const number =
        Number(value) || 0;


    return number.toFixed(2);

}


// ===============================
// PRINT REPORT
// ===============================

printReportBtn.addEventListener(
    "click",
    function () {

        if (
            !reportTableBody.innerHTML.trim()
        ) {

            showReportMessage(
                "Please generate a report first."
            );

            return;
        }


        const printWindow =
            window.open(
                "",
                "_blank",
                "width=1000,height=700"
            );


        if (!printWindow) {

            showReportMessage(
                "Please allow pop-ups to print the report."
            );

            return;
        }


        printWindow.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    Sales Management Report
                </title>


                <style>

                    body {
                        font-family: Arial, sans-serif;
                        padding: 30px;
                    }


                    h1 {
                        text-align: center;
                        margin-bottom: 30px;
                    }


                    .summary {
                        display: grid;
                        grid-template-columns:
                            repeat(4, 1fr);

                        gap: 15px;

                        margin-bottom: 30px;
                    }


                    .summary-box {
                        border: 1px solid #ccc;

                        padding: 15px;

                        text-align: center;
                    }


                    .summary-box h3 {
                        margin-bottom: 10px;
                    }


                    table {
                        width: 100%;

                        border-collapse: collapse;
                    }


                    th,
                    td {
                        border: 1px solid #ccc;

                        padding: 10px;

                        text-align: left;
                    }


                    th {
                        background: #f2f2f2;
                    }

                </style>

            </head>


            <body>


                <h1>
                    Sales Management Report
                </h1>


                <div class="summary">


                    <div class="summary-box">

                        <h3>
                            Total Sales
                        </h3>

                        <p>
                            ${reportTotalSales.textContent}
                        </p>

                    </div>


                    <div class="summary-box">

                        <h3>
                            Total Purchases
                        </h3>

                        <p>
                            ${reportTotalPurchases.textContent}
                        </p>

                    </div>


                    <div class="summary-box">

                        <h3>
                            Items Sold
                        </h3>

                        <p>
                            ${reportItemsSold.textContent}
                        </p>

                    </div>


                    <div class="summary-box">

                        <h3>
                            Items Purchased
                        </h3>

                        <p>
                            ${reportItemsPurchased.textContent}
                        </p>

                    </div>


                </div>


                <table>

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Type
                            </th>

                            <th>
                                Product
                            </th>

                            <th>
                                Quantity
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${reportTableBody.innerHTML}

                    </tbody>

                </table>


            </body>

            </html>

        `);


        printWindow.document.close();


        printWindow.focus();


        setTimeout(function () {

            printWindow.print();

            printWindow.close();

        }, 300);

    }
);