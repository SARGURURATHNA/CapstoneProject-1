document.addEventListener("DOMContentLoaded", function () {
    let currentPath = window.location.pathname;
    let links = document.querySelectorAll(".sidebar .nav .nav-link");

    links.forEach(link => {
        let linkPath = new URL(link.href, window.location.origin).pathname;

        if (currentPath === linkPath) {
            link.classList.add("active");
        }
        else{
            link.classList.remove("active");
        }
    });
});
