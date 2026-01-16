document.addEventListener("DOMContentLoaded", function () {
    const userBtn = document.getElementById("user-button");
    const userDropdown = document.getElementById("user-dropdown");

    const menuBtn = document.getElementById("menu-button");
    const menuDropdown = document.getElementById("menu-dropdown");

    userBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle("hidden");
        menuDropdown.classList.add("hidden");
    });

    menuBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        menuDropdown.classList.toggle("hidden");
        userDropdown.classList.add("hidden");
    });

    document.addEventListener("click", function (e) {
        if (!userDropdown.contains(e.target) && !userBtn.contains(e.target)) {
            userDropdown.classList.add("hidden");
        }
        if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
            menuDropdown.classList.add("hidden");
        }
    });
});
