const baseUrl = 'https://m1.apifoxmock.com/m1/4728220-0-default/api'
const TIMEOUT = 5000

function getAuthHeader() {
    const token = uni.getStorageSync('token')
    return token ? { 'Authorization': 'Bearer ' + token } : {}
}

function request(url, method = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
        let timer = null
        const requestTask = uni.request({
            url: baseUrl + url,
            method: method,
            data: data,
            header: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            timeout: TIMEOUT,
            success: (res) => {
                clearTimeout(timer)
                if (res.data && res.data.code === 1) {
                    resolve(res.data)
                } else if (res.data) {
                    reject(res.data)
                } else {
                    reject({ msg: '请求失败' })
                }
            },
            fail: (err) => {
                clearTimeout(timer)
                reject({ msg: '网络请求失败，请检查网络连接' })
            }
        })

        timer = setTimeout(() => {
            requestTask.abort()
            reject({ msg: '请求超时，请稍后重试' })
        }, TIMEOUT)
    })
}

export function get(url, data) {
    return request(url, 'GET', data)
}

export function post(url, data) {
    return request(url, 'POST', data)
}

export { baseUrl }
