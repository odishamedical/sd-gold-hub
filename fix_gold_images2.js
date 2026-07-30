const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/gold-shop/[id]/ClientPage.tsx');
let content = fs.readFileSync(file, 'utf8');

// Revert previous onError handlers
content = content.replace(/ onError=\{\(e\) => \{[^}]+\}\}/g, "");

// Add proper onError handlers
content = content.replace(/<Image([^>]+)\/>/g, (match, attrs) => {
    let fallback = '`https://placehold.co/600x400/0A0F1C/333333?text=Image+Error`';
    
    if (attrs.includes('shop.logoUrl')) {
        fallback = '`https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=141C33&color=D4AF37`';
    }

    return `<Image${attrs} onError={(e) => { (e.target as HTMLImageElement).srcset = ""; (e.target as HTMLImageElement).src = ${fallback}; }} />`;
});

fs.writeFileSync(file, content);
console.log("Fixed ClientPage images properly.");
