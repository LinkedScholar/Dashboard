# LinkedScholar Dashboard

This project is based on [ngx-admin](https://github.com/akveo/ngx-admin) and provides a modular, extensible Angular admin panel with CKEditor 4 integration.

---

## Set-up
Before running the app, make sure you're using the correct versions:

```bash
# Angular CLI
ng version

# Node.js
node -v

# npm
npm -v
````

Angular CLI: 15.2.11

Node.js: v18.12.0

npm: 9.x (or compatible)

### 1. Clean everything before just in case

```bash
# Remove existing dependencies and lock file
rm -rf node_modules package-lock.json

# Clean npm cache
npm cache clean --force
````

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm cache clean --force
```

---

### 2. Reinstall Dependencies

```bash
npm install --legacy-peer-deps
```

This avoids peer dependency conflicts that exist in older ngx-admin packages.

---

### 3. CKEditor Setup (for ng2-ckeditor)

```bash
npm install ckeditor --save --legacy-peer-deps
npm install @types/ckeditor --save-dev --legacy-peer-deps
```

---

### 4. Run the App

```bash
npm start
```

This will start the Angular development server at:

> [http://localhost:4200](http://localhost:4200)

---
