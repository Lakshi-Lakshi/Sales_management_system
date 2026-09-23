// ==========================================
// Suppliers Management
// ==========================================

const supplierForm =
    document.getElementById("supplierForm");

const supplierTableBody =
    document.getElementById("supplierTableBody");

const supplierSearch =
    document.getElementById("supplierSearch");

const supplierMessage =
    document.getElementById("supplierMessage");


// ==========================================
// LOAD SUPPLIERS
// ==========================================

async function loadSuppliers() {

    try {

        const response = await fetch(
            "../../backend/suppliers/get.php"
        );

        const data = await response.json();

        console.log("Suppliers:", data);

        displaySuppliers(data);

    } catch (error) {

        console.error(
            "Error loading suppliers:",
            error
        );

        supplierTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load suppliers
                </td>
            </tr>
        `;
    }
}


// ==========================================
// DISPLAY SUPPLIERS
// ==========================================

function displaySuppliers(suppliers) {

    supplierTableBody.innerHTML = "";

    if (
        !Array.isArray(suppliers) ||
        suppliers.length === 0
    ) {

        supplierTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No suppliers available
                </td>
            </tr>
        `;

        return;
    }


    suppliers.forEach(supplier => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${supplier.id}
            </td>

            <td>
                ${supplier.supplier_name}
            </td>

            <td>
                ${supplier.phone ?? "-"}
            </td>

            <td>
                ${supplier.email ?? "-"}
            </td>

            <td>
                ${supplier.address ?? "-"}
            </td>

            <td>

                <button
                    class="btn-secondary"
                    onclick="deleteSupplier(${supplier.id})"
                >
                    Delete
                </button>

            </td>
        `;

        supplierTableBody.appendChild(row);

    });
}


// ==========================================
// ADD SUPPLIER
// ==========================================

supplierForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const formData =
            new FormData(supplierForm);

        try {

            const response = await fetch(
                "../../backend/suppliers/add.php",
                {
                    method: "POST",
                    body: formData
                }
            );

            const result =
                await response.text();

            console.log("Add Supplier:", result);

            supplierMessage.textContent =
                result;


            // Reset form only when successfully added
            if (result.includes("successfully")) {

                supplierForm.reset();

                loadSuppliers();

            }


            // Message disappears after 3 seconds
            setTimeout(() => {

                supplierMessage.textContent = "";

            }, 3000);


        } catch (error) {

            console.error(
                "Error adding supplier:",
                error
            );

            supplierMessage.textContent =
                "Unable to add supplier.";


            // Error message disappears after 3 seconds
            setTimeout(() => {

                supplierMessage.textContent = "";

            }, 3000);

        }

    }
);


// ==========================================
// DELETE SUPPLIER
// ==========================================

async function deleteSupplier(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this supplier?"
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
            "../../backend/suppliers/delete.php",
            {
                method: "POST",
                body: formData
            }
        );


        const result =
            await response.text();

        console.log("Delete Supplier:", result);


        // Show message
        supplierMessage.textContent =
            result;


        // Reload supplier list
        loadSuppliers();


        // Message disappears after 3 seconds
        setTimeout(() => {

            supplierMessage.textContent = "";

        }, 3000);


    } catch (error) {

        console.error(
            "Error deleting supplier:",
            error
        );


        supplierMessage.textContent =
            "Unable to delete supplier.";


        // Error message disappears after 3 seconds
        setTimeout(() => {

            supplierMessage.textContent = "";

        }, 3000);

    }

}


// ==========================================
// SEARCH SUPPLIERS
// ==========================================

supplierSearch.addEventListener(
    "input",
    async function () {

        const searchValue =
            supplierSearch.value
                .toLowerCase()
                .trim();


        try {

            const response =
                await fetch(
                    "../../backend/suppliers/get.php"
                );


            const suppliers =
                await response.json();


            const filteredSuppliers =
                suppliers.filter(supplier => {


                    // Supplier Name
                    const name =
                        String(
                            supplier.supplier_name ?? ""
                        )
                        .toLowerCase();


                    // Phone
                    const phone =
                        String(
                            supplier.phone ?? ""
                        )
                        .toLowerCase();


                    // Email
                    const email =
                        String(
                            supplier.email ?? ""
                        )
                        .toLowerCase();


                    // Address
                    const address =
                        String(
                            supplier.address ?? ""
                        )
                        .toLowerCase();


                    return (

                        name.includes(searchValue) ||

                        phone.includes(searchValue) ||

                        email.includes(searchValue) ||

                        address.includes(searchValue)

                    );

                });


            displaySuppliers(
                filteredSuppliers
            );


        } catch (error) {

            console.error(
                "Supplier search error:",
                error
            );

        }

    }
);


// ==========================================
// INITIAL LOAD
// ==========================================

loadSuppliers();