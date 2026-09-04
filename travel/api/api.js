import { MockAPI } from '../utils/mock-api.js'

// 景点/订单没有真实业务后端，统一走本地稳定目录，避免 Apifox 随机数据导致详情对不上。

export function getBanner() {
    return Promise.resolve(MockAPI.getBanner())
}

export function getHomeList(page = 1, pageSize = 10, extra = {}) {
    return Promise.resolve(MockAPI.getHomeList(page, pageSize, extra))
}

export function getSpotDetail(id) {
    return Promise.resolve(MockAPI.getSpotDetail(id))
}

export function getFavoriteList(page = 1, pageSize = 10) {
    return Promise.resolve(MockAPI.getFavoriteList(page, pageSize))
}

export function searchSpots(keyword, page = 1, pageSize = 10) {
    return Promise.resolve(MockAPI.searchSpots(keyword, page, pageSize))
}

export function getNearbySpots(latitude, longitude, page = 1, pageSize = 10) {
    return Promise.resolve(MockAPI.getNearbySpots(latitude, longitude, page, pageSize))
}

export function getHotSpots(page = 1, pageSize = 10) {
    return Promise.resolve(MockAPI.getHotSpots(page, pageSize))
}

export function getRecommendSpots(page = 1, pageSize = 10) {
    return Promise.resolve(MockAPI.getRecommendSpots(page, pageSize))
}

export function getReviewList(spotId, page = 1, pageSize = 10) {
    return Promise.resolve(MockAPI.getReviewList(spotId, page, pageSize))
}

export function addFavorite(spotId) {
    return Promise.resolve(MockAPI.addFavorite(spotId))
}

export function removeFavorite(spotId) {
    return Promise.resolve(MockAPI.removeFavorite(spotId))
}

export function createOrder(orderData) {
    return Promise.resolve(MockAPI.createOrder(orderData))
}
