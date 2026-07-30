const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const projectIdMatch = env.match(/NEXT_PUBLIC_FIREBASE_PROJECT_ID=(.*)/);
const projectId = projectIdMatch[1].trim().replace(/['"]/g, '');

const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/shops`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const shops = data.documents;
    shops.forEach(doc => {
      const shopName = doc.fields.name.stringValue;
      if (shopName.includes("IRA")) {
        console.log("Shop:", shopName);
        console.log("Logo:", doc.fields.logoUrl ? doc.fields.logoUrl.stringValue : "MISSING");
        console.log("Cover Images:");
        if (doc.fields.coverImages && doc.fields.coverImages.arrayValue && doc.fields.coverImages.arrayValue.values) {
          doc.fields.coverImages.arrayValue.values.forEach((val, i) => {
            console.log(`[${i}]: ${val.stringValue}`);
          });
        }
      }
    });
  })
  .catch(console.error);
