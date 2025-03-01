document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const body = document.body;

    // Function to apply theme
    function applyTheme(theme) {
        if (theme === "light") {
            body.setAttribute("data-bs-theme", "light");
            themeIcon.textContent = "dark_mode"; // Moon icon
        } else {
            body.setAttribute("data-bs-theme", "dark");
            themeIcon.textContent = "light_mode"; // Sun icon
        }
    }

    // Check localStorage for theme
    const savedTheme = localStorage.getItem("theme") || "light"; // Default to light
    applyTheme(savedTheme);

    // Toggle theme on button click
    themeToggle.addEventListener("click", function () {
        const newTheme = body.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    });
});
