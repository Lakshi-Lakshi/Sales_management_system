const inventoryTotalProducts =
    document.getElementById("inventoryTotalProducts");

const totalStock =
    document.getElementById("totalStock");

const lowStockItems =
    document.getElementById("lowStockItems");

const inventorySearch =
    document.getElementById("inventorySearch");

const inventoryTableBody =
    document.getElementById("inventoryTableBody");

const lowStockTableBody =
    document.getElementById("lowStockTableBody");


// ===============================
// LOAD INVENTORY
// ===============================

async function loadInventory() {

    try {

        const response = await fetch(
            "../../backend/inventory/get.php"
        );

        const inventory =
            await response.json();

        console.log(
            "Inventory:",
            inventory
        );

        displayInventory(inventory);

        calculateInventorySummary(inventory);

    } catch (error) {

        console.error(
            "Error loading inventory:",
            error
        );

        inventoryTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load inventory
                </td>
            </tr>
        `;
    }
}


// ===============================
// DISPLAY INVENTORY
// ===============================

function displayInventory(inventory) {

    inventoryTableBody.innerHTML = "";


    if (
        !Array.isArray(inventory) ||
        inventory.length === 0
    ) {

        inventoryTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No inventory available
                </td>
            </tr>
        `;

        lowStockTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No low stock items
                </td>
            </tr>
        `;

        return;
    }


    inventory.forEach(item => {

        const row =
            document.createElement("tr");


        const quantity =
            Number(
                item.available_quantity ??
                item.quantity ??
                0
            );


        const stockLevel =
            Number(
                item.stock_level ??
                quantity
            );


        let status = "In Stock";


        if (quantity <= 5) {

            status = "Low Stock";

        }


        if (quantity === 0) {

            status = "Out of Stock";

        }


        row.innerHTML = `
            <td>
                ${item.id}
            </td>

            <td>
                ${item.product_name ?? "-"}
            </td>

            <td>
                ${item.category_name ?? "-"}
            </td>

            <td>
                ${quantity}
            </td>

            <td>
                ${stockLevel}
            </td>

            <td>
                ${status}
            </td>
        `;


        inventoryTableBody.appendChild(row);

    });


    displayLowStockItems(inventory);
}


// ===============================
// DISPLAY LOW STOCK ITEMS
// ===============================

function displayLowStockItems(inventory) {

    lowStockTableBody.innerHTML = "";


    const lowStockProducts =
        inventory.filter(item => {

            const quantity =
                Number(
                    item.available_quantity ??
                    item.quantity ??
                    0
                );

            return quantity <= 5;

        });


    if (
        lowStockProducts.length === 0
    ) {

        lowStockTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No low stock items
                </td>
            </tr>
        `;

        return;
    }


    lowStockProducts.forEach(item => {

        const row =
            document.createElement("tr");


        const quantity =
            Number(
                item.available_quantity ??
                item.quantity ??
                0
            );


        let status =
            "Low Stock";


        if (quantity === 0) {

            status =
                "Out of Stock";
        }


        row.innerHTML = `
            <td>
                ${item.id}
            </td>

            <td>
                ${item.product_name ?? "-"}
            </td>

            <td>
                ${item.category_name ?? "-"}
            </td>

            <td>
                ${quantity}
            </td>

            <td>
                ${status}
            </td>
        `;


        lowStockTableBody.appendChild(row);

    });
}


// ===============================
// INVENTORY SUMMARY
// ===============================

function calculateInventorySummary(inventory) {

    const totalProducts =
        inventory.length;


    const totalQuantity =
        inventory.reduce(
            (total, item) => {

                return total +
                    Number(
                        item.available_quantity ??
                        item.quantity ??
                        0
                    );

            },
            0
        );


    const lowStockCount =
        inventory.filter(item => {

            const quantity =
                Number(
                    item.available_quantity ??
                    item.quantity ??
                    0
                );

            return quantity <= 5;

        }).length;


    inventoryTotalProducts.textContent =
        totalProducts;


    totalStock.textContent =
        totalQuantity;


    lowStockItems.textContent =
        lowStockCount;
}


// ===============================
// SEARCH INVENTORY
// ===============================

inventorySearch.addEventListener(
    "input",
    async function () {

        const searchValue =
            inventorySearch.value
                .toLowerCase()
                .trim();


        try {

            const response =
                await fetch(
                    "../../backend/inventory/get.php"
                );


            const inventory =
                await response.json();


            const filteredInventory =
                inventory.filter(item => {

                    const productName =
                        String(
                            item.product_name ?? ""
                        ).toLowerCase();


                    const categoryName =
                        String(
                            item.category_name ?? ""
                        ).toLowerCase();


                    const productId =
                        String(
                            item.id
                        ).toLowerCase();


                    return (
                        productName.includes(searchValue) ||
                        categoryName.includes(searchValue) ||
                        productId.includes(searchValue)
                    );

                });


            displayInventory(
                filteredInventory
            );


        } catch (error) {

            console.error(
                "Inventory search error:",
                error
            );
        }

    }
);


// ===============================
// INITIAL LOAD
// ===============================

loadInventory();