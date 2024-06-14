import { Component } from "react"
import { http } from "./http.endpoint"

function query(options) {
  let option = ""
  if (options) {
    option = "?"
    for (const key in options) {
      if (Object.hasOwnProperty.call(options, key)) {
        option += key + "=" + options[key] + "&"
      }
    }
  }
  return option
}

export default class EnergyService extends Component {

  static getYearly(storeId, filter) {
    return http.get(`/dashboard/energy/yearly/${storeId}`, filter)
  }

  static getDaily(storeId, options) {
    return http.get(`/dashboard/energy/daily/${storeId}${query(options)}`)
  }

  static getRanking(storeId, option) {
    return http.get(`/dashboard/energy/ranking/${storeId}${query(option)}`)
  }

  static getRankingCard2(option) {
    return http.get(`/dashboard/energy/ranking/card2${query(option)}`) 
  }

  static getRankingById(storeId, body) {
    return http.get(`/dashboard/energy/ranking/${storeId}`, body)
  }

  static getKPI(userId, filter) {
    return http.get(`/dashboard/energy/kpi/${userId}`, filter)
  }
}
