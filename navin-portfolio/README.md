# Navin Kumar S — Personal Portfolio Website

A modern, high-contrast, minimalist personal portfolio website for **Navin Kumar S** (B.E. Electronics & Communication Engineering Student).

Built strictly adhering to a monochrome (Black, White, and Grayscale) design language with strong typography, subtle micro-interactions, responsive grids, and smooth scroll animations.

---

## 🚀 Features

- **Strict Monochrome Design**: Styled with crisp contrast using dark slate, black, pure white, and gray accents without any colorful gradients or neon hues.
- **Responsive Layout**: Engineered for desktop, tablet, and mobile devices with a custom hamburger menu drawer.
- **Section Highlights**:
  - **Home (Hero)**: Introduction, title, student status tag, and CTAs.
  - **About Me**: Engineering philosophy and interactive interest tags.
  - **Skills**: Categorized technical skills (Web Dev, Embedded Systems, IoT, C/C++, Hardware).
  - **Projects**: 5 featured project cards with GitHub repo links and technology badges.
  - **Education**: Detailed degree timeline with editable placeholders for institution, CGPA, and graduation year.
  - **Activities & Memberships**: Highlighting memberships at *Zyronix Tech Club* and *OXEV*.
  - **Contact**: Clean contact info cards & message interface.
- **Interactive FX**: Smooth scrolling, back-to-top floating button, scroll reveal animations, and active navbar indicator.

---

## 💻 How to Run Locally

### Option 1: Direct Browser Access
1. Download or clone this repository to your local computer.
2. Locate `index.html` in your file explorer.
3. Double-click `index.html` (or right-click → **Open with Chrome / Firefox / Edge**).

### Option 2: Live Server (VS Code Extension)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Extension ID `ritwickdey.LiveServer`).
3. Right-click `index.html` and click **"Open with Live Server"**.
4. The site will automatically launch at `http://127.0.0.1:5500`.

### Option 3: Command Line Local Server (Node.js / Python)
Using Node.js (`npx`):
```bash
# Run with npx serve
npx serve -l 3000
```
Then open `http://localhost:3000` in your web browser.

Using Python:
```bash
# Python 3
python -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

---

## 🌐 How to Deploy to GitHub Pages (Free Hosting)

Deploy your portfolio live on the web in less than 2 minutes using GitHub Pages:

### Step 1: Create a GitHub Repository
1. Log into your [GitHub Account](https://github.com).
2. Click **New Repository** (`+` icon at the top right).
3. Name your repository (e.g., `portfolio` or `navin-portfolio`).
4. Keep it **Public** and leave "Add a README" **unchecked**.
5. Click **Create repository**.

### Step 2: Push Your Code to GitHub
Run the following commands in your terminal inside your project directory:

```bash
git init
git add .
git commit -m "Initial commit - Modern monochrome portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/navin-portfolio.git
git push -u origin main
```
*(Replace `YOUR_USERNAME` and `navin-portfolio` with your actual GitHub username and repository name)*.

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Navigate to **Settings** → **Pages** (under the Code and automation section).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` and folder `/ (root)`.
4. Click **Save**.

Within 1-2 minutes, GitHub will generate your live link:
`https://YOUR_USERNAME.github.io/navin-portfolio/`

---

## ✏️ Customization & Editing Guide

- **Personal Info & Contact**: Open `index.html` and search for placeholders like `your.email@example.com`, `+91 XXXXX XXXXX`, `github.com/yourusername`, or `[College / University Name]` to replace them with your actual contact details and college name.
- **Adding Projects**: Duplicate a `<div class="project-card">` block in `index.html` under the `#projects` section.
- **Styling Tweaks**: Modify colors or fonts in `styles.css` under the `:root` section.

---

## 📄 License
Open source and available under the [MIT License](LICENSE).
