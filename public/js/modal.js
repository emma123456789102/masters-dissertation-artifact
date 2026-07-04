document.addEventListener("DOMContentLoaded", () => {

    const infoButton = document.getElementById("informationBtn");
    const modal = document.getElementById("informationModal");
    const closeButton = modal.querySelector(".close");

    // Open modal
    infoButton.addEventListener("click", () => {
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
    });

    // Close modal
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    });

    // Close when clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");
        }
    });

    // Close with Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");
        }
    });

});