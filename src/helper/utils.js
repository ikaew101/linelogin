import dayjs from "dayjs";
import "dayjs/locale/th";

export function checkNumberToDash(value) {
  if (Number(value) === -999) {
    return "-";
  }
}

export function checkNumberToZero(value) {
  if (Number(value) === -999 || Number(value) === 0) {
    return "0";
  }
}

export function checkNumberToLabel(value, label) {
  if (Number(value) === -999) {
    return label;
  }
}

export function toNumberFormat(value, min, max) {
  if (value) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
  }
}

export function delayPromise(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise completed!");
    }, time);
  });
}

export const hiddenSome = (styleDis, isHideText) => {
  for (
    let index = 0;
    index < document.querySelectorAll("#export").length;
    index++
  ) {
    const div = document.querySelectorAll("#export")[index];
    div.style.display = styleDis;
  }
  if (isHideText) document.querySelector("#hideText").style.display = styleDis;
};

export function toLastDateTimeTH(val) {
  const date = dayjs(val).locale("th");
  const dayName = date.format("ddd");
  const dayFormat = date.format("DD MMMM YYYY");
  const timeFormat = date.format("HH:mm");
  return `${dayName} ${dayFormat} ${timeFormat} น.`;
}

export function getQueryString(options) {
  let option = "";
  if (options) {
    option = "?";
    for (const key in options) {
      if (
        Object.hasOwnProperty.call(options, key) &&
        options[key] !== "" &&
        options[key] !== null
      ) {
        option += `${key}=${options[key]}&`;
      }
    }
    return option;
  }
}

export function toBigInt(val) {
  if (!val) {
    return null;
  }
  return BigInt(val).toString();
}
