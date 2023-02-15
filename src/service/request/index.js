import axios from "axios";
import { BASE_URL_weatherCity, BASE_URL_weather, TIMEOUT } from "./config";
import useWeatherStore from "src/stores/weatherStore/weatherStore";
import store from "src/stores/index";
import { Loading } from "quasar";
const pinia = store();

const weatherStore = useWeatherStore(pinia);
class HYRequest {
  constructor(baseURL, timeout = 10000) {
    this.instance = axios.create({
      baseURL,
      timeout,
    });
    this.instance.interceptors.request.use(
      (config) => {
        // Loading.show({
        //   message: "请求数据中，请稍等...",
        //   delay: 4000,
        // });
        return config;
      },
      (err) => {
        return err;
      }
    );
    this.instance.interceptors.response.use(
      (res) => {
        // Loading.hide();
        return res;
      },
      (err) => {
        // Loading.hide();
        return err;
      }
    );
  }

  request(config) {
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get(config) {
    return this.request({ ...config, method: "get" });
  }

  post(config) {
    return this.request({ ...config, method: "post" });
  }
}

export const getCity = new HYRequest(BASE_URL_weatherCity, TIMEOUT);
export const getTemp = new HYRequest(BASE_URL_weather, TIMEOUT);
