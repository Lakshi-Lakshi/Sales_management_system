// ==========================================
// Products Management
// ==========================================


// ==========================================
// DOM ELEMENTS
// ==========================================

const productForm =
    document.getElementById("productForm");

const productTableBody =
    document.getElementById("productTableBody");

const productSearch =
    document.getElementById("productSearch");

const productMessage =
    document.getElementById("productMessage");

const categorySelect =
    document.getElementById("category");

const productNameInput =
    document.getElementById("productName");

const priceInput =
    document.getElementById("price");

const quantityInput =
    document.getElementById("quantity");

const formTitle =
    document.getElementById("productFormTitle");

const submitButton =
    document.getElementById("productSubmitBtn");

const cancelButton =
    document.getElementById("cancelEditBtn");


// ==========================================
// VARIABLES
// ==========================================

let editingProductId = null;

let allProducts = [];

let messageTimer = null;


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(message) {

    productMessage.textContent = message;


    if (messageTimer) {

        clearTimeout(messageTimer);

    }


    messageTimer = setTimeout(
        function () {

            productMessage.textContent = "";

        },
        3000
    );

}


// ==========================================
// LOAD CATEGORIES
// ==========================================

async function loadCategories() {

    try {

        const response =
            await fetch(
                "../../backend/categories/get.php"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load categories"
            );

        }


        const categories =
            await response.json();


        console.log(
            "Categories:",
            categories
        );


        categorySelect.innerHTML =
            `
            <option value="">
                Select Category
            </option>
            `;


        if (Array.isArray(categories)) {

            categories.forEach(
                function (category) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        category.id;


                    option.textContent =
                        category.category_name;


                    categorySelect.appendChild(
                        option
                    );

                }
            );

        }

    }

    catch (error) {

        console.error(
            "Category loading error:",
            error
        );


        categorySelect.innerHTML =
            `
            <option value="">
                Unable to load categories
            </option>
            `;

    }

}


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                "../../backend/products/get.php"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );

        }


        const data =
            await response.json();


        console.log(
            "Products:",
            data
        );


        let products = [];


        if (Array.isArray(data)) {

            products = data;

        }

        else if (
            data &&
            Array.isArray(data.products)
        ) {

            products =
                data.products;

        }


        allProducts =
            products;


        displayProducts(
            allProducts
        );

    }

    catch (error) {

        console.error(
            "Product loading error:",
            error
        );


        productTableBody.innerHTML = `

            <tr>

                <td colspan="6">

                    Unable to load products.

                </td>

            </tr>

        `;

    }

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(products) {

    productTableBody.innerHTML = "";


    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {

        productTableBody.innerHTML = `

            <tr>

                <td colspan="6">

                    No products available.

                </td>

            </tr>

        `;

        return;

    }


    products.forEach(
        function (product) {

            const row =
                document.createElement("tr");


            const categoryName =
                product.category_name ||
                product.category_id ||
                "-";


            row.innerHTML = `

                <td>
                    ${product.id || "-"}
                </td>


                <td>
                    ${product.product_name || "-"}
                </td>


                <td>
                    ${categoryName}
                </td>


                <td>
                    ${product.price || "0.00"}
                </td>


                <td>
                    ${product.quantity || "0"}
                </td>


                <td>

                    <button
                        type="button"
                        class="btn-primary edit-product-btn"
                        onclick="editProduct(${product.id})"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="btn-secondary delete-product-btn"
                        onclick="deleteProduct(${product.id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            productTableBody.appendChild(
                row
            );

        }
    );

}


// ==========================================
// ADD / UPDATE PRODUCT
// ==========================================

productForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const productName =
            productNameInput.value.trim();


        const categoryId =
            categorySelect.value;


        const price =
            priceInput.value;


        const quantity =
            quantityInput.value;


        // ==================================
        // VALIDATION
        // ==================================

        if (productName === "") {

            showMessage(
                "Please enter product name."
            );

            return;

        }


        if (categoryId === "") {

            showMessage(
                "Please select a category."
            );

            return;

        }


        if (
            price === "" ||
            Number(price) < 0
        ) {

            showMessage(
                "Price cannot be negative."
            );

            return;

        }


        if (
            quantity === "" ||
            Number(quantity) < 0
        ) {

            showMessage(
                "Quantity cannot be negative."
            );

            return;

        }


        // ==================================
        // FORM DATA
        // ==================================

        const formData =
            new FormData();


        formData.append(
            "product_name",
            productName
        );


        formData.append(
            "category_id",
            categoryId
        );


        formData.append(
            "price",
            price
        );


        formData.append(
            "quantity",
            quantity
        );


        try {


            // ==================================
            // UPDATE
            // ==================================

            if (
                editingProductId !== null
            ) {

                formData.append(
                    "id",
                    editingProductId
                );


                const response =
                    await fetch(
                        "../../backend/products/update.php",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const result =
                    await response.text();


                console.log(
                    "Update response:",
                    result
                );


                showMessage(
                    result
                );


                if (
                    response.ok &&
                    result
                        .toLowerCase()
                        .includes("successfully")
                ) {

                    resetEditMode();

                    await loadProducts();

                }

            }


            // ==================================
            // ADD
            // ==================================

            else {

                const response =
                    await fetch(
                        "../../backend/products/add.php",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const result =
                    await response.text();


                console.log(
                    "Add response:",
                    result
                );


                if (
                    response.ok &&
                    result
                        .toLowerCase()
                        .includes("successfully")
                ) {

                    showMessage(
                        "Product added successfully."
                    );


                    productForm.reset();


                    await loadProducts();

                }

                else {

                    showMessage(
                        result ||
                        "Unable to add product."
                    );

                }

            }

        }

        catch (error) {

            console.error(
                "Save product error:",
                error
            );


            showMessage(
                "Unable to save product."
            );

        }

    }
);


// ==========================================
// EDIT PRODUCT
// ==========================================

function editProduct(id) {

    console.log(
        "Edit clicked:",
        id
    );


    const product =
        allProducts.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!product) {

        showMessage(
            "Product not found."
        );

        return;

    }


    // ==================================
    // STORE ID
    // ==================================

    editingProductId =
        Number(product.id);


    // ==================================
    // FILL FORM
    // ==================================

    productNameInput.value =
        product.product_name || "";


    categorySelect.value =
        String(
            product.category_id || ""
        );


    priceInput.value =
        product.price || "";


    quantityInput.value =
        product.quantity || "";


    // ==================================
    // CHANGE FORM
    // ==================================

    formTitle.textContent =
        "Edit Product";


    submitButton.textContent =
        "Update Product";


    cancelButton.style.display =
        "inline-block";


    // ==================================
    // SCROLL TO FORM
    // ==================================

    productForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ==========================================
// CANCEL EDIT
// ==========================================

cancelButton.addEventListener(
    "click",
    function () {

        resetEditMode();

    }
);


// ==========================================
// RESET EDIT MODE
// ==========================================

function resetEditMode() {

    editingProductId = null;


    productForm.reset();


    formTitle.textContent =
        "Add Product";


    submitButton.textContent =
        "Add Product";


    cancelButton.style.display =
        "none";

}


// ==========================================
// DELETE PRODUCT
// ==========================================

async function deleteProduct(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
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
                "../../backend/products/delete.php",
                {
                    method: "POST",
                    body: formData
                }
            );


        const result =
            await response.text();


        console.log(
            "Delete response:",
            result
        );


        showMessage(
            result
        );


        await loadProducts();

    }

    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showMessage(
            "Unable to delete product."
        );

    }

}


// ==========================================
// SEARCH PRODUCTS
// ==========================================

productSearch.addEventListener(
    "input",
    function () {

        const searchValue =
            productSearch.value
                .toLowerCase()
                .trim();


        const filteredProducts =
            allProducts.filter(
                function (product) {

                    const productName =
                        String(
                            product.product_name || ""
                        )
                        .toLowerCase();


                    const categoryName =
                        String(
                            product.category_name ||
                            product.category_id ||
                            ""
                        )
                        .toLowerCase();


                    return (
                        productName.includes(
                            searchValue
                        ) ||

                        categoryName.includes(
                            searchValue
                        )
                    );

                }
            );


        displayProducts(
            filteredProducts
        );

    }
);


// ==========================================
// PAGE LOAD
// ==========================================

loadCategories();

loadProducts();
