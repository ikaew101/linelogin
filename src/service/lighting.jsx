import { Component } from "react"
import { http } from "./http.endpoint"

export default class LightingService extends Component {
  static getOverview(storeId) {
    return http.get(`/dashboard/lighting/overview/${storeId}`)
  }

  static getDaily(storeId, body) {
    return http.get(`/dashboard/lighting/graph/${storeId}`, body)
  }

  static getResult(storeId) {
    return http.get(`/dashboard/lighting/result/${storeId}`)
  }

  static getKPI(userId, filter) {
    return http.get(`/dashboard/lighting/kpi/${userId}`, filter)
  }
}
