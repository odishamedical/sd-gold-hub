const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const projectIdMatch = env.match(/NEXT_PUBLIC_FIREBASE_PROJECT_ID=(.*)/);
const projectId = projectIdMatch[1].trim().replace(/['"]/g, '');

const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/shops`;

fetch(url)
  .then(res => res.text())
  .then(text => {
    fs.writeFileSync('db_output.json', text);
    console.log("Saved to db_output.json");
  })
  .catch(console.error);
