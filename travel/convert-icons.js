const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.log('sharp not found, trying svg2png...');
}

// SVG files to convert
const icons = [
    'tab-home',
    'tab-home-active',
    'tab-plan',
    'tab-plan-active',
    'tab-favorite',
    'tab-favorite-active',
    'tab-mine',
    'tab-mine-active'
];

const staticPath = path.join(__dirname, 'static');

// Color mapping for icons
const iconColors = {
    'tab-home': '#8B7355',
    'tab-home-active': '#C75B39',
    'tab-plan': '#8B7355',
    'tab-plan-active': '#C75B39',
    'tab-favorite': '#8B7355',
    'tab-favorite-active': '#C75B39',
    'tab-mine': '#8B7355',
    'tab-mine-active': '#C75B39'
};

async function convertSvgToPng(svgName) {
    const svgPath = path.join(staticPath, `${svgName}.svg`);
    const pngPath = path.join(staticPath, `${svgName}.png`);

    if (!fs.existsSync(svgPath)) {
        console.log(`SVG not found: ${svgName}.svg`);
        return;
    }

    const svgContent = fs.readFileSync(svgPath, 'utf8');
    const color = iconColors[svgName] || '#8B7355';

    // Replace stroke color in SVG
    const modifiedSvg = svgContent.replace(/stroke="#[A-Fa-f0-9]+"/g, `stroke="${color}"`);

    try {
        if (sharp) {
            await sharp(Buffer.from(modifiedSvg))
                .resize(81, 81)
                .png()
                .toFile(pngPath);
            console.log(`Converted: ${svgName}.svg -> ${svgName}.png`);
        } else {
            // Fallback: just copy as placeholder
            console.log(`sharp not available, skipping ${svgName}`);
        }
    } catch (err) {
        console.error(`Error converting ${svgName}:`, err.message);
    }
}

async function main() {
    console.log('Starting SVG to PNG conversion...');
    console.log('If sharp is not installed, please run: npm install sharp');

    for (const icon of icons) {
        await convertSvgToPng(icon);
    }

    console.log('Done!');
}

main();
