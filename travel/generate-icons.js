const sharp = require('sharp');
const path = require('path');
const staticDir = path.join(__dirname, 'static');

const icons = [
    { name: 'tab-home.png', text: '⌂', color: '#8B7355', bg: '#FFFFFF00' },
    { name: 'tab-home-active.png', text: '⌂', color: '#C75B39', bg: '#FFFFFF00' },
    { name: 'tab-plan.png', text: '◎', color: '#8B7355', bg: '#FFFFFF00' },
    { name: 'tab-plan-active.png', text: '◎', color: '#C75B39', bg: '#FFFFFF00' },
    { name: 'tab-favorite.png', text: '♥', color: '#8B7355', bg: '#FFFFFF00' },
    { name: 'tab-favorite-active.png', text: '♥', color: '#C75B39', bg: '#FFFFFF00' },
    { name: 'tab-mine.png', text: '☺', color: '#8B7355', bg: '#FFFFFF00' },
    { name: 'tab-mine-active.png', text: '☺', color: '#C75B39', bg: '#FFFFFF00' },
];

async function createIcon(icon) {
    const size = 48;
    const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="${icon.bg}"/>
            <text x="50%" y="50%" font-size="28" fill="${icon.color}"
                  text-anchor="middle" dominant-baseline="central"
                  font-family="Arial, sans-serif">${icon.text}</text>
        </svg>
    `;

    await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(path.join(staticDir, icon.name));
    console.log(`Created ${icon.name}`);
}

async function main() {
    for (const icon of icons) {
        await createIcon(icon);
    }
    console.log('All icons created!');
}

main().catch(console.error);
