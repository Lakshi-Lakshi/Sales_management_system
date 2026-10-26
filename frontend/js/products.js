
 // ==========================================
 // PRODUCTS MANAGEMENT
 // ==========================================

 // DOM ELEMENTS
 const productForm = document.getElementById("productForm");
 const productTableBody = document.getElementById("productTableBody");
 const productSearch = document.getElementById("productSearch");
 const productMessage = document.getElementById("productMessage");
 const categorySelect = document.getElementById("category");
 const productNameInput = document.getElementById("productName");
 const priceInput = document.getElementById("price");
 const quantityInput = document.getElementById("quantity");
 const formTitle = document.getElementById("productFormTitle");
 const submitButton = document.getElementById("productSubmitBtn");
 const cancelButton = document.getElementById("cancelEditBtn");

 // VARIABLES
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

     messageTimer = setTimeout(function () {
         productMessage.textContent = "";
     }, 3000);
 }

 // ==========================================
 // LOAD CATEGORIES
 // ==========================================

 async function loadCategories() {
     try {
         const response = await fetch(
             "../../backend/categories/get.php"
         );

         if (!response.ok) {
             throw new Error("Failed to load categories");
         }

         const categories = await response.json();

         categorySelect.innerHTML =
             '<option value="">Select Category</option>';

         if (Array.isArray(categories)) {
             categories.forEach(function (category) {
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
 // LOAD PRODUCTS
 // ==========================================

 async function loadProducts() {
     try {
         const response = await fetch(
             "../../backend/products/get.php"
         );

         if (!response.ok) {
             throw new Error("Failed to load products");
         }

         const data = await response.json();

         let products = [];

         if (Array.isArray(data)) {
             products = data;
         } else if (data && Array.isArray(data.products)) {
             products = data.products;
         }

         allProducts = products;
         filterProducts();
     } catch (error) {
         console.error("Product loading error:", error);

         productTableBody.innerHTML = "";

         const row = document.createElement("tr");
         const cell = document.createElement("td");

         cell.colSpan = 6;
         cell.textContent = "Unable to load products.";

         row.appendChild(cell);
         productTableBody.appendChild(row);
     }
 }

 // ==========================================
 // DISPLAY PRODUCTS
 // ==========================================

 function displayProducts(products) {
     productTableBody.innerHTML = "";

     if (!Array.isArray(products) || products.length === 0) {
         const row = document.createElement("tr");
         const cell = document.createElement("td");

         cell.colSpan = 6;
         cell.textContent = "No products available.";

         row.appendChild(cell);
         productTableBody.appendChild(row);
         return;
     }

     products.forEach(function (product) {
         const row = document.createElement("tr");

         const values = [
             product.id ?? "-",
             product.product_name ?? "-",
             product.category_name ?? product.category_id ?? "-",
             product.price ?? "0.00",
             product.quantity ?? "0"
         ];

         values.forEach(function (value) {
             const cell = document.createElement("td");
             cell.textContent = String(value);
             row.appendChild(cell);
         });

         const actionsCell = document.createElement("td");

         const editButton = document.createElement("button");
         editButton.type = "button";
         editButton.className = "btn-primary edit-product-btn";
         editButton.textContent = "Edit";

         editButton.addEventListener("click", function () {
             editProduct(product.id);
         });

         const deleteButton = document.createElement("button");
         deleteButton.type = "button";
         deleteButton.className = "btn-secondary delete-product-btn";
         deleteButton.textContent = "Delete";

         deleteButton.addEventListener("click", function () {
             deleteProduct(product.id);
         });

         actionsCell.appendChild(editButton);
         actionsCell.appendChild(deleteButton);
         row.appendChild(actionsCell);

         productTableBody.appendChild(row);
     });
 }

 // ==========================================
 // FILTER / SEARCH PRODUCTS
 // ==========================================

 function filterProducts() {
     const searchValue = productSearch.value
         .toLowerCase()
         .trim();

     const filteredProducts = allProducts.filter(function (product) {
         const productName = String(
             product.product_name || ""
         ).toLowerCase();

         const categoryName = String(
             product.category_name || product.category_id || ""
         ).toLowerCase();

         return (
             productName.includes(searchValue) ||
             categoryName.includes(searchValue)
         );
     });

     displayProducts(filteredProducts);
 }

 productSearch.addEventListener("input", filterProducts);

 // ==========================================
 // ADD / UPDATE PRODUCT
 // ==========================================

 productForm.addEventListener("submit", async function (event) {
     event.preventDefault();

     const productName = productNameInput.value.trim();
     const categoryId = categorySelect.value;
     const price = priceInput.value.trim();
     const quantity = quantityInput.value.trim();

     // VALIDATION

     if (productName === "") {
         showMessage("Please enter product name.");
         return;
     }

     if (categoryId === "") {
         showMessage("Please select a category.");
         return;
     }

     if (
         price === "" ||
         !Number.isFinite(Number(price)) ||
         Number(price) < 0
     ) {
         showMessage("Please enter a valid non-negative price.");
         return;
     }

     if (
         quantity === "" ||
         !Number.isInteger(Number(quantity)) ||
         Number(quantity) < 0
     ) {
         showMessage("Please enter a valid non-negative whole quantity.");
         return;
     }

     // DUPLICATE PRODUCT NAME CHECK

     const productNameLower = productName.toLowerCase();

     const duplicateProduct = allProducts.some(function (product) {
         const sameName = String(
             product.product_name || ""
         ).trim().toLowerCase() === productNameLower;

         const differentProduct =
             Number(product.id) !== Number(editingProductId);

         return sameName && differentProduct;
     });

     if (duplicateProduct) {
         showMessage("This product already exists.");
         return;
     }

     // FORM DATA

     const formData = new FormData();

     formData.append("product_name", productName);
     formData.append("category_id", categoryId);
     formData.append("price", price);
     formData.append("quantity", quantity);

     try {
         let url;

         if (editingProductId !== null) {
             // UPDATE

             formData.append("id", editingProductId);

             url = "../../backend/products/update.php";
         } else {
             // ADD

             url = "../../backend/products/add.php";
         }

         const response = await fetch(url, {
             method: "POST",
             body: formData
         });

         const result = await response.text();

         console.log("Product response:", result);

         if (!response.ok) {
             showMessage(result || "Unable to save product.");
             return;
         }

         if (!result.toLowerCase().includes("successfully")) {
             showMessage(result || "Unable to save product.");
             return;
         }

         if (editingProductId !== null) {
             showMessage("Product updated successfully.");
             resetEditMode();
         } else {
             showMessage("Product added successfully.");
             productForm.reset();
         }

         await loadProducts();
     } catch (error) {
         console.error("Save product error:", error);
         showMessage("Unable to save product.");
     }
 });

 // ==========================================
 // EDIT PRODUCT
 // ==========================================

 function editProduct(id) {
     const product = allProducts.find(function (item) {
         return Number(item.id) === Number(id);
     });

     if (!product) {
         showMessage("Product not found.");
         return;
     }

     editingProductId = Number(product.id);

     productNameInput.value = product.product_name || "";
     categorySelect.value = String(product.category_id || "");
     priceInput.value = product.price ?? "";
     quantityInput.value = product.quantity ?? "";

     formTitle.textContent = "Edit Product";
     submitButton.textContent = "Update Product";
     cancelButton.style.display = "inline-block";

     productForm.scrollIntoView({
         behavior: "smooth",
         block: "start"
     });
 }

 // ==========================================
 // CANCEL EDIT
 // ==========================================

 cancelButton.addEventListener("click", function () {
     resetEditMode();
     productMessage.textContent = "";
 });

 // ==========================================
 // RESET EDIT MODE
 // ==========================================

 function resetEditMode() {
     editingProductId = null;

     productForm.reset();

     formTitle.textContent = "Add Product";
     submitButton.textContent = "Add Product";
     cancelButton.style.display = "none";
 }

 // ==========================================
 // DELETE PRODUCT
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

         console.log("Delete response:", result);

         if (!response.ok) {
             showMessage(result || "Unable to delete product.");
             return;
         }

         if (!result.toLowerCase().includes("successfully")) {
             showMessage(result || "Unable to delete product.");
             return;
         }

         showMessage("Product deleted successfully.");

         if (Number(editingProductId) === Number(id)) {
             resetEditMode();
         }

         await loadProducts();
     } catch (error) {
         console.error("Delete error:", error);
         showMessage("Unable to delete product.");
     }
 }

 // ==========================================
 // PAGE LOAD
 // ==========================================

 loadCategories();
 loadProducts();
