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

        console.log("Settings saved:", settings);
    } catch (err) {
        console.error("Failed saving settings:", err);
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
});

loadSettings();
