# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Analytics (free)

This project uses **Google Analytics 4 (GA4)** to track button usage via the `sound_button_click` event.

1. Create a GA4 Web Data Stream and copy your Measurement ID (format: `G-XXXXXXXXXX`).
2. Create a `.env.local` file in the project root:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Start or deploy the app. Analytics is disabled automatically when the env var is missing.

For GitHub Actions deployments, add repository variable `VITE_GA_MEASUREMENT_ID` in **Settings > Secrets and variables > Actions > Variables**.

Tracked event parameters:
- `button_title`
- `button_category`
- `button_path`
- `is_loop`

In GA4, use **Reports > Engagement > Events** (or **Explore**) and inspect `sound_button_click` to see which buttons are used.

