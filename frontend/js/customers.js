// ==========================================
// Customers Management
// ==========================================

const customerForm = document.getElementById("customerForm");
const customerTableBody = document.getElementById("customerTableBody");
const customerSearch = document.getElementById("customerSearch");
const customerMessage = document.getElementById("customerMessage");


// ==========================================
// Load Customers
// ==========================================

async function loadCustomers() {

    try {

        const response = await fetch(
            "../../backend/customers/get.php"
        );

        const data = await response.json();

        console.log("Customers:", data);

        displayCustomers(data);

    } catch (error) {

        console.error(
            "Error loading customers:",
            error
        );

        customerTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load customers
                </td>
            </tr>
        `;
    }
}


// ==========================================
// Display Customers
// ==========================================

function displayCustomers(customers) {

    customerTableBody.innerHTML = "";

    if (!Array.isArray(customers) || customers.length === 0) {

        customerTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No customers available
                </td>
            </tr>
        `;

        return;
    }


    customers.forEach(customer => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${customer.id}</td>

            <td>${customer.customer_name}</td>

            <td>${customer.phone ?? "-"}</td>

            <td>${customer.email ?? "-"}</td>

            <td>${customer.address ?? "-"}</td>

            <td>

                <button
                    class="btn-secondary"
                    onclick="deleteCustomer(${customer.id})"
                >
                    Delete
                </button>

            </td>
        `;

        customerTableBody.appendChild(row);

    });
}


// ==========================================
// Add Customer
// ==========================================

customerForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const formData = new FormData(customerForm);

        try {

            const response = await fetch(
                "../../backend/customers/add.php",
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await response.text();


            // Show message
            customerMessage.textContent = result;


            // Hide message after 3 seconds
            setTimeout(() => {

                customerMessage.textContent = "";

            }, 3000);


            // Only reset and reload if successful
            if (result.includes("successfully")) {

                customerForm.reset();

                loadCustomers();

            }

        } catch (error) {

            console.error(
                "Error adding customer:",
                error
            );


            customerMessage.textContent =
                "Unable to add customer.";


            // Hide error after 3 seconds
            setTimeout(() => {

                customerMessage.textContent = "";

            }, 3000);

        }

    }
);


// ==========================================
// Delete Customer
// ==========================================

async function deleteCustomer(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this customer?"
        );


    if (!confirmDelete) {

        return;

    }


    const formData = new FormData();

    formData.append("id", id);


    try {

        const response = await fetch(
            "../../backend/customers/delete.php",
            {
                method: "POST",
                body: formData
            }
        );


        const result = await response.text();


        // Show delete message
        customerMessage.textContent = result;


        // Hide message after 3 seconds
        setTimeout(() => {

            customerMessage.textContent = "";

        }, 3000);


        // Reload customer list
        loadCustomers();


    } catch (error) {

        console.error(
            "Error deleting customer:",
            error
        );


        customerMessage.textContent =
            "Unable to delete customer.";


        // Hide error after 3 seconds
        setTimeout(() => {

            customerMessage.textContent = "";

        }, 3000);

    }

}


// ==========================================
// Search Customers
// ==========================================

customerSearch.addEventListener("input", async function() {

    const searchValue =
        customerSearch.value.toLowerCase().trim();

    try {

        const response =
            await fetch("../../backend/customers/get.php");

        const customers =
            await response.json();

        const filteredCustomers =
            customers.filter(customer => {

                const customerName =
                    String(customer.customer_name ?? "")
                        .toLowerCase();

                const phone =
                    String(customer.phone ?? "")
                        .toLowerCase();

                const email =
                    String(customer.email ?? "")
                        .toLowerCase();

                const address =
                    String(customer.address ?? "")
                        .toLowerCase();

                return (
                    customerName.includes(searchValue) ||
                    phone.includes(searchValue) ||
                    email.includes(searchValue) ||
                    address.includes(searchValue)
                );
            });

        displayCustomers(filteredCustomers);

    } catch (error) {

        console.error("Customer search error:", error);

    }

});

// ==========================================
// Load Customers when page opens
// ==========================================

loadCustomers();