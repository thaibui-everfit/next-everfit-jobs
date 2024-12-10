import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosError,
} from "axios";
import { isEmpty, assign } from "lodash";

import { API_KEY, BASE_API } from "@/constants/app";

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

const singletonEnforcer = Symbol();

class AxiosClient {
  axiosClient: AxiosInstance;
  static axiosClientInstance: AxiosClient;

  constructor(enforcer: symbol) {
    if (enforcer !== singletonEnforcer) {
      throw new Error("Cannot initialize Axios client single instance");
    }

    this.axiosClient = axios.create({
      baseURL: BASE_API,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    });

    this.axiosClient.interceptors.request.use(
      (configure: AdaptAxiosRequestConfig) => configure,
      (error: AxiosError) => Promise.reject(error)
    );

    this.axiosClient.interceptors.response.use(
      (response: AxiosResponse<Record<string, unknown>>) => {
        if (response.data && Array.isArray(response.data)) {
          response.data.dataObject = response.data.reduce(
            (dataObject: Record<string, unknown>, item: { id: string }) => {
              dataObject[item.id] = item;
              return dataObject;
            },
            {}
          );
        }
        return response;
      },
      (error: AxiosError<Record<string, unknown>>) => {
        if (
          error.response?.data?.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          error.response.data.errorsObject = error.response.data.errors.reduce(
            (errorObject: Record<string, unknown>, item: { field: string }) => {
              errorObject[item.field] = item;
              return errorObject;
            },
            {}
          );
        }
        return Promise.reject(error.response);
      }
    );
  }

  static get instance(): AxiosClient {
    if (!this.axiosClientInstance) {
      this.axiosClientInstance = new AxiosClient(singletonEnforcer);
    }

    return this.axiosClientInstance;
  }

  setHeader(userToken: string | null): void {
    this.axiosClient.defaults.headers.common["x-xsrf-token"] = userToken;
    this.axiosClient.defaults.withCredentials = !!userToken;
  }

  get(resource: string, slug = "", config: AxiosRequestConfig = {}) {
    const requestURL = isEmpty(slug) ? resource : `${resource}/${slug}`;
    return this.axiosClient.get(
      requestURL,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  post(resource: string, data: object, config: AxiosRequestConfig = {}) {
    return this.axiosClient.post(
      resource,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  update(resource: string, data: object, config: AxiosRequestConfig = {}) {
    return this.axiosClient.put(
      resource,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  put(resource: string, data: object, config: AxiosRequestConfig = {}) {
    return this.axiosClient.put(
      resource,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  patch(resource: string, data: object, config: AxiosRequestConfig = {}) {
    return this.axiosClient.patch(
      resource,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  delete(resource: string, data: object, config: AxiosRequestConfig = {}) {
    return this.axiosClient.delete(resource, {
      params: data,
      ...assign(config, this.axiosClient.defaults.headers),
    });
  }
}

export default AxiosClient.instance;
