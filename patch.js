const fs = require('fs');
const file = 'src/constants/properties.ts';
let data = fs.readFileSync(file, 'utf8');
const imgs = ['/images/jungle.png', '/images/ocean.png', '/images/minimalist.png'];
let i = 0;
data = data.replace(/image: "https:\/\/images\.unsplash\.com[^"]+"/g, () => {
    return 'image: "' + imgs[i++ % imgs.length] + '"';
});
fs.writeFileSync(file, data);
