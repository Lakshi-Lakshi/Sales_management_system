const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const formData = new FormData();

    formData.append("username", username);
    formData.append("password", password);

    try {

        const response = await fetch(
            "../../backend/auth/login.php",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.text();

        console.log("Response status:", response.status);
        console.log("Server response:", result);

        message.textContent = result;

        if (result.trim() === "Login successful") {

            window.location.href =
                "../pages/dashboard.html";

        }

    } catch (error) {

        console.error("Login error:", error);

        message.textContent =
            "Unable to connect to server.";

    }

});