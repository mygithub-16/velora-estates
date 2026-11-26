const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navigationLinks = document.querySelectorAll(".site-nav a");
const currentYear = document.querySelector("[data-current-year]");
const listingFilters = document.querySelector("[data-listing-filters]");
const propertyModal = document.querySelector("[data-property-modal]");
const enquiryForm = document.querySelector("[data-enquiry-form]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const closeNavigation = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
};

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  navigation.classList.toggle("is-open", !isExpanded);
});

navigationLinks.forEach((link) => link.addEventListener("click", closeNavigation));
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

currentYear.textContent = new Date().getFullYear();

if (listingFilters) {
  const propertyTypeSelect = listingFilters.querySelector("#property-type");
  const locationSelect = listingFilters.querySelector("#property-location");
  const clearFiltersButton = listingFilters.querySelector("[data-clear-filters]");
  const propertyGrid = document.querySelector("[data-property-grid]");
  const propertyCards = propertyGrid.querySelectorAll("[data-property-type]");
  const emptyState = document.querySelector("[data-empty-state]");

  const filterListings = () => {
    const selectedType = propertyTypeSelect.value;
    const selectedLocation = locationSelect.value;
    let visibleListings = 0;

    propertyCards.forEach((card) => {
      const matchesType = !selectedType || card.dataset.propertyType === selectedType;
      const matchesLocation = !selectedLocation || card.dataset.propertyLocation === selectedLocation;
      const matchesFilters = matchesType && matchesLocation;

      card.hidden = !matchesFilters;
      visibleListings += matchesFilters ? 1 : 0;
    });

    emptyState.hidden = visibleListings > 0;
    clearFiltersButton.disabled = !selectedType && !selectedLocation;
  };

  listingFilters.addEventListener("change", filterListings);
  clearFiltersButton.addEventListener("click", () => {
    propertyTypeSelect.value = "";
    locationSelect.value = "";
    filterListings();
    propertyTypeSelect.focus();
  });

  filterListings();
}

if (propertyModal) {
  const viewPropertyButtons = document.querySelectorAll("[data-view-property]");
  const modalCloseButton = propertyModal.querySelector("[data-modal-close]");
  const modalImage = propertyModal.querySelector("[data-modal-image]");
  const modalType = propertyModal.querySelector("[data-modal-type]");
  const modalName = propertyModal.querySelector("[data-modal-name]");
  const modalLocation = propertyModal.querySelector("[data-modal-location]");
  const modalPrice = propertyModal.querySelector("[data-modal-price]");
  const modalBedrooms = propertyModal.querySelector("[data-modal-bedrooms]");
  const modalBathrooms = propertyModal.querySelector("[data-modal-bathrooms]");
  const modalArea = propertyModal.querySelector("[data-modal-area]");
  let lastFocusedTrigger;

  const openPropertyModal = (trigger) => {
    const propertyCard = trigger.closest(".property-card");
    const detailValues = propertyCard.querySelectorAll(".listing-details dd");
    const propertyImage = propertyCard.querySelector("img");

    modalImage.src = propertyImage.currentSrc || propertyImage.src;
    modalImage.alt = propertyImage.alt;
    modalType.textContent = propertyCard.querySelector(".card-content .eyebrow").textContent;
    modalName.textContent = propertyCard.querySelector("h3").textContent;
    modalLocation.textContent = propertyCard.querySelector(".listing-location").textContent;
    modalPrice.textContent = propertyCard.querySelector(".listing-price").textContent;
    [modalBedrooms.textContent, modalBathrooms.textContent, modalArea.textContent] = [...detailValues].map((detail) => detail.textContent);

    lastFocusedTrigger = trigger;
    propertyModal.showModal();
    modalCloseButton.focus();
  };

  viewPropertyButtons.forEach((button) => {
    button.addEventListener("click", () => openPropertyModal(button));
  });

  modalCloseButton.addEventListener("click", () => propertyModal.close());
  propertyModal.addEventListener("cancel", (event) => {
    event.preventDefault();
    propertyModal.close();
  });
  propertyModal.addEventListener("click", (event) => {
    if (event.target === propertyModal) propertyModal.close();
  });
  propertyModal.addEventListener("close", () => {
    lastFocusedTrigger?.focus();
  });
}

if (enquiryForm) {
  const enquirySuccess = document.querySelector("[data-enquiry-success]");
  const resetEnquiryButton = document.querySelector("[data-enquiry-reset]");
  const requiredFields = [
    enquiryForm.querySelector("#enquiry-name"),
    enquiryForm.querySelector("#enquiry-email"),
    enquiryForm.querySelector("#enquiry-message"),
  ];

  const showFieldError = (field, message = "") => {
    const errorMessage = enquiryForm.querySelector(`[data-error-for="${field.id}"]`);
    const hasError = Boolean(message);

    field.classList.toggle("is-invalid", hasError);
    field.setAttribute("aria-invalid", String(hasError));
    errorMessage.textContent = message;
    errorMessage.hidden = !hasError;
    return !hasError;
  };

  const validateField = (field) => {
    if (!field.value.trim()) return showFieldError(field, `Enter your ${field.labels[0].textContent.replace(" *", "").toLowerCase()}.`);
    if (field.type === "email" && !field.validity.valid) return showFieldError(field, "Enter a valid email address.");
    return showFieldError(field);
  };

  requiredFields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = requiredFields.every((field) => validateField(field));

    if (!isValid) {
      requiredFields.find((field) => field.getAttribute("aria-invalid") === "true")?.focus();
      return;
    }

    enquiryForm.reset();
    enquiryForm.hidden = true;
    enquirySuccess.hidden = false;
    enquirySuccess.focus();
  });

  resetEnquiryButton.addEventListener("click", () => {
    enquirySuccess.hidden = true;
    enquiryForm.hidden = false;
    enquiryForm.querySelector("#enquiry-name").focus();
  });
}
