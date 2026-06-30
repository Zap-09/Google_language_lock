const searchSelect = document.getElementById("search-language");
const headerSelect = document.getElementById("header-language");

const searchCustom = document.getElementById("search-custom-container");
const headerCustom = document.getElementById("header-custom-container");

const defaultSettings = {
    extensionEnabled: true,

    modifySearch: {
        enabled: true,
        language: "en",
        customLanguage: "",
    },

    overrideHeader: {
        enabled: false,
        language: "en-US,en;q=0.9",
        customLanguage: "",
    },
};

function showBanner(message, type = "success") {
    const banner = document.getElementById("banner");

    banner.textContent = message;
    banner.className = `banner ${type} show`;

    setTimeout(() => {
        banner.classList.remove("show");
    }, 2000);
}

function updateCustomFields() {
    searchCustom.style.display =
        searchSelect.value === "custom" ? "block" : "none";

    headerCustom.style.display =
        headerSelect.value === "custom" ? "block" : "none";
}

searchSelect.addEventListener("change", updateCustomFields);

headerSelect.addEventListener("change", updateCustomFields);

function getDefaultSettings() {
    return structuredClone(defaultSettings);
}

function collectSettings() {
    return {
        extensionEnabled: document.getElementById("enable").checked,

        modifySearch: {
            enabled: document.getElementById("modify-search").checked,

            language: document.getElementById("search-language").value,

            customLanguage: document.getElementById("search-language-custom")
                .value,
        },

        overrideHeader: {
            enabled: document.getElementById("override-header").checked,

            language: document.getElementById("header-language").value,

            customLanguage: document.getElementById("header-language-custom")
                .value,
        },
    };
}

function applySettings(settings) {
    document.getElementById("enable").checked = settings.extensionEnabled;

    document.getElementById("modify-search").checked =
        settings.modifySearch.enabled;

    document.getElementById("search-language").value =
        settings.modifySearch.language;

    document.getElementById("search-language-custom").value =
        settings.modifySearch.customLanguage;

    document.getElementById("override-header").checked =
        settings.overrideHeader.enabled;

    document.getElementById("header-language").value =
        settings.overrideHeader.language;

    document.getElementById("header-language-custom").value =
        settings.overrideHeader.customLanguage;

    updateCustomFields();
}

async function saveSettings() {
    const settings = collectSettings();

    try {
        await browser.storage.local.set({
            settings,
        });
        showBanner("Settings saved", "success");
    } catch (err) {
        showBanner(`Failed saving settings: ${err}`, "error");
    }
}

async function loadSettings() {
    try {
        const result = await browser.storage.local.get("settings");

        if (!result.settings) {
            const settings = getDefaultSettings();

            await browser.storage.local.set({
                settings,
            });

            applySettings(settings);

            return;
        }

        applySettings(result.settings);
    } catch (err) {
        console.error("Failed loading settings:", err);

        applySettings(getDefaultSettings());
    }
}

document.getElementById("save-btn").addEventListener("click", saveSettings);

document.getElementById("reset-btn").addEventListener("click", async () => {
    const settings = getDefaultSettings();

    applySettings(settings);

    await browser.storage.local.set({
        settings,
    });
    showBanner("Settings reset", "info");
});

loadSettings();

function setMzillaStoreLink() {
    browser.runtime.getPlatformInfo().then((info) => {
        let mozillaStoreLink = document.getElementById("mozillaStoreLink");

        let androidLink = mozillaStoreLink.dataset.android;
        let desktopLink = mozillaStoreLink.dataset.desktop;

        if (info.os === "android") {
            mozillaStoreLink.href = androidLink;
        } else {
            mozillaStoreLink.href = desktopLink;
        }
    });
}
setMzillaStoreLink();

function setupExternalLinks() {
    const links = document.querySelectorAll("a.external-link");

    links.forEach((link) => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();

            let url = link.href;
            browser.tabs.create({ url });
            window.close();
        });
    });
}

setupExternalLinks();
