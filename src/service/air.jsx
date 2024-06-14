import axios from "axios"
import { Component } from "react"
import { http } from "./http.endpoint"

export default class AirService extends Component {
  static getOverview(storeId) {
    return http.get(`/dashboard/air/overview/${storeId}`)
  }

  static getGraph(storeId, body) {
    return http.get(`/dashboard/air/graph/${storeId}`, body)
  }

  static getNotification(id) {
    return http.get(`/notification/air/userId?userId=${id}`)
  }
 
  static getResult(storeId) {
    return http.get(`/dashboard/air/result/${storeId}`)
  }

  static getHistory(storeId, filter) {
    return http.get(`/dashboard/air/overview/history/${storeId}`, filter)
  }

  static getKPI(userId, filter) {
    return http.get(`/dashboard/air/kpi/${userId}`, filter)
  }
}
