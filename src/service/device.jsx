import { Component } from "react";
import { http } from "./http.endpoint";

function query(options) {
  let option = "";
  if (options) {
    option = "?";
    for (const key in options) {
      if (Object.hasOwnProperty.call(options, key)) {
        option += key + "=" + options[key] + "&";
      }
    }
  }
  return option;
}

export default class DeviceService extends Component {
  static getAll(option) {
    return http.get(`/device/${query(option)}`);
  }
  static getDeviceType() {
    return http.get(`/device_type`);
  }
}
