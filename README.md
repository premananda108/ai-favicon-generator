# AI Favicon Generator

[Built with Google AI Studio](https://aistudio.google.com/)

A modern web application that leverages the Google Gemini API to generate professional application icons from a text prompt and exports them as a ready-to-use favicon package.

![AI Favicon Generator Screenshot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f288zpm3xg3ebkwhv9ng.png)

## ✨ Features

-   **AI-Powered Icon Generation**: Describe your ideal icon with text and let AI create it.
-   **High-Quality Images**: Powered by Google's `imagen-3.0-generate-002` model for stunning results.
-   **Complete Favicon Package**: Generates a `.zip` file containing:
    -   `favicon-16x16.png`
    -   `favicon-32x32.png`
    -   `apple-touch-icon.png` (180x180)
    -   `android-chrome-192x192.png`
    -   `android-chrome-512x512.png`
-   **PWA Ready**: Includes a `site.webmanifest` file for Progressive Web App compatibility.
-   **Client-Side Processing**: All image resizing and ZIP packaging is done directly in your browser for speed and privacy.
-   **Easy Integration**: Provides the exact HTML snippet to add to your website's `<head>`.
-   **Sleek & Responsive UI**: Built with React and Tailwind CSS for a great experience on any device.

## 🚀 How It Works

1.  **Prompt**: The user enters a text description of the desired icon.
2.  **Generate**: The application sends a carefully crafted prompt to the **Google Gemini API**.
3.  **Receive**: The API returns a high-resolution, base64-encoded PNG image.
4.  **Process**: In the browser, the app uses the Canvas API to resize the master image into all required favicon dimensions.
5.  **Package**: Using JSZip, the app bundles the resized images, a `site.webmanifest`, and a `README.md` into a single `.zip` file.
6.  **Download**: The user can download the complete package and copy the HTML snippet to integrate it into their project.

## 🛠️ Getting Started (Local Development)

You can run this project on your local machine for testing and development.

### Prerequisites

-   A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
-   A **Google AI API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Configuration

This application is designed to run in an environment where the Google AI API key is provided as an environment variable `process.env.API_KEY`. The code in `services/geminiService.ts` directly uses this variable.

For local development without a Node.js-based build server, `process.env` will not be defined in the browser. To work around this for your local testing:

1.  Open the file `services/geminiService.ts`.
2.  Temporarily replace `process.env.API_KEY` with your actual API key string:

    ```typescript
    // services/geminiService.ts

    // For local development, replace process.env.API_KEY with your key.
    // WARNING: Do NOT commit this change to version control.
    const API_KEY = 'YOUR_API_KEY_HERE'; 
    // const API_KEY = process.env.API_KEY; // The original code
    ```

3.  **Remember to revert this change before committing your code!** Exposing API keys in client-side code is a security risk.

### Running the App

Since this project uses modern ES modules and an import map, there is **no build step required**.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-favicon-generator.git
    cd ai-favicon-generator
    ```

2.  **Set up your API Key** as described in the **Configuration** section above.

3.  **Serve the files:**
    You need a simple local web server to handle the module imports correctly. The easiest way is using the `serve` package or a VSCode extension.

    **Using `serve`:**
    ```bash
    # If you don't have serve installed: npm install -g serve
    serve .
    ```

    **Using VS Code Live Server:**
    -   Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
    -   Right-click on `index.html` in the file explorer and select "Open with Live Server".

4.  **Open the app** in your browser (e.g., at `http://localhost:3000`).

## 💻 Technology Stack

-   **Frontend Framework**: [React 19](https://react.dev/)
-   **AI Model**: [Google Gemini API (@google/genai)](https://ai.google.dev/docs)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Client-Side Packaging**: [JSZip](https://stuk.github.io/jszip/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Setup**: No-build-step development using ES Modules and Import Maps.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
