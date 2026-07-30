const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/gold-shop/[id]/ClientPage.tsx');
let content = fs.readFileSync(file, 'utf8');

// Add onError handler to all <Image ... />
content = content.replace(/<Image([^>]+)\/>/g, (match, attrs) => {
    if (attrs.includes('onError')) return match; // already has one
    
    // determine what fallback to use based on the context
    let fallback = '"/placeholder.png"';
    
    // append onError
    return `<Image${attrs} onError={(e) => { (e.target as HTMLImageElement).srcset = ""; (e.target as HTMLImageElement).src = ${fallback}; }} />`;
});

fs.writeFileSync(file, content);
console.log("Fixed ClientPage images.");
