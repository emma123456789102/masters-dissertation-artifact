document.addEventListener("DOMContentLoaded", () => {

    const infoButton = document.getElementById("informationBtn");
    const infoModal = document.getElementById("informationModal");
    const infoClose = infoModal.querySelector(".close");

    const ICDbutton = document.getElementById("ICDBtn") || document.getElementById("selectedDiseaseRefBtn");
    const ICDModal = document.getElementById("ICDModal");
    const ICDClose = ICDModal.querySelector(".close");

    // Open info modal
    infoButton.addEventListener("click", () => {
        infoModal.style.display = "flex";
        infoModal.setAttribute("aria-hidden", "false");
    });

    // Close info modal
    infoClose.addEventListener("click", () => {
        infoModal.style.display = "none";
        infoModal.setAttribute("aria-hidden", "true");
    });

    // Open ICD modal
    if (ICDbutton) {
      ICDbutton.addEventListener("click", () => {
          ICDModal.style.display = "flex";
          ICDModal.setAttribute("aria-hidden", "false");
      });
    }

    // Close ICD modal
    ICDClose.addEventListener("click", () => {
        ICDModal.style.display = "none";
        ICDModal.setAttribute("aria-hidden", "true");
    });

    // Close when clicking outside any modal
    window.addEventListener("click", (event) => {
        // if click target is one of the modal overlays, hide it
        if (event.target === infoModal) {
            infoModal.style.display = "none";
            infoModal.setAttribute("aria-hidden", "true");
        } else if (event.target === ICDModal) {
            ICDModal.style.display = "none";
            ICDModal.setAttribute("aria-hidden", "true");
        }
    });

    // Close with Escape key — hide any visible modal
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (infoModal && infoModal.style.display === 'flex') {
                infoModal.style.display = "none";
                infoModal.setAttribute("aria-hidden", "true");
            }
            if (ICDModal && ICDModal.style.display === 'flex') {
                ICDModal.style.display = "none";
                ICDModal.setAttribute("aria-hidden", "true");
            }
        }
    });

});