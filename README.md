# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Integration with Softr user management: (06/30/2025 at 2:30pm CST)

### What's working
- The app can be embedded in Softr using a custom code block that passes user data (such as email or full name) from Softr's `window.logged_in_user` object to the Vite app via postMessage.
- The Vite app now waits for user data before initializing, ensuring the correct user context is loaded.
- Console logging and DOM display are in place for debugging user data flow between Softr and the embedded app.
- The correct user fields (e.g., `softr_user_full_name`, `softr_user_email`) are being sent from Softr and received by the Vite app.

### What needs to change
- The Vite app's postMessage listener should be updated to accept and validate the exact user field(s) being sent (e.g., `name` or `softr_user_full_name`).
- Ensure the production build (`dist/` folder) is what gets deployed to GitHub Pages, and that `index.html` references the built JS in `/assets/` (not `/src/main.jsx`).
- Confirm that the Softr embed only loads the iframe after user data is available, and that the correct field is always present in `window.logged_in_user`.
