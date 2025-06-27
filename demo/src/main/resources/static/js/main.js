console.log("Main JS loaded.");

document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu-button");
    const menuDropdown = document.getElementById("menu-dropdown");

    menuButton.addEventListener("click", () => {
      menuDropdown.classList.toggle("hidden");
    });
  });
