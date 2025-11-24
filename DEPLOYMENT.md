# How to Deploy Lakshmi Vinayaka Properties Website for Free

This guide will walk you through deploying your static website (HTML, CSS, JS) using **Netlify**. It is free, fast, and easy.

## Option 1: Drag and Drop (Easiest)

1.  **Prepare your files:**
    *   Make sure all your project files (`index.html`, `styles.css`, `script.js`, `admin_dashboard.html`, etc.) are in a single folder.
    *   Ensure your main file is named `index.html`.

2.  **Sign up for Netlify:**
    *   Go to [netlify.com](https://www.netlify.com/).
    *   Click "Sign up" and create an account (you can use GitHub, Google, or Email).

3.  **Deploy:**
    *   Once logged in, you will see your team dashboard.
    *   Look for the section that says **"Drag and drop your site output folder here"** (usually at the bottom of the "Sites" tab).
    *   Drag your project folder from your computer and drop it into that area.

4.  **Wait for Upload:**
    *   Netlify will upload your files and publish them instantly.
    *   You will get a random URL (e.g., `agitated-darwin-12345.netlify.app`).

5.  **Rename your site (Optional):**
    *   Click on "Site settings".
    *   Click "Change site name".
    *   Enter a name like `lakshmi-vinayaka-properties` (if available).
    *   Your new URL will be `https://lakshmi-vinayaka-properties.netlify.app`.

## Option 2: Using GitHub (Recommended for Updates)

If you want to easily update your site later, use GitHub.

1.  **Create a GitHub Account:** Go to [github.com](https://github.com/) and sign up.
2.  **Create a Repository:**
    *   Click the "+" icon in the top right and select "New repository".
    *   Name it `lakshmi-vinayaka-properties`.
    *   Click "Create repository".
3.  **Upload Files:**
    *   Click "uploading an existing file".
    *   Drag and drop all your project files.
    *   Click "Commit changes".
4.  **Connect to Netlify:**
    *   Go to your Netlify dashboard.
    *   Click "Add new site" > "Import from an existing project".
    *   Select "GitHub".
    *   Authorize Netlify to access your GitHub account.
    *   Select the `lakshmi-vinayaka-properties` repository.
    *   Click "Deploy Site".

## Important Note on Admin Data

Since this project uses `localStorage` to store property listings and sell requests:
*   **Data is stored in the browser:** The data (properties added, sell requests) is stored in the *visitor's* browser (specifically, the admin's browser for the dashboard).
*   **It is NOT a shared database:** If you add a property on your computer, other users will NOT see it unless you manually update the `defaultListings` array in `script.js` with the new data before deploying.
*   **For a real production app:** You would need a backend database (like Firebase, Supabase, or MongoDB) to store data centrally so all users see the same updates.

## Admin Access on Deployed Site

*   Navigate to `/admin_login.html` (e.g., `https://your-site-name.netlify.app/admin_login.html`).
*   Login with `admin` / `admin123`.
