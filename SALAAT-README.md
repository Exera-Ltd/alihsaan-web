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
  
  // Debug: Log number of images found
  console.log('Number of images found:', images.length);
  
  // Build image map by row
  // For each image, find which row it's closest to
  const imageMap = {};
  images.forEach((img, idx) => {
    const anchorRow = img.getAnchorCell().getRow();
    const url = img.getUrl();
    console.log('Image ' + idx + ' at row ' + anchorRow + ': ' + url);
    imageMap[anchorRow] = url;
  });
  
  const result = { prayers: [], slides: [] };
  let currentSection = null;
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const firstCol = (row[0] || '').toString().trim();
    const rowNum = i + 1; // 1-indexed row number
    
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
      // Check for image at this row
      let imageUrl = imageMap[rowNum] || '';
      
      // Also check if the cell value is a URL
      const cellValue = (row[3] || '').toString().trim();
      if (!imageUrl && cellValue && cellValue.startsWith('http')) {
        imageUrl = cellValue;
      }
      
      console.log('Slide row ' + rowNum + ', imageUrl: ' + imageUrl);
      
      result.slides.push({
        id: firstCol,
        title: row[1] || '',
        subtitle: row[2] || '',
        imageUrl: imageUrl,
        gradient: (row[4] || 'from-emerald-600 via-teal-500 to-cyan-500').toString().trim()
      });
    }
  }
  
  console.log('Final result:', JSON.stringify(result, null, 2));
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

5. Click **Save** (floppy disk icon)
6. Click **Run** button to test - check the Execution log to see if images are found
7. Click **Deploy** → **New deployment**
8. Click the gear icon → Select **Web app**
9. Set **Execute as**: Me
10. Set **Who has access**: Anyone
11. Click **Deploy**
12. Click **Authorize access** → Choose your Google account → Allow permissions
13. **Copy the Web app URL** (looks like: `https://script.google.com/macros/s/XXXXX/exec`)

### Step 2: Update the Website Configuration

Update the GitHub Secret:
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Update `VITE_GOOGLE_SHEET_URL` with the new Apps Script URL
3. Re-run the GitHub Actions workflow

---

## How to Add Images

### Option 1: Image Over Cells (For Google Sheets)
1. Click on the cell in column D (Image column) for the slide row
2. Go to **Insert** → **Image** → **Insert image over cells**
3. The image will be placed over the cell
4. **Important**: The image's top-left corner should be in the same row as your slide data

### Option 2: Direct URL (Easiest - Recommended)
1. Upload your image to any image hosting service (Imgur, PostImage, etc.)
2. Copy the direct image URL (must end in .jpg, .png, etc.)
3. Paste the URL directly in the Image column (column D)
4. This is the most reliable method!

---

## Google Sheet Format

```
Row 1:  #PRAYERS
Row 2:  ID, Name, Arabic Name, Time
Row 3:  fajr, Fajr, فجر, 5:10
Row 4:  sunrise, Sunrise, شروق, 5:58
Row 5:  dhuhr, Dhuhr/ Jummah, ظهر, 12:17
Row 6:  asr, Asr, عصر, 15:45
Row 7:  maghrib, Maghrib, مغرب, 18:22
Row 8:  isha, Isha, عشاء, 19:35
Row 9:  (empty row)
Row 10: #SLIDES
Row 11: ID, Title, Subtitle, Image, Gradient
Row 12: 1, Ramadan Mubarak, Join us for Taraweeh, https://imgur.com/xxx.png, from-emerald-600...
Row 13: 2, Jumu'ah Prayer, Friday 1:00 PM, https://imgur.com/yyy.png, from-amber-500...
```

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

### Images not showing
1. **Check the Apps Script log**: Run the script in the editor and check the Execution log
2. **Use direct URL**: Paste the image URL directly in the Image column (most reliable)
3. **Image over cells**: Make sure the image's anchor cell is in the correct row

### Time showing wrong
- Make sure the time column is formatted as time in Google Sheets

### Website not updating
- Wait 1-2 minutes after changing the sheet
- Refresh the page

---

## Need Help?

Contact your developer with:
1. The Apps Script URL
2. The Execution log output (if images aren't working)
