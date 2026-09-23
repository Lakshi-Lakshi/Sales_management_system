// ==========================================
// Purchases Management
// ==========================================

const purchaseForm =
    document.getElementById("purchaseForm");

const supplierSelect =
    document.getElementById("supplier");

const productSelect =
    document.getElementById("purchaseProduct");

const purchaseQuantity =
    document.getElementById("purchaseQuantity");

const purchaseDate =
    document.getElementById("purchaseDate");

const purchaseMessage =
    document.getElementById("purchaseMessage");

const purchaseSearch =
    document.getElementById("purchaseSearch");

const purchaseTableBody =
    document.getElementById("purchaseTableBody");


// ==========================================
// SHOW MESSAGE - 3 SECONDS
// ==========================================

function showPurchaseMessage(message) {

    purchaseMessage.textContent = message;

    setTimeout(() => {

        purchaseMessage.textContent = "";

    }, 3000);
}


// ==========================================
// LOAD SUPPLIERS
// ==========================================

async function loadSuppliers() {

    try {

        const response = await fetch(
            "../../backend/suppliers/get.php"
        );

        const data = await response.json();

        console.log("Suppliers API:", data);

        supplierSelect.innerHTML =
            `<option value="">Select Supplier</option>`;

        const suppliers =
            Array.isArray(data)
                ? data
                : data.suppliers;

        if (Array.isArray(suppliers)) {

            suppliers.forEach(supplier => {

                const option =
                    document.createElement("option");

                option.value =
                    supplier.id;

                option.textContent =
                    supplier.supplier_name;

                supplierSelect.appendChild(option);

            });
        }

    } catch (error) {

        console.error(
            "Error loading suppliers:",
            error
        );

        supplierSelect.innerHTML =
            `<option value="">
                Unable to load suppliers
            </option>`;
    }
}


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    try {

        const response = await fetch(
            "../../backend/products/get.php"
        );

        const data = await response.json();

        console.log("Products API:", data);

        productSelect.innerHTML =
            `<option value="">Select Product</option>`;

        if (
            data.success &&
            Array.isArray(data.products)
        ) {

            data.products.forEach(product => {

                const option =
                    document.createElement("option");

                option.value =
                    product.id;

                option.textContent =
                    `${product.product_name} - Rs. ${product.price}`;

                productSelect.appendChild(option);

            });
        }

    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

        productSelect.innerHTML =
            `<option value="">
                Unable to load products
            </option>`;
    }
}


// ==========================================
// LOAD PURCHASES
// ==========================================

async function loadPurchases() {

    try {

        const response = await fetch(
            "../../backend/purchases/get.php"
        );

        const data = await response.json();

        console.log(
            "Purchases API:",
            data
        );

        const purchases =
            Array.isArray(data)
                ? data
                : data.purchases;

        displayPurchases(purchases);

    } catch (error) {

        console.error(
            "Error loading purchases:",
            error
        );

        purchaseTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load purchases
                </td>
            </tr>
        `;
    }
}


// ==========================================
// DISPLAY PURCHASES
// ==========================================

function displayPurchases(purchases) {

    purchaseTableBody.innerHTML = "";

    if (
        !Array.isArray(purchases) ||
        purchases.length === 0
    ) {

        purchaseTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No purchases available
                </td>
            </tr>
        `;

        return;
    }


    purchases.forEach(purchase => {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                ${purchase.id}
            </td>

            <td>
                ${purchase.supplier_name ?? "-"}
            </td>

            <td>
                ${purchase.product_name ?? "-"}
            </td>

            <td>
                ${purchase.quantity ?? "-"}
            </td>

            <td>
                ${purchase.purchase_date ?? "-"}
            </td>

            <td>

                <button
                    class="btn-secondary"
                    onclick="deletePurchase(${purchase.id})"
                >
                    Delete
                </button>

            </td>
        `;


        purchaseTableBody.appendChild(row);

    });
}


// ==========================================
// ADD PURCHASE
// ==========================================

purchaseForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Supplier validation
        if (!supplierSelect.value) {

            showPurchaseMessage(
                "Please select a supplier."
            );

            return;
        }


        // Product validation
        if (!productSelect.value) {

            showPurchaseMessage(
                "Please select a product."
            );

            return;
        }


        // Quantity validation
        if (
            !purchaseQuantity.value ||
            Number(purchaseQuantity.value) <= 0
        ) {

            showPurchaseMessage(
                "Please enter a valid quantity."
            );

            return;
        }


        const formData =
            new FormData(purchaseForm);


        try {

            const response = await fetch(
                "../../backend/purchases/add.php",
                {
                    method: "POST",
                    body: formData
                }
            );


            const result =
                await response.text();


            console.log(
                "Add Purchase:",
                result
            );


            showPurchaseMessage(result);


            if (
                response.ok &&
                result.includes("successfully")
            ) {

                purchaseForm.reset();

                setPurchaseDate();

                await loadPurchases();

                await loadProducts();
            }


        } catch (error) {

            console.error(
                "Error adding purchase:",
                error
            );


            showPurchaseMessage(
                "Unable to add purchase."
            );
        }

    }
);


// ==========================================
// DELETE PURCHASE
// ==========================================

async function deletePurchase(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this purchase?"
        );


    if (!confirmDelete) {

        return;
    }


    const formData =
        new FormData();


    formData.append(
        "id",
        id
    );


    try {

        const response =
            await fetch(
                "../../backend/purchases/delete.php",
                {
                    method: "POST",
                    body: formData
                }
            );


        const result =
            await response.text();


        console.log(
            "Delete Purchase:",
            result
        );


        showPurchaseMessage(result);


        await loadPurchases();

        await loadProducts();


    } catch (error) {

        console.error(
            "Error deleting purchase:",
            error
        );


        showPurchaseMessage(
            "Unable to delete purchase."
        );
    }
}


// ==========================================
// SEARCH PURCHASES
// ==========================================

purchaseSearch.addEventListener(
    "input",
    async function () {

        const searchValue =
            purchaseSearch.value
                .toLowerCase()
                .trim();


        try {

            const response =
                await fetch(
                    "../../backend/purchases/get.php"
                );


            const data =
                await response.json();


            const purchases =
                Array.isArray(data)
                    ? data
                    : data.purchases;


            const filteredPurchases =
                purchases.filter(purchase => {

                    const supplierName =
                        String(
                            purchase.supplier_name ?? ""
                        ).toLowerCase();


                    const productName =
                        String(
                            purchase.product_name ?? ""
                        ).toLowerCase();


                    const purchaseId =
                        String(
                            purchase.id ?? ""
                        ).toLowerCase();


                    return (
                        supplierName.includes(
                            searchValue
                        ) ||

                        productName.includes(
                            searchValue
                        ) ||

                        purchaseId.includes(
                            searchValue
                        )
                    );

                });


            displayPurchases(
                filteredPurchases
            );


        } catch (error) {

            console.error(
                "Purchase search error:",
                error
            );
        }

    }
);


// ==========================================
// SET TODAY'S DATE
// ==========================================

function setPurchaseDate() {

    if (!purchaseDate) {

        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    purchaseDate.value =
        `${year}-${month}-${day}`;
}


// ==========================================
// INITIAL LOAD
// ==========================================

loadSuppliers();

loadProducts();

loadPurchases();

setPurchaseDate();