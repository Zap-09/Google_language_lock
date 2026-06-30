# Google Language Lock

A Firefox extension that lets you control the language used by Google Search.

Google can automatically detect your language from cookies, location, and browser settings. This extension lets you lock Google's language settings and optionally override the `Accept-Language` request header.

In private mode, Google does not have access to the cookies from your normal browsing session, so it may fall back to different language settings. This extension fixes that by adding the `hl=xx` language parameter to Google searches.

You can also optionally override the `Accept-Language` request header.

## Features

By default it comes with:

- English
- French
- German

You can add your own language using a custom language code.

---

## Installation

- Get it from Mozilla Add-ons:
  https://addons.mozilla.org/en-US/firefox/addon/google-language-lock/

- Get it from Mozilla Add-ons (Android):
  https://addons.mozilla.org/en-US/android/addon/google-language-lock/

- Download the xpi from GitHub releases:
  https://github.com/Zap-09/Google_language_lock/releases

---

## Usage / Help

### Modify Search URL

When enabled, the extension adds Google's language parameter:

hl=language-code

Example:

https://www.google.com/search?q=wiki&hl=de

This controls Google's interface language.

Examples:

English:
en

French:
fr

German:
de

Japanese:
ja

---

### Override Accept-Language Header

When enabled, the extension changes the HTTP request header sent to Google.

Example:

Accept-Language: en-US,en;q=0.9

This affects how Google detects your preferred language.

Examples:

English (US):
en-US,en;q=0.9

English (UK):
en-GB,en;q=0.9

Japanese:
ja-JP,ja;q=0.9

French:
fr-FR,fr;q=0.9

---

## Finding Language Codes

You can find supported language codes here:

IANA Language Subtag Registry:
https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry

MDN Accept-Language documentation:
https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language

The short language code is used for the Google `hl` option.

The full language tag is used for the `Accept-Language` header.

Example:

Google language:
ja

Header:
ja-JP,ja;q=0.9

## Credits

Icons used in this extension:

Location icon:
https://www.flaticon.com/free-icon/local_3832936

Lock icon:
https://www.flaticon.com/free-icon/padlock_2889676

Icons provided by Flaticon creators.
