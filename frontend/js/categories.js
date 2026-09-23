// ==========================================
// Categories Management
// ==========================================

const categoryForm = document.getElementById("categoryForm");
const categoryTableBody = document.getElementById("categoryTableBody");
const categoryMessage = document.getElementById("categoryMessage");


// ==========================================
// Load Categories
// ==========================================

async function loadCategories() {

    try {

        const response = await fetch(
            "../../backend/categories/get.php"
        );

        const data = await response.json();

        console.log("Categories:", data);

        displayCategories(data);

    } catch (error) {

        console.error(
            "Error loading categories:",
            error
        );

        categoryTableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    Unable to load categories
                </td>
            </tr>
        `;
    }
}


// ==========================================
// Display Categories
// ==========================================

function displayCategories(categories) {

    categoryTableBody.innerHTML = "";

    if (!Array.isArray(categories) || categories.length === 0) {

        categoryTableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    No categories available
                </td>
            </tr>
        `;

        return;
    }

    categories.forEach(category => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${category.id}</td>

            <td>${category.category_name}</td>

            <td>${category.created_at ?? "-"}</td>

            <td>

                <button
                    class="btn-secondary"
                    onclick="deleteCategory(${category.id})"
                >
                    Delete
                </button>

            </td>
        `;

        categoryTableBody.appendChild(row);

    });

}


// ==========================================
// Add Category
// ==========================================

categoryForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const formData = new FormData(categoryForm);

        try {

            const response = await fetch(
                "../../backend/categories/add.php",
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await response.text();

            // Show message
            categoryMessage.textContent = result;

            // Hide message after 3 seconds
            setTimeout(() => {
                categoryMessage.textContent = "";
            }, 3000);

            if (result.includes("successfully")) {

                categoryForm.reset();

                loadCategories();

            }

        } catch (error) {

            console.error(
                "Error adding category:",
                error
            );

            categoryMessage.textContent =
                "Unable to add category.";

            // Hide error message after 3 seconds
            setTimeout(() => {
                categoryMessage.textContent = "";
            }, 3000);

        }

    }
);


// ==========================================
// Delete Category
// ==========================================

async function deleteCategory(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
        return;
    }

    const formData = new FormData();

    formData.append("id", id);

    try {

        const response = await fetch(
            "../../backend/categories/delete.php",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.text();

        // Show delete message
        categoryMessage.textContent = result;

        // Hide message after 3 seconds
        setTimeout(() => {
            categoryMessage.textContent = "";
        }, 3000);

        loadCategories();

    } catch (error) {

        console.error(
            "Error deleting category:",
            error
        );

        categoryMessage.textContent =
            "Unable to delete category.";

        // Hide error message after 3 seconds
        setTimeout(() => {
            categoryMessage.textContent = "";
        }, 3000);

    }

}


// ==========================================
// Load Categories when page opens
// ==========================================

loadCategories();