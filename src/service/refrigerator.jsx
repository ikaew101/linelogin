import { Component } from "react"
import { http } from "./http.endpoint"

export default class RefrigService extends Component {
  static getRefrigOverview(storeId) {
    return http.get(`/dashboard/refrig/overview?storeId=${storeId}`)
  }

  static getRefrigGraph(storeId, body) {
    return http.get(`/dashboard/refrig/graph?storeId=${storeId}`)
  }

  static getRefrigNotification() {
    return http.get(`/dashboard/refrig/notification`)
  }

  static getRefrigNotificationById(userId) {
    return http.get(`/notification/refrig/userId?userId=${userId}`);
  }

  static getKPI(userId, filter) {
    return http.get(`/dashboard/refrig/kpi/${userId}`, filter)
  }
}
