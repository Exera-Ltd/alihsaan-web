# Salaat Times - Easy Update Guide for Al-Ihsaan Foundation

## The Easiest Way: Single Google Sheet

Update prayer times and announcement images using **ONE Google Sheet** - just like editing Excel!

---

## Google Sheet Format (All in ONE Sheet)

Everything goes in the **same sheet** (Sheet1), just in different rows:

```
Row 1:  #PRAYERS
Row 2:  ID, Name, Arabic Name, Time
Row 3:  fajr, Fajr, fajr, 04:45
Row 4:  sunrise, Sunrise, shurooq, 05:58
Row 5:  dhuhr, Dhuhr, dhuhr, 12:15
Row 6:  asr, Asr, asr, 15:45
Row 7:  maghrib, Maghrib, maghrib, 18:22
Row 8:  isha, Isha, isha, 19:35
Row 9:  (empty row)
Row 10: #SLIDES
Row 11: ID, Title, Subtitle, Image URL, Gradient
Row 12: 1, Ramadan Mubarak, Join us for Taraweeh, https://i.imgur.com/abc.jpg, from-emerald-600 via-teal-500 to-cyan-500
Row 13: 2, Jumu'ah Prayer, Friday 1:00 PM, https://i.imgur.com/def.jpg, from-amber-500 via-orange-500 to-red-500
Row 14: 3, Quran Classes, Weekend classes, https://i.imgur.com/ghi.jpg, from-purple-600 via-indigo-500 to-blue-500
```

**That's it!** Just put `#PRAYERS` at the top of the prayer times, and `#SLIDES` at the top of the images section.

---

## Visual Example

Your Google Sheet should look like this:

| | A | B | C | D | E |
|---|---|---|---|---|---|
| **1** | **#PRAYERS** | | | | |
| **2** | ID | Name | Arabic Name | Time | |
| **3** | fajr | Fajr | fajr | 04:45 | |
| **4** | sunrise | Sunrise | shurooq | 05:58 | |
| **5** | dhuhr | Dhuhr | dhuhr | 12:15 | |
| **6** | asr | Asr | asr | 15:45 | |
| **7** | maghrib | Maghrib | maghrib | 18:22 | |
| **8** | isha | Isha | isha | 19:35 | |
| **9** | | | | | |
| **10** | **#SLIDES** | | | | |
| **11** | ID | Title | Subtitle | Image URL | Gradient |
| **12** | 1 | Ramadan Mubarak | Join us for Taraweeh | https://i.imgur.com/abc.jpg | from-emerald-600 via-teal-500 to-cyan-500 |
| **13** | 2 | Jumu'ah Prayer | Friday 1:00 PM | https://i.imgur.com/def.jpg | from-amber-500 via-orange-500 to-red-500 |

---

## How to Add/Change Images

### Step 1: Upload Your Image
1. Go to [Imgur.com](https://imgur.com) (free image hosting, no account needed)
2. Click "New post" and upload your image
3. Right-click the uploaded image > "Copy image address"
4. Paste this URL in column D (Image URL)

### Step 2: Add a Row
1. Go to the `#SLIDES` section (around row 10+)
2. Add a new row below the header
3. Fill in: ID, Title, Subtitle, Image URL, Gradient

### Step 3: Done!
- The website will automatically loop through all images
- Add as many slides as you want!

---

## Gradient Color Options (Column E)

Choose a background color for slides (used if no image):

| Gradient | Color |
|----------|-------|
| `from-emerald-600 via-teal-500 to-cyan-500` | Green |
| `from-amber-500 via-orange-500 to-red-500` | Orange/Red |
| `from-purple-600 via-indigo-500 to-blue-500` | Purple/Blue |
| `from-rose-500 via-pink-500 to-fuchsia-500` | Pink |
| `from-slate-700 via-slate-600 to-slate-800` | Dark Gray |

---

## Quick Reference for Al-Ihsaan Staff

### To Change Prayer Times:
1. Open the Google Sheet
2. Find the prayer row (rows 3-8)
3. Change the time in column D (24-hour format: `HH:MM`)
4. Done!

### To Add an Announcement Image:
1. Upload image to Imgur.com
2. Copy the image URL
3. Add a new row under `#SLIDES` section
4. Fill in: ID, Title, Subtitle, Image URL
5. Done!

### To Remove an Image:
1. Delete the entire row
2. Done!

---

## Setup Instructions (One-Time - Developer)

### Step 1: Create the Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Al-Ihsaan Prayer Times"
3. Add the data in the format shown above

### Step 2: Publish the Sheet
1. Click **File** > **Share** > **Publish to web**
2. Select **Sheet1**
3. Select **Comma-separated values (.csv)**
4. Click **Publish**
5. Copy the URL

### Step 3: Configure the Website
Create a `.env` file:
```
VITE_GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0
```

### Step 4: Share with Staff
Share the Google Sheet with Al-Ihsaan staff email addresses (Editor access)

---

## Access URLs

- **Main Website**: `https://[username].github.io/alihsaan-web/`
- **Salaat Times**: `https://[username].github.io/alihsaan-web/#/salaat`

---

## Need Help?

- **Undo mistakes**: Press Ctrl+Z or use File > Version history
- **Image not showing**: Make sure the image URL ends with `.jpg` or `.png`
- **Website not updating**: Wait 1-2 minutes, then refresh the page