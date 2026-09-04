function getBaseUrl() {
    // H5 走同源：本地由 Vite 代理，上线由 FastAPI 一起托管
    // #ifdef H5
    try {
        const envUrl = import.meta.env && import.meta.env.VITE_API_BASE
        if (envUrl) return String(envUrl).replace(/\/$/, '')
    } catch (e) { /* ignore */ }
    if (typeof window !== 'undefined') return ''
    // #endif
    return 'http://127.0.0.1:8000'
}

const BASE_URL = getBaseUrl()
const TIMEOUT = 300000

function request(url, method = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASE_URL + url,
            method: method,
            data: data,
            header: {
                'Content-Type': 'application/json'
            },
            timeout: TIMEOUT,
            success: (res) => {
                console.log('后端响应:', url, res.statusCode, res.data)
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else if (res.statusCode === 500 || res.statusCode === 503) {
                    reject({
                        msg: res.data.detail || '服务器错误',
                        statusCode: res.statusCode
                    })
                } else {
                    reject({
                        msg: '请求失败',
                        statusCode: res.statusCode
                    })
                }
            },
            fail: (err) => {
                console.error('后端API请求失败:', url, err)
                let errorMsg = '网络请求失败'
                if (err.errMsg && err.errMsg.includes('timeout')) {
                    errorMsg = '请求超时，AI规划耗时较长，请稍后重试'
                } else if (err.errMsg && err.errMsg.includes('fail url not in domain list')) {
                    errorMsg = '请在微信开发者工具中关闭"不校验合法域名"选项'
                } else if (err.errMsg && err.errMsg.includes('connect')) {
                    errorMsg = '无法连接到后端服务，请检查 http://localhost:8000 是否启动'
                }
                reject({ msg: errorMsg })
            }
        })
    })
}

export function get(url, data) {
    return request(url, 'GET', data)
}

export function post(url, data) {
    return request(url, 'POST', data)
}

export { BASE_URL }
