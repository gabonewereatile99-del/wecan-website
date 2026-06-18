// Portfolio Slideshow - I learned how setInterval works for auto-rotation
let slideIndex = 0;

function changeSlide(n) {
    const slides = document.querySelectorAll('.slide');
    slideIndex += n;
    
    if (slideIndex >= slides.length) { slideIndex = 0; }
    if (slideIndex < 0) { slideIndex = slides.length - 1; }
    
    slides.forEach(slide => slide.classList.remove('active'));
    slides[slideIndex].classList.add('active');
}

// Auto-rotate every 5 seconds
setInterval(() => {
    changeSlide(1);
}, 5000);
// Shared interactions for navigation, animation, filtering, gallery, and forms.
(function () {
    const escapeMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => escapeMap[character]);
    const currencyFormatter = new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0
    });

    document.querySelectorAll("#current-year").forEach((node) => {
        node.textContent = String(new Date().getFullYear());
    });

    // Mobile navigation toggle.
    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".site-nav");

    if (menuToggle && siteNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = siteNav.classList.toggle("is-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        siteNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                siteNav.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Scroll reveal animation.
    const revealElements = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    }

    // Animated KPI counters.
    const counters = document.querySelectorAll("[data-counter]");
    if (counters.length) {
        const animateCounter = (counter) => {
            const target = Number(counter.dataset.counter || 0);
            const suffix = counter.dataset.suffix || "";
            const duration = 1200;
            const startTime = performance.now();

            const step = (timestamp) => {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.round(target * eased);
                counter.textContent = `${currentValue}${suffix}`;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };

            window.requestAnimationFrame(step);
        };

        if ("IntersectionObserver" in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.35
            });

            counters.forEach((counter) => counterObserver.observe(counter));
        } else {
            counters.forEach(animateCounter);
        }
    }

    // FAQ accordion behavior.
    document.querySelectorAll("[data-accordion]").forEach((accordion) => {
        accordion.querySelectorAll(".accordion-trigger").forEach((trigger) => {
            trigger.addEventListener("click", () => {
                const item = trigger.closest(".accordion-item");
                const isOpen = item.classList.toggle("is-open");
                trigger.setAttribute("aria-expanded", String(isOpen));
            });
        });
    });

    // Services page search and filters.
    const serviceSearch = document.querySelector("#service-search");
    const serviceCards = document.querySelectorAll(".service-card");
    const serviceFilterButtons = document.querySelectorAll("[data-service-filter]");
    const emptyState = document.querySelector("#service-empty-state");
    let activeServiceFilter = "all";

    const filterServices = () => {
        if (!serviceCards.length) {
            return;
        }

        const query = (serviceSearch?.value || "").trim().toLowerCase();
        let visibleCount = 0;

        serviceCards.forEach((card) => {
            const category = card.dataset.serviceCategory || "";
            const searchContent = card.dataset.serviceSearch || "";
            const matchesCategory = activeServiceFilter === "all" || category === activeServiceFilter;
            const matchesQuery = !query || searchContent.toLowerCase().includes(query);
            const shouldShow = matchesCategory && matchesQuery;
            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle("is-hidden", visibleCount > 0);
        }
    };

    serviceFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeServiceFilter = button.dataset.serviceFilter || "all";
            serviceFilterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;
                filterButton.classList.toggle("is-active", isActive);
                filterButton.setAttribute("aria-pressed", String(isActive));
            });
            filterServices();
        });
    });

    if (serviceSearch) {
        serviceSearch.addEventListener("input", filterServices);
        filterServices();
    }

    // Gallery filter and lightbox.
    const galleryButtons = document.querySelectorAll("[data-gallery-filter]");
    const galleryCards = document.querySelectorAll(".gallery-card");
    const lightbox = document.querySelector("#gallery-lightbox");
    const lightboxImage = document.querySelector("#lightbox-image");
    const lightboxTitle = document.querySelector("#lightbox-title");
    const lightboxDescription = document.querySelector("#lightbox-description");
    let activeGalleryFilter = "all";

    const filterGallery = () => {
        galleryCards.forEach((card) => {
            const category = card.dataset.galleryCategory || "";
            const shouldShow = activeGalleryFilter === "all" || category === activeGalleryFilter;
            card.hidden = !shouldShow;
        });
    };

    galleryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeGalleryFilter = button.dataset.galleryFilter || "all";
            galleryButtons.forEach((galleryButton) => {
                const isActive = galleryButton === button;
                galleryButton.classList.toggle("is-active", isActive);
                galleryButton.setAttribute("aria-pressed", String(isActive));
            });
            filterGallery();
        });
    });

    const closeLightbox = () => {
        if (!lightbox) {
            return;
        }
        lightbox.hidden = true;
        document.body.style.overflow = "";
    };

    if (lightbox && lightboxImage && lightboxTitle && lightboxDescription) {
        document.querySelectorAll(".gallery-open").forEach((button) => {
            button.addEventListener("click", () => {
                const card = button.closest(".gallery-card");
                if (!card) {
                    return;
                }

                lightboxImage.src = card.dataset.image || "";
                lightboxImage.alt = card.querySelector("img")?.alt || "";
                lightboxTitle.textContent = card.dataset.title || "";
                lightboxDescription.textContent = card.dataset.description || "";
                lightbox.hidden = false;
                document.body.style.overflow = "hidden";
            });
        });

        // Make gallery images clickable and enable enlargement instead of just the "View" button.
document.querySelectorAll('.gallery-card img').forEach((img) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
        const card = img.closest('.gallery-card');
        const openButton = card?.querySelector('.gallery-open');
        if (openButton) {
            openButton.click();
        }
    });
});

        lightbox.querySelectorAll("[data-lightbox-close]").forEach((node) => {
            node.addEventListener("click", closeLightbox);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !lightbox.hidden) {
                closeLightbox();
            }
        });

        filterGallery();
    }

    // Form helpers.
    const setMinDate = (selector) => {
        const input = document.querySelector(selector);
        if (input) {
            input.min = new Date().toISOString().split("T")[0];
        }
    };

    setMinDate("#event-date");

    const buildMailtoLink = (subject, body) => {
        const recipient = "wecaneventsandpromotions@gmail.com";
        return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const updateStatusPanel = (panel, content) => {
        if (panel) {
            panel.innerHTML = content;
        }
    };

    // Booking form logic.
    const bookingForm = document.querySelector("#booking-form");
    const bookingResponse = document.querySelector("#booking-response");

    if (bookingForm && bookingResponse) {
        bookingForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!bookingForm.reportValidity()) {
                return;
            }

            const formData = new FormData(bookingForm);
            const packageChoice = String(formData.get("package") || "");
            const guestCount = Number(formData.get("guests") || 0);
            const clientBudget = Number(formData.get("budget") || 0);
            const addons = formData.getAll("addons").map((value) => String(value));
            const eventDate = new Date(String(formData.get("eventDate") || ""));
            const today = new Date();
            const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            const basePrices = {
                Corporate: 8500,
                Private: 6200,
                Community: 7100
            };

            const addonPrices = {
                "Decor styling": 2200,
                "MC or host": 1800,
                "DJ or live performance": 2600,
                Photography: 2400
            };

            const basePrice = basePrices[packageChoice] || 6500;
            const guestAdjustment = Math.max(0, guestCount - 80) * 45;
            const addonTotal = addons.reduce((total, addon) => total + (addonPrices[addon] || 0), 0);
            const estimate = basePrice + guestAdjustment + addonTotal;
            const availability = daysUntilEvent >= 21
                ? "Strong availability based on the timeline provided."
                : daysUntilEvent >= 10
                    ? "Limited availability. Early confirmation is recommended."
                    : "Urgent timeline. Availability depends on supplier and venue confirmation.";
            const budgetNote = clientBudget >= estimate
                ? "Your current budget sits within the estimated starting range."
                : "Your current budget may need to increase or the event scope may need to be refined.";

            const clientName = escapeHtml(formData.get("fullName"));
            const eventType = escapeHtml(formData.get("eventType"));
            const location = escapeHtml(formData.get("location"));
            const brief = escapeHtml(formData.get("brief"));
            const summaryBody = [
                `Booking enquiry from ${formData.get("fullName")}`,
                ``,
                `Email: ${formData.get("email")}`,
                `Phone: ${formData.get("phone")}`,
                `Event type: ${formData.get("eventType")}`,
                `Package: ${formData.get("package")}`,
                `Event date: ${formData.get("eventDate")}`,
                `Guest count: ${formData.get("guests")}`,
                `Budget: ${currencyFormatter.format(clientBudget)}`,
                `Location: ${formData.get("location")}`,
                `Add-ons: ${addons.length ? addons.join(", ") : "None selected"}`,
                ``,
                `Brief:`,
                `${formData.get("brief")}`,
                ``,
                `Instant estimate: ${currencyFormatter.format(estimate)}`,
                `Availability note: ${availability}`,
                `Budget note: ${budgetNote}`
            ].join("\n");
            const mailtoLink = buildMailtoLink(`WECAN Booking Request: ${formData.get("eventType")}`, summaryBody);

            updateStatusPanel(bookingResponse, `
                <h3>Event brief reviewed</h3>
                <span class="response-highlight">${escapeHtml(packageChoice)} package</span>
                <div class="response-group">
                    <p><strong>${clientName}</strong>, your ${eventType.toLowerCase()} event in <strong>${location}</strong> has an estimated planning starting range of <strong>${currencyFormatter.format(estimate)}</strong>.</p>
                    <p><strong>Availability:</strong> ${escapeHtml(availability)}</p>
                    <p><strong>Budget note:</strong> ${escapeHtml(budgetNote)}</p>
                    <p><strong>Next step:</strong> send the prepared email draft so the WECAN team can confirm the scope and final quotation.</p>
                    <a class="button button-primary" href="${mailtoLink}">Send booking request by email</a>
                </div>
                <div class="response-group">
                    <p><strong>Brief summary:</strong> ${brief}</p>
                </div>
            `);
        });
    }

    // Contact form logic.
    const contactForm = document.querySelector("#contact-form");
    const contactResponse = document.querySelector("#contact-response");

    if (contactForm && contactResponse) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            const formData = new FormData(contactForm);
            const subject = `WECAN Contact: ${formData.get("messageType")}`;
            const body = [
                `General message from ${formData.get("fullName")}`,
                ``,
                `Email: ${formData.get("email")}`,
                `Phone: ${formData.get("phone")}`,
                `Message type: ${formData.get("messageType")}`,
                `Preferred contact method: ${formData.get("contactMethod")}`,
                ``,
                `Message:`,
                `${formData.get("message")}`
            ].join("\n");
            const mailtoLink = buildMailtoLink(subject, body);

            updateStatusPanel(contactResponse, `
                <h3>Email draft ready</h3>
                <span class="response-highlight">${escapeHtml(formData.get("messageType"))}</span>
                <div class="response-group">
                    <p><strong>Name:</strong> ${escapeHtml(formData.get("fullName"))}</p>
                    <p><strong>Preferred reply method:</strong> ${escapeHtml(formData.get("contactMethod"))}</p>
                    <p><strong>Recipient:</strong> wecaneventsandpromotions@gmail.com</p>
                    <a class="button button-primary" href="${mailtoLink}">Open email draft</a>
                </div>
                <div class="response-group">
                    <p>${escapeHtml(formData.get("message"))}</p>
                </div>
            `);
        });
    }

    // Talent form logic.
    const talentForm = document.querySelector("#talent-form");
    const talentResponse = document.querySelector("#talent-response");

    if (talentForm && talentResponse) {
        talentForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!talentForm.reportValidity()) {
                return;
            }

            const formData = new FormData(talentForm);
            const mediaFile = talentForm.querySelector('input[type="file"]')?.files?.[0];
            const reviewNote = mediaFile
                ? `Optional file attached in browser session: ${mediaFile.name}`
                : "No optional media file selected.";

            updateStatusPanel(talentResponse, `
                <h3>Talent profile received</h3>
                <span class="response-highlight">${escapeHtml(formData.get("category"))}</span>
                <div class="response-group">
                    <p><strong>${escapeHtml(formData.get("stageName"))}</strong> from ${escapeHtml(formData.get("city"))} has been prepared for review.</p>
                    <p><strong>Contact:</strong> ${escapeHtml(formData.get("email"))} | ${escapeHtml(formData.get("phone"))}</p>
                    <p><strong>Next step:</strong> WECAN can review the performance link and reach out when a matching booking or showcase opportunity opens.</p>
                </div>
                <div class="response-group">
                    <p><strong>Bio summary:</strong> ${escapeHtml(formData.get("bio"))}</p>
                    <p><strong>Performance link:</strong> <a href="${escapeHtml(formData.get("videoLink"))}" target="_blank" rel="noreferrer">View shared link</a></p>
                    <p>${escapeHtml(reviewNote)}</p>
                </div>
            `);
        });
    }
}());