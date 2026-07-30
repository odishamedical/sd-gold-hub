const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/gold-shop/[id]/ClientPage.tsx');
let content = fs.readFileSync(file, 'utf8');

// Change placehold.co to placehold.co/....png
content = content.replace(/https:\/\/placehold\.co\/([0-9x]+)\/([A-Z0-9]+)\/([A-Z0-9]+)\?text=([^"']+)/g, (match, size, bg, fg, text) => {
    return `https://placehold.co/${size}/${bg}/${fg}.png?text=${text}`;
});

content = content.replace(/Image\+Error/g, "Add+Photo");

fs.writeFileSync(file, content);
console.log("Fixed placehold.co to use .png");
