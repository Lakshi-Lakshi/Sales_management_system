
 // ==========================================
// Categories Management
// ==========================================

const categoryForm = document.getElementById("categoryForm");
const categoryTableBody = document.getElementById("categoryTableBody");
const categoryMessage = document.getElementById("categoryMessage");

// Backend URLs
const getCategoryURL = "../../backend/categories/get.php";
const addCategoryURL = "../../backend/categories/add.php";
const deleteCategoryURL = "../../backend/categories/delete.php";

// ==========================================
// Show Message
// ==========================================

function showCategoryMessage(message, isSuccess = false) {
    categoryMessage.textContent = message;
    categoryMessage.style.color = isSuccess ? "green" : "red";

    setTimeout(() => {
        categoryMessage.textContent = "";
    }, 4000);
}

// ==========================================
// Load Categories
// ==========================================

async function loadCategories() {
    try {
        const response = await fetch(getCategoryURL);

        if (!response.ok) {
            throw new Error("Unable to fetch categories.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(data.error || "Invalid category data.");
        }

        displayCategories(data);

    } catch (error) {
        console.error("Error loading categories:", error);

        categoryTableBody.innerHTML = `
            <tr>
                <td colspan="4">Unable to load categories.</td>
            </tr>
        `;
    }
}

// ==========================================
// Display Categories
// ==========================================

function displayCategories(categories) {
    categoryTableBody.innerHTML = "";

    if (categories.length === 0) {
        categoryTableBody.innerHTML = `
            <tr>
                <td colspan="4">No categories available</td>
            </tr>
        `;
        return;
    }

    categories.forEach(category => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = category.id;

        const nameCell = document.createElement("td");
        nameCell.textContent = category.category_name;

        const dateCell = document.createElement("td");
        dateCell.textContent = category.created_at || "-";

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "btn-secondary";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteCategory(category.id);
        });

        actionCell.appendChild(deleteButton);

        row.append(idCell, nameCell, dateCell, actionCell);
        categoryTableBody.appendChild(row);
    });
}

// ==========================================
// Add Category
// ==========================================

categoryForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const categoryInput = document.getElementById("categoryName");
    const categoryName = categoryInput.value.trim();

    if (categoryName === "") {
        showCategoryMessage("Please enter a category name.");
        categoryInput.focus();
        return;
    }

    const formData = new FormData();
    formData.append("category_name", categoryName);

    const submitButton = categoryForm.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;
    submitButton.textContent = "Adding...";

    try {
        const response = await fetch(addCategoryURL, {
            method: "POST",
            body: formData
        });

        const result = (await response.text()).trim();

        console.log("Add category response:", response.status, result);

        if (!response.ok) {
            throw new Error(result || "Server error while adding category.");
        }

        if (result.toLowerCase().includes("category added successfully")) {
            showCategoryMessage(result, true);
            categoryForm.reset();
            await loadCategories();
        } else {
            showCategoryMessage(result || "Category could not be added.");
        }

    } catch (error) {
        console.error("Error adding category:", error);
        showCategoryMessage(error.message || "Unable to add category.");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Add Category";
    }
});

// ==========================================
// Delete Category
// ==========================================

async function deleteCategory(id) {
    if (!confirm("Are you sure you want to delete this category?")) {
        return;
    }

    const formData = new FormData();
    formData.append("id", id);

    try {
        const response = await fetch(deleteCategoryURL, {
            method: "POST",
            body: formData
        });

        const result = (await response.text()).trim();

        console.log("Delete category response:", response.status, result);

        if (!response.ok) {
            throw new Error(result || "Failed to delete category.");
        }

        if (result.toLowerCase().includes("category deleted successfully")) {
            showCategoryMessage(result, true);
            await loadCategories();
        } else {
            showCategoryMessage(result || "Category could not be deleted.");
        }

    } catch (error) {
        console.error("Error deleting category:", error);
        showCategoryMessage(error.message || "Unable to delete category.");
    }
}

// ==========================================
// Load Categories on Page Open
// ==========================================

if (categoryForm && categoryTableBody && categoryMessage) {
    loadCategories();
} else {
    console.error(
        "Category page elements not found. Check categories.html IDs."
    );
}
