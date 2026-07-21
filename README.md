# Hari & Diya — Premium Wedding Website

An elegant, fully-responsive wedding website designed with a refined White, Sage Green, and Gold palette. It features an entrance animation, a dynamic countdown timer, a story timeline, an editorial photography showcase, venue details with direct Google Maps integration, and a Google Sheets-backed RSVP form.

## 📁 Project Structure

- `index.html` - Semantic structure, layouts, and external assets (Google Fonts, GSAP CDN).
- `styles.css` - Custom luxury animations, responsive grid system, and layout styles.
- `script.js` - Dynamic entry screen reveal, countdown logic, viewport reveal triggers, and RSVP submission handler.
- `assets/` - Pre-wedding photo assets (artistic watercolor placeholders generated for this build).

---

## 📝 Setup Guide: Connect RSVP Form to Google Sheets

To collect RSVP responses directly in a Google Spreadsheet for free, follow these simple steps to set up a Google Apps Script endpoint:

### Step 1: Create your Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a **Blank Spreadsheet**.
2. Name your spreadsheet (e.g., `Hari & Diya RSVP Responses`).
3. Set up the column headers in the first row:
   - **Column A**: `Timestamp`
   - **Column B**: `Name`
   - **Column C**: `Email`
   - **Column D**: `Attendance`
   - **Column E**: `Guests`
   - **Column F**: `Message`

### Step 2: Write the Google Apps Script
1. In your spreadsheet, click on **Extensions** > **Apps Script** in the top menu bar.
2. Delete any default code in the editor (`code.gs`) and paste the following script:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var timestamp = new Date();
  
  var name = "";
  var email = "";
  var attendance = "";
  var guests = 0;
  var message = "";
  
  try {
    if (e.postData && e.postData.contents) {
      var data = JSON.parse(e.postData.contents);
      name = data.name || "";
      email = data.email || "";
      attendance = data.attendance || "";
      guests = data.guests || 0;
      message = data.message || "";
    } else {
      name = e.parameter.name || "";
      email = e.parameter.email || "";
      attendance = e.parameter.attendance || "";
      guests = e.parameter.guests || 0;
      message = e.parameter.message || "";
    }
    
    sheet.appendRow([timestamp, name, email, attendance, guests, message]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST'
      });
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS preflight options request
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}
```

### Step 3: Deploy as a Web App
1. Click the blue **Deploy** button in the upper right, and choose **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill out the fields:
   - **Description**: `Wedding RSVP API`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial: This allows the website to send form data without requiring guest logins)*.
4. Click **Deploy**.
5. Google will ask you to authorize access. Click **Authorize access**, log in to your Google Account, click **Advanced**, and then click **Go to Untitled project (unsafe)**. Allow the requested permissions.
6. Copy the **Web App URL** provided under the deployment details (it ends with `/exec`).

### Step 4: Link to Website
1. Open `script.js` in your website code.
2. Locate line 121:
   ```javascript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/PLACEHOLDER_WEBAPP_ID/exec";
   ```
3. Replace the placeholder URL with your copied **Web App URL**.
4. Save the file. Your RSVP submissions will now log automatically into your Google Sheet!

---

## 🚀 Deployment Guide: Publish to GitHub & Vercel

### Step 1: Create a GitHub Repository
1. Go to [GitHub](https://github.com) and log in.
2. Click **New** repository.
3. Set the repository name (e.g., `wedding-website`) and make it **Public**. Do not initialize it with a README, `.gitignore`, or license.
4. Click **Create repository**.
5. Copy the command lines under "**…or push an existing repository from the command line**".

### Step 2: Push to GitHub via Terminal
In your local command line, run the following commands from your project root directory:
```bash
git init
git add .
git commit -m "Initialize elegant wedding website for Hari & Diya"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [Vercel](https://vercel.com) and log in (sign up with GitHub).
2. Click **Add New** > **Project**.
3. Import your newly created repository (`wedding-website`) from the listed GitHub repositories.
4. Leave all settings at default (Vercel automatically detects a static HTML project).
5. Click **Deploy**.
6. Within a minute, your website will be live with a free, high-performance `.vercel.app` domain!
