const fs = require('fs')
const path = require('path')

function findH5Dist() {
    const candidates = [
        path.join(__dirname, '..', 'dist', 'build', 'h5'),
        path.join(__dirname, '..', 'unpackage', 'dist', 'build', 'h5')
    ]
    return candidates.find((dir) => fs.existsSync(path.join(dir, 'index.html')))
}

function copyDir(src, dest) {
    fs.rmSync(dest, { recursive: true, force: true })
    fs.mkdirSync(dest, { recursive: true })
    fs.cpSync(src, dest, { recursive: true })
}

const src = findH5Dist()
if (!src) {
    console.error('未找到 H5 构建产物，请先执行 npm run build:h5')
    process.exit(1)
}

const dest = path.join(__dirname, '..', '..', 'backend', 'static', 'h5')
copyDir(src, dest)
console.log('H5 预览文件已复制到', dest)
