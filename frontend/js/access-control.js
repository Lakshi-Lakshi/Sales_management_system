// ==========================================
// ROLE BASED ACCESS CONTROL
// ==========================================

async function checkUserAccess() {

    try {

        const response =
            await fetch(
                "../../backend/auth/session.php"
            );

        const user =
            await response.json();


        // ==================================
        // NOT LOGGED IN
        // ==================================

        if (!user.logged_in) {

            window.location.href =
                "login.html";

            return;
        }


        const role =
            user.role;


        console.log(
            "Logged User:",
            user.username
        );

        console.log(
            "User Role:",
            role
        );


        // ==================================
        // SALES STAFF
        // ==================================

        if (role === "sales_staff") {

            hideMenu("suppliers.html");

            hideMenu("purchases.html");

            hideMenu("reports.html");

            return;
        }


        // ==================================
        // STORE MANAGER
        // ==================================

        if (role === "store_manager") {

            return;
        }


        // ==================================
        // ADMIN
        // ==================================

        if (role === "admin") {

            return;
        }


        // ==================================
        // UNKNOWN ROLE
        // ==================================

        console.error(
            "Unknown user role:",
            role
        );

        window.location.href =
            "login.html";

    }

    catch (error) {

        console.error(
            "Access control error:",
            error
        );

    }

}


// ==========================================
// HIDE SIDEBAR MENU
// ==========================================

function hideMenu(pageName) {

    const links =
        document.querySelectorAll(
            ".sidebar nav a"
        );


    links.forEach(
        function (link) {

            const href =
                link.getAttribute("href");


            if (
                href &&
                href.includes(pageName)
            ) {

                link.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// START
// ==========================================

checkUserAccess();
