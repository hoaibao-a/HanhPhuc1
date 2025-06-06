document.addEventListener("DOMContentLoaded", () => {
    console.log("Hanh Phuc Wedding Site - DOM Loaded");

    // --- Element Selectors ---
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.querySelector(".lightbox-close");
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");

    // --- Data Fetching ---
    const dataFiles = {
        site: "./data/site.json",
        header: "./data/header.json",
        hero: "./data/hero.json",
        services: "./data/services.json",
        pricing: "./data/pricing.json",
        gallery: "./data/gallery.json",
        contact: "./data/contact.json",
        footer: "./data/footer.json"
    };

    async function fetchAllData() {
        console.log("Fetching all data...");
        try {
            const fetchPromises = Object.entries(dataFiles).map(([key, url]) =>
                fetch(url).then(async response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status} for ${url}`);
                    }
                    const contentType = response.headers.get("content-type");
                    if (!contentType || !contentType.includes("application/json")) {
                        console.warn(`Non-JSON content type for ${url}: ${contentType}. Attempting parse.`);
                    }
                    // Try to parse JSON, catch syntax errors
                    try {
                        const data = await response.json();
                        return { key, data };
                    } catch (parseError) {
                         console.error(`JSON Parse Error for ${url}:`, parseError);
                         throw new Error(`Invalid JSON format in ${url}`);
                    }
                })
            );

            const results = await Promise.all(fetchPromises);
            console.log("Data fetched successfully.");

            const allData = results.reduce((acc, { key, data }) => {
                acc[key] = data;
                return acc;
            }, {});

            console.log("Combined data:", allData);
            renderPage(allData);

        } catch (error) {
            console.error("Could not fetch or parse data:", error);
            displayErrorMessage(error);
        }
    }

    function displayErrorMessage(error) {
        document.body.innerHTML = `<div style="padding: 50px; text-align: center; color: #8B0000;">
               <h2>Lỗi Tải Dữ Liệu Trang Web</h2>
               <p>Không thể tải hoặc xử lý dữ liệu từ các file JSON trong thư mục <code>data/</code>.</p>
               <p>Chi tiết lỗi: ${error.message}</p>
               <p>Vui lòng kiểm tra lại các file JSON (site.json, header.json, ...) đảm bảo chúng tồn tại, có đúng định dạng JSON và không có lỗi cú pháp (ví dụ: thiếu dấu phẩy, dấu ngoặc kép...).</p>
               <p><strong>Lưu ý:</strong> Nếu chạy trên server cục bộ, hãy đảm bảo server trả về đúng kiểu MIME (application/json). Nếu vẫn lỗi, hãy thử deploy lên Vercel/Netlify.</p>
           </div>`;
   }

    // --- Page Rendering ---
    function renderPage(data) {
        console.log("Rendering page...");
        try {
            if (!data.site || !data.header || !data.hero || !data.services || !data.pricing || !data.gallery || !data.contact || !data.footer) {
                throw new Error("Dữ liệu cho một hoặc nhiều section bị thiếu.");
            }
            renderSiteMeta(data.site);
            renderHeader(data.header);
            renderHero(data.hero);
            renderServices(data.services);
            renderPricing(data.pricing);
            renderGallery(data.gallery);
            renderContact(data.contact);
            renderFooter(data.footer);
            setupEventListeners(data.gallery); // Pass gallery data for lightbox setup
            console.log("Page rendering complete.");
        } catch (renderError) {
            console.error("Error during page rendering:", renderError);
            displayErrorMessage(new Error(`Lỗi hiển thị nội dung: ${renderError.message}. Kiểm tra cấu trúc file JSON.`));
        }
    }

    // --- Individual Section Renderers ---
    function renderSiteMeta(siteData) {
        document.title = siteData.title || "Hạnh Phúc Wedding";
        document.querySelector("html").lang = siteData.lang || "vi";
        const descriptionTag = document.querySelector("meta[name=\"description\"]");
        if (descriptionTag) descriptionTag.content = siteData.description || "";
        const keywordsTag = document.querySelector("meta[name=\"keywords\"]");
        if (keywordsTag) keywordsTag.content = siteData.keywords || "";
        console.log("Site meta rendered.");
    }

    function renderHeader(headerData) {
        const logoPlaceholder = document.getElementById("logo-placeholder");
        const navPlaceholder = document.getElementById("nav-placeholder");

        if (logoPlaceholder && headerData.logo) {
            logoPlaceholder.innerHTML = `<a href="${headerData.logo.link || "#"}">
                ${headerData.logo.image_url ? 
                    `<img src="${headerData.logo.image_url}" alt="${headerData.logo.alt_text || "Logo"}">` : 
                    (headerData.logo.text || "Hạnh Phúc")
                }
            </a>`;
        }

        if (navPlaceholder && headerData.navigation) {
            const navList = headerData.navigation.map(item =>
                `<li><a href="${item.link}">${item.label}</a></li>`
            ).join("");
            navPlaceholder.innerHTML = `<nav><ul>${navList}</ul></nav>`;
        }
        console.log("Header rendered.");
    }

    function renderHero(heroData) {
        const heroSection = document.getElementById("hero");
        if (heroSection && heroData) {
            heroSection.style.backgroundImage = `url("${heroData.background_image || ""}")`;
            heroSection.innerHTML = `
                <div class="hero-overlay"></div>
                <div class="container hero-content">
                    <h1>${heroData.title || ""}</h1>
                    <p>${heroData.subtitle || ""}</p>
                    ${heroData.cta_button ? `<a href="${heroData.cta_button.link || "#"}" class="cta-button">${heroData.cta_button.text || ""}</a>` : ""}
                </div>
            `;
        }
        console.log("Hero rendered.");
    }

    function renderServices(servicesData) {
        const titlePlaceholder = document.getElementById("services-title-placeholder");
        const container = document.getElementById("services-container");
        if (titlePlaceholder) titlePlaceholder.textContent = servicesData.title || "Dịch Vụ";
        if (container && servicesData.items) {
            container.innerHTML = servicesData.items.map(item => `
                <div class="service-item">
                    <img src="${item.image_url || ""}" alt="${item.alt_text || ""}">
                    <div class="service-item-content">
                        <h3>${item.name || ""}</h3>
                        <p>${item.description || ""}</p>
                    </div>
                </div>
            `).join("");
        }
        console.log("Services rendered.");
    }

    function renderPricing(pricingData) {
        const titlePlaceholder = document.getElementById("pricing-title-placeholder");
        const container = document.getElementById("pricing-container");
        const notePlaceholder = document.getElementById("pricing-note-placeholder");

        if (titlePlaceholder) titlePlaceholder.textContent = pricingData.title || "Bảng Giá";
        if (notePlaceholder) notePlaceholder.textContent = pricingData.note || "";
        if (container && pricingData.packages) {
            container.innerHTML = pricingData.packages.map(pkg => `
                <div class="pricing-package">
                    <h3>${pkg.name || ""}</h3>
                    <p class="price">${pkg.price || ""}</p>
                    <ul>
                        ${(pkg.features || []).map(feature => `<li>${feature}</li>`).join("")}
                    </ul>
                    <a href="#contact" class="cta-button">Liên hệ tư vấn</a>
                </div>
            `).join("");
        }
        console.log("Pricing rendered.");
    }

    function renderGallery(galleryData) {
        const titlePlaceholder = document.getElementById("gallery-title-placeholder");
        const descriptionPlaceholder = document.getElementById("gallery-description-placeholder");
        const filterContainer = document.getElementById("gallery-filter-buttons");
        const galleryContainer = document.getElementById("gallery-container");

        if (titlePlaceholder) titlePlaceholder.textContent = galleryData.title || "Thư Viện Ảnh";
        if (descriptionPlaceholder) descriptionPlaceholder.textContent = galleryData.description || "";

        if (filterContainer && galleryData.filter_buttons) {
            filterContainer.innerHTML = galleryData.filter_buttons.map(btn =>
                `<button class="filter-btn ${btn.filter === "all" ? "active" : ""}" data-filter="${btn.filter}">${btn.label}</button>`
            ).join("");
        }

        if (galleryContainer && galleryData.images) {
            galleryContainer.innerHTML = galleryData.images.map((img, index) => `
                <div class="gallery-item" data-category="${img.category || "all"}" data-index="${index}">
                    <img src="${img.thumb_url || ""}" alt="${img.alt || ""}">
                    <div class="overlay">
                        <i class="fas fa-search-plus"></i>
                        <p>${img.caption || img.alt || "Xem ảnh"}</p>
                    </div>
                </div>
            `).join("");
        }
        console.log("Gallery rendered.");
    }

    function renderContact(contactData) {
        const titlePlaceholder = document.getElementById("contact-title-placeholder");
        const container = document.getElementById("contact-container");

        if (titlePlaceholder) titlePlaceholder.textContent = contactData.title || "Liên Hệ";
        if (container && contactData) {
            const info = contactData.contact_info || {};
            const mapSrc = contactData.google_map_iframe_src || "";

            container.innerHTML = `
                <div class="contact-form">
                    <form action="${contactData.form?.action_url || "#"}" method="post">
                        <div class="form-group">
                            <label for="name">Họ tên:</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Số điện thoại:</label>
                            <input type="tel" id="phone" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label for="notes">Nội dung yêu cầu:</label>
                            <textarea id="notes" name="notes" rows="4" required></textarea>
                        </div>
                        <button type="submit" class="cta-button">${contactData.form?.submit_button_text || "Gửi"}</button>
                    </form>
                </div>
                <div class="contact-info">
                    <h3>Thông tin liên lạc</h3>
                    ${info.phone ? `<p><i class="${info.phone.icon_class || ""}"></i> <a href="${info.phone.link || "#"}">${info.phone.text || ""}</a></p>` : ""}
                    ${info.zalo ? `<p><i class="${info.zalo.icon_class || ""}"></i> <a href="${info.zalo.link || "#"}" target="_blank">${info.zalo.text || ""}</a></p>` : ""}
                    ${info.facebook ? `<p><i class="${info.facebook.icon_class || ""}"></i> <a href="${info.facebook.link || "#"}" target="_blank">${info.facebook.text || ""}</a></p>` : ""}
                    ${info.address ? `<p><i class="${info.address.icon_class || ""}"></i> ${info.address.text || ""}</p>` : ""}
                    ${mapSrc ? `<div class="map-container"><iframe src="${mapSrc}" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>` : ""}
                </div>
            `;
        }
        console.log("Contact rendered.");
    }

    function renderFooter(footerData) {
        const container = document.getElementById("footer-container");
        if (container && footerData) {
            const logoHTML = footerData.logo ? `
                <div class="footer-logo">
                    <a href="${footerData.logo.link || "#"}">
                        ${footerData.logo.image_url ? 
                            `<img src="${footerData.logo.image_url}" alt="${footerData.logo.alt_text || "Logo"}">` : 
                            (footerData.logo.text || "Hạnh Phúc")
                        }
                    </a>
                </div>` : "";
            
            const navList = (footerData.navigation || []).map(item =>
                `<li><a href="${item.link}">${item.label}</a></li>`
            ).join("");
            const navHTML = footerData.navigation ? `<nav class="footer-nav"><ul>${navList}</ul></nav>` : "";

            container.innerHTML = `
                ${logoHTML}
                ${navHTML}
                <div class="footer-copyright">
                    <p>${footerData.copyright_text || ""}</p>
                </div>
            `;
        }
        console.log("Footer rendered.");
    }

    // --- Event Listeners Setup ---
    function setupEventListeners(galleryData) {
        // Mobile Menu Toggle
        if (mobileMenuToggle) {
            const nav = document.querySelector("#main-header nav ul");
            if (nav) {
                mobileMenuToggle.addEventListener("click", () => {
                    nav.classList.toggle("active");
                    const icon = mobileMenuToggle.querySelector("i");
                    icon.classList.toggle("fa-bars");
                    icon.classList.toggle("fa-times");
                });
                // Close menu on link click
                nav.querySelectorAll("a").forEach(link => {
                    link.addEventListener("click", () => {
                        if (nav.classList.contains("active")) {
                            nav.classList.remove("active");
                            mobileMenuToggle.querySelector("i").classList.remove("fa-times");
                            mobileMenuToggle.querySelector("i").classList.add("fa-bars");
                        }
                    });
                });
            }
        }

        // Gallery Filtering
        const filterButtons = document.querySelectorAll(".filter-btn");
        const galleryItems = document.querySelectorAll(".gallery-item");

        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                const filter = button.getAttribute("data-filter");

                galleryItems.forEach(item => {
                    if (filter === "all" || item.getAttribute("data-category") === filter) {
                        item.classList.remove("hide");
                    } else {
                        item.classList.add("hide");
                    }
                });
            });
        });

        // Lightbox
        if (lightbox && lightboxImg && lightboxCaption && lightboxClose && galleryData && galleryData.images) {
            galleryItems.forEach(item => {
                item.addEventListener("click", () => {
                    const index = parseInt(item.getAttribute("data-index"));
                    const imageData = galleryData.images[index];
                    if (imageData) {
                        lightboxImg.src = imageData.full_url || "";
                        lightboxCaption.textContent = imageData.caption || imageData.alt || "";
                        lightbox.style.display = "block";
                    }
                });
            });

            lightboxClose.addEventListener("click", () => {
                lightbox.style.display = "none";
            });

            // Close lightbox if clicking outside the image
            lightbox.addEventListener("click", (e) => {
                if (e.target === lightbox) { 
                    lightbox.style.display = "none";
                }
            });
        }
        console.log("Event listeners setup.");
    }

    // --- Initial Load ---
    fetchAllData();
});

