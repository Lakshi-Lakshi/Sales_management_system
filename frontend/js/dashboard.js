console.log("DASHBOARD JS LOADED");
console.log("Loading dashboard data...");

// ===============================
// DASHBOARD ELEMENTS
// ===============================

const totalProducts =
    document.getElementById("totalProducts");

const totalCustomers =
    document.getElementById("totalCustomers");

const totalSales =
    document.getElementById("totalSales");

const lowStock =
    document.getElementById("lowStock");

const recentSalesTable =
    document.getElementById("recentSalesTable");


// ===============================
// CHECK HTML ELEMENTS
// ===============================

console.log(
    "totalProducts element:",
    totalProducts
);

console.log(
    "totalCustomers element:",
    totalCustomers
);

console.log(
    "totalSales element:",
    totalSales
);

console.log(
    "lowStock element:",
    lowStock
);

console.log(
    "recentSalesTable element:",
    recentSalesTable
);


// ===============================
// LOAD DASHBOARD DATA
// ===============================

async function loadDashboard() {

    try {

        console.log("Fetching dashboard API...");


        const response = await fetch(
            "../../backend/dashboard/get.php"
        );


        console.log(
            "API request completed"
        );


        const data = await response.json();


        console.log(
            "Dashboard response:",
            data
        );


        // ===============================
        // CHECK RESPONSE
        // ===============================

        if (!data.success) {

            console.error(
                "Dashboard data error"
            );

            return;
        }


        // ===============================
        // DASHBOARD CARD VALUES
        // ===============================

        totalProducts.textContent =
            data.totalProducts;


        totalCustomers.textContent =
            data.totalCustomers;


        totalSales.textContent =
            data.totalSales;


        lowStock.textContent =
            data.lowStock;


        console.log(
            "Dashboard card values updated"
        );


        // ===============================
        // RECENT SALES
        // ===============================

        displayRecentSales(
            data.recentSales
        );


        console.log(
            "Recent sales displayed"
        );

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// ===============================
// DISPLAY RECENT SALES
// ===============================

function displayRecentSales(sales) {

    recentSalesTable.innerHTML = "";


    // ===============================
    // NO SALES DATA
    // ===============================

    if (
        !Array.isArray(sales) ||
        sales.length === 0
    ) {

        recentSalesTable.innerHTML = `
            <tr>
                <td colspan="6">
                    No sales data available
                </td>
            </tr>
        `;

        return;
    }


    // ===============================
    // DISPLAY SALES
    // ===============================

    sales.forEach(function (sale) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${sale.id}
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


        recentSalesTable.appendChild(row);

    });

}


// ===============================
// LOAD DASHBOARD
// ===============================

loadDashboard();