const path = require('path')
const { spawn } = require('child_process')

const root = path.resolve(__dirname, '..')
process.env.UNI_INPUT_DIR = root

const bin = path.join(
    root,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'uni.cmd' : 'uni'
)

const child = spawn(bin, process.argv.slice(2), {
    stdio: 'inherit',
    env: process.env,
    cwd: root,
    shell: process.platform === 'win32'
})

child.on('exit', (code) => {
    process.exit(code || 0)
})
