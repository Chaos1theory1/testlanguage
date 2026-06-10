# Multilingual setup notes

This project now supports three interface languages:

- French (`fr`) as the default language
- Arabic (`ar`) with right-to-left layout direction
- English (`en`)

## Files added

- `src/i18n/translations.ts` contains all translation strings.
- `src/i18n/LanguageContext.tsx` stores the selected language, persists it in `localStorage`, and updates `<html lang>` and `<html dir>`.
- `src/components/LanguageSwitcher.tsx` adds the language dropdown used in the navbar.

## Files modified

- `src/main.tsx` wraps the app with `LanguageProvider`.
- `src/components/Navbar.tsx` adds translated navigation labels and the language switcher.
- `src/components/Footer.tsx` translates footer text.
- `src/App.tsx` translates the main public pages, contact form, product categories/status, and several default product/service labels.
- `src/index.css` adds small RTL helpers.

## How to add or change text

Edit `src/i18n/translations.ts` and update the same key under `fr`, `ar`, and `en`.

Example:

```ts
"nav.home": "Accueil"
```

Arabic mode automatically sets:

```html
<html lang="ar" dir="rtl">
```

French and English automatically set:

```html
<html dir="ltr">
```
