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

let currentSettings = defaultSettings;

// ---------- Load settings ----------

async function loadSettings() {
    try {
        const result = await browser.storage.local.get("settings");

        if (result.settings) {
            currentSettings = result.settings;
        } else {
            currentSettings = defaultSettings;

            await browser.storage.local.set({
                settings: defaultSettings,
            });
        }

        console.log("Loaded settings:", currentSettings);
    } catch (err) {
        console.error("Failed loading settings:", err);

        currentSettings = defaultSettings;
    }
}

loadSettings();

// ---------- Watch popup changes ----------

browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") {
        return;
    }

    if (changes.settings) {
        currentSettings = changes.settings.newValue;

        console.log("Settings updated:", currentSettings);
    }
});

// ---------- Modify Google URL ----------

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (!currentSettings.extensionEnabled) {
            return;
        }

        if (!currentSettings.modifySearch.enabled) {
            return;
        }

        try {
            const url = new URL(details.url);

            if (!url.hostname.includes("google.")) {
                return;
            }

            let language = currentSettings.modifySearch.language;

            if (language === "custom") {
                language = currentSettings.modifySearch.customLanguage;
            }

            if (!language) {
                return;
            }

            // avoid redirect loop

            if (url.searchParams.get("hl") === language) {
                return;
            }

            url.searchParams.set("hl", language);

            return {
                redirectUrl: url.toString(),
            };
        } catch (err) {
            console.error("URL modify error:", err);
        }
    },
    {
        urls: ["*://*.google.com/*", "*://*.google.*/ *"],
    },
    ["blocking"],
);

// ---------- Override Accept-Language ----------

browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        if (!currentSettings.extensionEnabled) {
            return;
        }

        if (!currentSettings.overrideHeader.enabled) {
            return;
        }

        let language = currentSettings.overrideHeader.language;

        if (language === "custom") {
            language = currentSettings.overrideHeader.customLanguage;
        }

        if (!language) {
            return;
        }

        for (const header of details.requestHeaders) {
            if (header.name.toLowerCase() === "accept-language") {
                header.value = language;
            }
        }

        return {
            requestHeaders: details.requestHeaders,
        };
    },
    {
        urls: ["*://*.google.com/*", "*://*.google.*/*"],
    },
    ["blocking", "requestHeaders"],
);
