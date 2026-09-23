// ==========================================
// Sales Management
// ==========================================

const salesForm = document.getElementById("salesForm");
const customerSelect = document.getElementById("customer");
const productSelect = document.getElementById("product");
const saleQuantity = document.getElementById("saleQuantity");
const salePrice = document.getElementById("salePrice");
const saleTotal = document.getElementById("saleTotal");
const salesMessage = document.getElementById("salesMessage");
const salesSearch = document.getElementById("salesSearch");
const salesTableBody = document.getElementById("salesTableBody");


// ==========================================
// SHOW MESSAGE - 3 SECONDS
// ==========================================

function showSalesMessage(message) {

    salesMessage.textContent = message;

    setTimeout(() => {
        salesMessage.textContent = "";
    }, 3000);
}


// ==========================================
// LOAD CUSTOMERS
// ==========================================

async function loadCustomers() {

    try {

        const response = await fetch(
            "../../backend/customers/get.php"
        );

        const data = await response.json();

        console.log("Customers:", data);

        customerSelect.innerHTML =
            `<option value="">Select Customer</option>`;

        const customers = Array.isArray(data)
            ? data
            : data.customers;

        if (Array.isArray(customers)) {

            customers.forEach(customer => {

                const option =
                    document.createElement("option");

                option.value = customer.id;

                option.textContent =
                    customer.customer_name;

                customerSelect.appendChild(option);

            });
        }

    } catch (error) {

        console.error(
            "Error loading customers:",
            error
        );

        customerSelect.innerHTML =
            `<option value="">
                Unable to load customers
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

        console.log("Products:", data);

        productSelect.innerHTML =
            `<option value="">Select Product</option>`;

        const products = Array.isArray(data)
            ? data
            : data.products;

        if (Array.isArray(products)) {

            products.forEach(product => {

                const option =
                    document.createElement("option");

                option.value = product.id;

                option.textContent =
                    `${product.product_name} - ${product.price}`;

                option.dataset.price =
                    product.price;

                option.dataset.quantity =
                    product.quantity;

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
// PRODUCT SELECTION
// ==========================================

productSelect.addEventListener(
    "change",
    function () {

        const selectedOption =
            productSelect.options[
                productSelect.selectedIndex
            ];

        if (
            selectedOption &&
            selectedOption.dataset.price
        ) {

            salePrice.value =
                selectedOption.dataset.price;

        } else {

            salePrice.value = "";
        }

        calculateTotal();
    }
);


// ==========================================
// CALCULATE TOTAL
// ==========================================

function calculateTotal() {

    const quantity =
        Number(saleQuantity.value) || 0;

    const price =
        Number(salePrice.value) || 0;

    const total =
        quantity * price;

    saleTotal.value =
        total.toFixed(2);
}


// ==========================================
// QUANTITY CHANGE
// ==========================================

saleQuantity.addEventListener(
    "input",
    calculateTotal
);


// ==========================================
// PRICE CHANGE
// ==========================================

salePrice.addEventListener(
    "input",
    calculateTotal
);


// ==========================================
// LOAD SALES
// ==========================================

async function loadSales() {

    try {

        const response = await fetch(
            "../../backend/sales/get.php"
        );

        const data =
            await response.json();

        console.log("Sales:", data);

        const sales = Array.isArray(data)
            ? data
            : data.sales;

        displaySales(sales);

    } catch (error) {

        console.error(
            "Error loading sales:",
            error
        );

        salesTableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    Unable to load sales
                </td>
            </tr>
        `;
    }
}


// ==========================================
// DISPLAY SALES
// ==========================================

