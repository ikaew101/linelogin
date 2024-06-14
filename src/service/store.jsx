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

export default class StoreService extends Component {
  static getAll(option) {
    return http.get(`/store/${query(option)}`);
  }
  static getStoreFormat() {
    return http.get(`/store_format`);
  }

  static create(body) {
    return http.post(`/store`, body);
  }

  static update(id, body) {
    return http.put(`/store/${id}`, body);
  }

  static delete(id) {
    return http.del(`/store/${id}`);
  }

  static getByStoreNumber(number) {
    return http.get(`/store/number/${number}`);
  }
}
