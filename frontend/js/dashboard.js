// ==========================================
// DASHBOARD
// ==========================================

console.log("DASHBOARD JS LOADED");


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    console.log("Loading dashboard data...");

    try {

        const response = await fetch(
            "../../backend/dashboard/get.php",
            {
                method: "GET",
                cache: "no-store"
            }
        );


        console.log(
            "Dashboard HTTP Status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }


        const data = await response.json();


        console.log(
            "Dashboard API Response:",
            data
        );


        // ==========================================
        // CHECK API RESPONSE
        // ==========================================

        if (!data.success) {

            console.error(
                "Dashboard API Error:",
                data.message
            );

            return;
        }


        // ==========================================
        // GET HTML ELEMENTS
        // ==========================================

        const totalProductsElement =
            document.getElementById(
                "totalProducts"
            );


        const totalCustomersElement =
            document.getElementById(
                "totalCustomers"
            );


        const totalSalesElement =
            document.getElementById(
                "totalSales"
            );


        const lowStockElement =
            document.getElementById(
                "lowStock"
            );


        const recentSalesTable =
            document.getElementById(
                "recentSalesTable"
            );


        console.log(
            "Dashboard HTML Elements:",
            {
                totalProductsElement,
                totalCustomersElement,
                totalSalesElement,
                lowStockElement,
                recentSalesTable
            }
        );


        // ==========================================
        // UPDATE TOTAL PRODUCTS
        // ==========================================

        if (totalProductsElement) {

            totalProductsElement.innerText =
                data.totalProducts;

        }


        // ==========================================
        // UPDATE TOTAL CUSTOMERS
        // ==========================================

        if (totalCustomersElement) {

            totalCustomersElement.innerText =
                data.totalCustomers;

        }


        // ==========================================
        // UPDATE TOTAL SALES
        // ==========================================

        if (totalSalesElement) {

            totalSalesElement.innerText =
                data.totalSales;

        }


        // ==========================================
        // UPDATE LOW STOCK
        // ==========================================

        if (lowStockElement) {

            lowStockElement.innerText =
                data.lowStock;

        }


        // ==========================================
        // DISPLAY RECENT SALES
        // ==========================================

        if (recentSalesTable) {

            displayRecentSales(
                data.recentSales,
                recentSalesTable
            );

        }


        console.log(
            "Dashboard loaded successfully."
        );

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// ==========================================
// DISPLAY RECENT SALES
// ==========================================

function displayRecentSales(
    sales,
    table
) {

    table.innerHTML = "";


    // ==========================================
    // NO SALES
    // ==========================================

    if (
        !Array.isArray(sales) ||
        sales.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No sales data available
                </td>
            </tr>
        `;

        return;
    }


    // ==========================================
    // DISPLAY SALES
    // ==========================================

    sales.forEach(function (sale) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${sale.id ?? "-"}
            </td>

            <td>
                ${sale.customer_name ?? "-"}
            </td>

            <td>
                ${sale.product_name ?? "-"}
            </td>

            <td>
                ${sale.quantity ?? "-"}
            </td>

            <td>
                ${sale.total ?? "-"}
            </td>

            <td>
                ${sale.sale_date ?? "-"}
            </td>

        `;


        table.appendChild(row);

    });

}


// ==========================================
// START
// ==========================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadDashboard
    );

} else {

    loadDashboard();

}
