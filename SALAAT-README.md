# Salaat Times - Easy Update Guide for Al-Ihsaan Foundation

## Overview

Update prayer times and announcement images using **ONE Google Sheet** - just like editing Excel!

---

## Setup Instructions (One-Time - Do This First!)

### Step 1: Add the Apps Script (Enables Image Support)

1. Open your Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Delete any code in the editor
4. Copy and paste this code:

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  const images = sheet.getImages();
  
  // Build image map by row (for images OVER cells)
  const imageMap = {};
  images.forEach(img => {
    const row = img.getAnchorCell().getRow();
    imageMap[row] = img.getUrl();
  });
  
  const result = { prayers: [], slides: [] };
  let currentSection = null;
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const firstCol = (row[0] || '').toString().trim();
    
    // Check for section markers
    if (firstCol.toLowerCase() === '#prayers') {
      currentSection = 'prayers';
      continue;
    }
    if (firstCol.toLowerCase() === '#slides') {
      currentSection = 'slides';
      continue;
    }
    
    // Skip empty rows and headers
    if (!firstCol || firstCol.toLowerCase() === 'id') continue;
    
    if (currentSection === 'prayers' && row.length >= 4) {
      // Format time correctly - Google Sheets stores time as date
      let timeValue = row[3];
      let timeStr = '';
      
      if (timeValue instanceof Date) {
        const hours = timeValue.getHours();
        const minutes = timeValue.getMinutes();
        timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      } else if (typeof timeValue === 'string') {
        timeStr = timeValue.trim();
      } else if (typeof timeValue === 'number') {
        // Excel time serial number
        const totalMinutes = Math.round(timeValue * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      
      result.prayers.push({
        id: firstCol.toLowerCase(),
        name: row[1] || '',
        arabicName: row[2] || '',
        time: timeStr
      });
    } else if (currentSection === 'slides' && row.length >= 4) {
      // Check for image in this row (1-indexed for imageMap)
      // Also check if the cell value contains an image URL or "CellImage"
      let imageUrl = imageMap[i + 1] || '';
      
      // If no image over cell, check the cell value
      const cellValue = (row[3] || '').toString().trim();
      if (!imageUrl && cellValue && cellValue !== 'CellImage' && cellValue.startsWith('http')) {
        imageUrl = cellValue;
      }
      
      result.slides.push({
        id: firstCol,
        title: row[1] || '',
        subtitle: row[2] || '',
        imageUrl: imageUrl,
        gradient: (row[4] || 'from-emerald-600 via-teal-500 to-cyan-500').toString().trim()
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

5. Click **Save** (floppy disk icon) - name it "AlIhsaanAPI"
6. Click **Deploy** → **New deployment**
7. Click the gear icon → Select **Web app**
8. Set **Execute as**: Me
9. Set **Who has access**: Anyone
10. Click **Deploy**
11. Click **Authorize access** → Choose your Google account → Allow permissions
12. **Copy the Web app URL** (looks like: `https://script.google.com/macros/s/XXXXX/exec`)

AKfycbxUABIn9zWxHmsVitnworjiyqwKoavDs_ePglq5_szdC9snWS20ugNmFoUAoj8Ejuk0wg
https://script.google.com/macros/s/AKfycbxUABIn9zWxHmsVitnworjiyqwKoavDs_ePglq5_szdC9snWS20ugNmFoUAoj8Ejuk0wg/exec
### Step 2: Update the Website Configuration

Update the GitHub Secret:
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Update `VITE_GOOGLE_SHEET_URL` with the new Apps Script URL
3. Re-run the GitHub Actions workflow

---

## How to Add Images (Two Options)

### Option 1: Image Over Cell (Recommended)
1. Click on the row where you want the image
2. Go to **Insert** → **Image** → **Insert image over cells**
3. Position the image in column D (Image column)
4. The script will automatically detect it!

### Option 2: Direct URL
1. Upload image to Imgur, PostImage, or any image host
2. Paste the direct URL in the Image column
3. The script will use that URL

---

## Google Sheet Format

```
Row 1:  #PRAYERS
Row 2:  ID, Name, Arabic Name, Time
Row 3:  fajr, Fajr, فجر, 4:45
Row 4:  sunrise, Sunrise, شروق, 5:58
Row 5:  dhuhr, Dhuhr/ Jummah, ظهر, 12:17
Row 6:  asr, Asr, عصر, 15:45
Row 7:  maghrib, Maghrib, مغرب, 18:22
Row 8:  isha, Isha, عشاء, 19:35
Row 9:  (empty row)
Row 10: #SLIDES
Row 11: ID, Title, Subtitle, Image, Gradient
Row 12: 1, Ramadan Mubarak, Join us for Taraweeh, [IMAGE], from-emerald-600...
Row 13: 2, Jumu'ah Prayer, Friday 1:00 PM, [IMAGE], from-amber-500...
```

---

## How to Use (After Setup)

### To Change Prayer Times:
1. Open the Google Sheet
2. Find the prayer row (rows 3-8)
3. Change the time in column D (24-hour format: `HH:MM`)
4. Done! Changes appear in ~1 minute

### To Add an Announcement with Image:
1. Add a new row under `#SLIDES` section
2. Fill in: ID, Title, Subtitle
3. **Insert → Image → Insert image over cells** → Position in column D
4. Done! The image appears automatically!

### To Change an Image:
1. Delete the old image (click on it and press Delete)
2. Insert a new image over cells
3. Position it in column D
4. Done!

### To Remove an Announcement:
1. Delete the entire row
2. Done!

---

## Gradient Color Options (Column E)

| Gradient | Color |
|----------|-------|
| `from-emerald-600 via-teal-500 to-cyan-500` | Green |
| `from-amber-500 via-orange-500 to-red-500` | Orange/Red |
| `from-purple-600 via-indigo-500 to-blue-500` | Purple/Blue |
| `from-rose-500 via-pink-500 to-fuchsia-500` | Pink |
| `from-slate-700 via-slate-600 to-slate-800` | Dark Gray |

---

## Access URLs

- **Main Website**: `https://[username].github.io/alihsaan-web/`
- **Salaat Times**: `https://[username].github.io/alihsaan-web/#/salaat`

---

## Troubleshooting

- **Images not showing**: Make sure you used "Insert image over cells" (not "in cell")
- **Time showing wrong**: Make sure the time column is formatted as time in Google Sheets
- **Website not updating**: Wait 1-2 minutes, then refresh the page
- **Script error**: Re-authorize the script in Apps Script editor

---

## Need Help?

Contact your developer with the Web app URL from Step 1.
