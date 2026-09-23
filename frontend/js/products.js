// ==========================================
// Products Management
// ==========================================

const productForm = document.getElementById("productForm");
const productTableBody = document.getElementById("productTableBody");
const productSearch = document.getElementById("productSearch");
const productMessage = document.getElementById("productMessage");
const categorySelect = document.getElementById("category");


// ==========================================
// Load Categories
// ==========================================

async function loadCategories() {

    try {

        const response = await fetch(
            "../../backend/categories/get.php"
        );

        const categories = await response.json();

        console.log("Categories:", categories);

        categorySelect.innerHTML =
            '<option value="">Select Category</option>';

        if (Array.isArray(categories)) {

            categories.forEach(category => {

                const option = document.createElement("option");

                option.value = category.id;
                option.textContent = category.category_name;

                categorySelect.appendChild(option);

            });

        }

    } catch (error) {

        console.error("Category loading error:", error);

        categorySelect.innerHTML =
            '<option value="">Unable to load categories</option>';

    }
}


// ==========================================
// Load Products
// ==========================================

async function loadProducts() {

    try {

        const response = await fetch(
            "../../backend/products/get.php"
        );

        const data = await response.json();

        console.log("Products:", data);

        const products = Array.isArray(data)
            ? data
            : data.products;

        displayProducts(products);

    } catch (error) {

        console.error("Error loading products:", error);

        productTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load products
                </td>
            </tr>
        `;

    }
}


// ==========================================
// Display Products
// ==========================================

function displayProducts(products) {

    productTableBody.innerHTML = "";

    if (!Array.isArray(products) || products.length === 0) {

        productTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No products available
                </td>
            </tr>
        `;

        return;
    }

    products.forEach(product => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.id}</td>

            <td>${product.product_name}</td>

            <td>${product.category_id ?? "-"}</td>

            <td>${product.price}</td>

            <td>${product.quantity}</td>

            <td>

                <button
                    class="btn-secondary"
                    onclick="deleteProduct(${product.id})"
                >
                    Delete
                </button>

            </td>
        `;

        productTableBody.appendChild(row);

    });

}


// ==========================================
// Add Product
// ==========================================

productForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const formData = new FormData(productForm);

        try {

            const response = await fetch(
                "../../backend/products/add.php",
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await response.text();

            // Show message
            productMessage.textContent = result;

            // Hide message after 3 seconds
            setTimeout(() => {

                productMessage.textContent = "";

            }, 3000);


            if (result.includes("successfully")) {

                productForm.reset();

                loadProducts();

            }

        } catch (error) {

            console.error(
                "Error adding product:",
                error
            );

            productMessage.textContent =
                "Unable to add product.";

            // Hide error after 3 seconds
            setTimeout(() => {

                productMessage.textContent = "";

            }, 3000);

        }

    }
);


// ==========================================
// Delete Product
// ==========================================

async function deleteProduct(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {

        return;

    }


    const formData = new FormData();

    formData.append("id", id);


    try {

        const response = await fetch(
            "../../backend/products/delete.php",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.text();


        // Show delete message
        productMessage.textContent = result;


        // Hide message after 3 seconds
        setTimeout(() => {

            productMessage.textContent = "";

        }, 3000);


        // Reload product list
        loadProducts();


    } catch (error) {

        console.error(
            "Error deleting product:",
            error
        );


        productMessage.textContent =
            "Unable to delete product.";


        // Hide error after 3 seconds
        setTimeout(() => {

            productMessage.textContent = "";

        }, 3000);

    }

}


// ==========================================
// Search Products
// ==========================================

productSearch.addEventListener(
    "input",
    async function () {

        const searchValue =
            productSearch.value
                .toLowerCase()
                .trim();


        try {

            const response = await fetch(
                "../../backend/products/get.php"
            );

            const data = await response.json();


            const products = Array.isArray(data)
                ? data
                : data.products;


            const filteredProducts =
                products.filter(product => {

                    const productName =
                        String(product.product_name)
                            .toLowerCase();

                    return productName.includes(
                        searchValue
                    );

                });


            displayProducts(filteredProducts);


        } catch (error) {

            console.error(
                "Product search error:",
                error
            );

        }

    }
);


// ==========================================
// Page Load
// ==========================================

loadCategories();
loadProducts();