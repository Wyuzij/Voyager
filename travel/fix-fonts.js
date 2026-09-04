const fs = require('fs');
const path = require('path');

const files = [
    'pages/index/index.vue',
    'pages/detail/detail.vue',
    'pages/plan/plan.vue',
    'pages/login/login.vue'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Remove font-family: 'Noto Serif SC', serif;
        content = content.replace(/\tfont-family: 'Noto Serif SC', serif;\n/g, '\n');
        content = content.replace(/    font-family: 'Noto Serif SC', serif;\n/g, '\n');
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`Fixed: ${file}`);
        } else {
            console.log(`No changes: ${file}`);
        }
    } else {
        console.log(`Not found: ${file}`);
    }
});

console.log('Done!');
