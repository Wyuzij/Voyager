import { get, post } from './backend-http.js'

export function planTrip(tripRequest) {
    return post('/api/trip/plan', tripRequest)
}

export function getTripHealth() {
    return get('/api/trip/health')
}

export function getPoiDetail(poiId) {
    return get(`/api/poi/detail/${poiId}`)
}

export function searchPoi(keywords, city = '北京') {
    return get('/api/poi/search', { keywords, city })
}

export function getPoiPhoto(name) {
    return get('/api/poi/photo', { name })
}

export function searchMapPoi(keywords, city, citylimit = true) {
    return get('/api/map/poi', { keywords, city, citylimit })
}

export function getWeather(city) {
    return get('/api/map/weather', { city })
}

export function planRoute(routeRequest) {
    return post('/api/map/route', routeRequest)
}

export function getMapHealth() {
    return get('/api/map/health')
}

export function reverseGeocode(longitude, latitude) {
    return get('/api/map/regeo', { longitude, latitude })
}