function displaySales(sales) {

    salesTableBody.innerHTML = "";

    if (
        !Array.isArray(sales) ||
        sales.length === 0
    ) {

        salesTableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    No sales available
                </td>
            </tr>
        `;

        return;
    }

    sales.forEach(sale => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${sale.id}</td>

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
                ${sale.price ?? "-"}
            </td>

            <td>
                ${sale.total ?? "-"}
            </td>

            <td>
                ${sale.sale_date ?? "-"}
            </td>

            <td>

                <button
                    class="btn-secondary"
                    onclick="deleteSale(${sale.id})"
                >
                    Delete
                </button>

            </td>
        `;

        salesTableBody.appendChild(row);

    });
}


// ==========================================
// ADD SALE
// ==========================================

salesForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const selectedProduct =
            productSelect.options[
                productSelect.selectedIndex
            ];


        // Customer validation
        if (!customerSelect.value) {

            showSalesMessage(
                "Please select a customer."
            );

            return;
        }


        // Product validation
        if (!productSelect.value) {

            showSalesMessage(
                "Please select a product."
            );

            return;
        }


        // Quantity validation
        if (
            !saleQuantity.value ||
            Number(saleQuantity.value) <= 0
        ) {

            showSalesMessage(
                "Please enter a valid quantity."
            );

            return;
        }


        // Available quantity
        const availableQuantity =
            Number(
                selectedProduct.dataset.quantity
            );


        // Stock validation
        if (
            Number(saleQuantity.value) >
            availableQuantity
        ) {

            showSalesMessage(
                `Only ${availableQuantity} items are available.`
            );

            return;
        }


        calculateTotal();


        const formData =
            new FormData(salesForm);


        try {

            const response = await fetch(
                "../../backend/sales/add.php",
                {
                    method: "POST",
                    body: formData
                }
            );


            const result =
                await response.text();


            console.log(
                "Add Sale:",
                result
            );


            // Show message for 3 seconds
            showSalesMessage(result);


            // Reset only after successful sale
            if (
                response.ok &&
                result.includes("successfully")
            ) {

                salesForm.reset();

                salePrice.value = "";

                saleTotal.value = "";

                await loadSales();

                await loadProducts();
            }


        } catch (error) {

            console.error(
                "Error adding sale:",
                error
            );

            showSalesMessage(
                "Unable to add sale."
            );
        }

    }
);


// ==========================================
// DELETE SALE
// ==========================================

async function deleteSale(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this sale?"
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

        const response = await fetch(
            "../../backend/sales/delete.php",
            {
                method: "POST",
                body: formData
            }
        );


        const result =
            await response.text();


        console.log(
            "Delete Sale:",
            result
        );


        // Show delete message for 3 seconds
        showSalesMessage(result);


        await loadSales();

        await loadProducts();


    } catch (error) {

        console.error(
            "Error deleting sale:",
            error
        );


        showSalesMessage(
            "Unable to delete sale."
        );
    }

}


// ==========================================
// SEARCH SALES
// ==========================================

salesSearch.addEventListener(
    "input",
    async function () {

        const searchValue =
            salesSearch.value
                .toLowerCase()
                .trim();


        try {

            const response =
                await fetch(
                    "../../backend/sales/get.php"
                );


            const data =
                await response.json();


            const sales = Array.isArray(data)
                ? data
                : data.sales;


            const filteredSales =
                sales.filter(sale => {

                    const customerName =
                        String(
                            sale.customer_name ?? ""
                        )
                        .toLowerCase();


                    const productName =
                        String(
                            sale.product_name ?? ""
                        )
                        .toLowerCase();


                    const saleId =
                        String(
                            sale.id ?? ""
                        )
                        .toLowerCase();


                    return (
                        customerName.includes(
                            searchValue
                        ) ||

                        productName.includes(
                            searchValue
                        ) ||

                        saleId.includes(
                            searchValue
                        )
                    );

                });


            displaySales(
                filteredSales
            );


        } catch (error) {

            console.error(
                "Sales search error:",
                error
            );
        }

    }
);


// ==========================================
// INITIAL LOAD
// ==========================================

loadCustomers();

loadProducts();

loadSales();w