import Axios from 'axios';

import ApiResponse from '../Models/ApiResponse';
import ClientConfig from '../Models/ClientConfig';

import IClient from '../Models/IClient';
import RequestOptions from '../Models/RequestOptions';

import GetClientConfig, { GetOnAuthFail, GetRefreshAuth } from './ClientConfigProvider';

const ClientFactory = (clientConfig?: ClientConfig) => {
  const serverAxios = Axios.create();

  serverAxios.interceptors.request.use(
    (config) => {
      const clientConfiguration = clientConfig ? clientConfig : GetClientConfig();

      if (
        clientConfiguration.authType &&
        clientConfiguration.authType === 'bearer' &&
        clientConfiguration.getBearer &&
        clientConfiguration.getBearer() != null
      ) {
        config.headers.Authorization = `Bearer ${clientConfiguration.getBearer()}`;
      }

      config.baseURL = clientConfiguration.baseUrl;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  serverAxios.interceptors.response.use(
    (response: any): any => {
      return {
        status: response.status,
        succeeded: response.status >= 200 && response.status < 300,
        data: response.data,
        error: response.statusText,
      };
    },
    async (error) => {
      // const originalRequest = error.config;
      // if (401 === error.response.status && !originalRequest._retry) {
      // 	originalRequest._retry = true;

      // } else {
      // 	return Promise.reject(error);
      // }

      if (error.response) {
        const r = error.response;
        const originalRequest = error.config;
        if (401 === r.status) {
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            const refreshAuth = GetRefreshAuth();
            if (refreshAuth) {
              await refreshAuth();
              await delay(2000);
              return serverAxios(originalRequest);
            }
          }

          const OnAuthFail = GetOnAuthFail();
          if (OnAuthFail) {
            OnAuthFail!();
          }
        }
        return {
          status: r.status,
          succeeded: r.status >= 200 && r.status < 300,
          data: r.data,
          error: r.statusText,
        };
      } else if (error.request) {
        return {
          status: 0,
          succeeded: false,
          data: null,
          error: 'no response',
        };
      } else {
        return {
          status: 0,
          succeeded: false,
          data: null,
          error: error.message,
        };
      }
    },
  );

  const client: IClient = {
    SimplyGetAsync: async (uri: string, options?: RequestOptions): Promise<ApiResponse> => {
      return await serverAxios.get(uri);
    },
    SimplyPostAsync: async (uri: string, body: any, options?: RequestOptions): Promise<ApiResponse> => {
      return await serverAxios.post(uri, body);
    },
    SimplyPutAsync: async (uri: string, body: any, options?: RequestOptions): Promise<ApiResponse> => {
      return await serverAxios.put(uri, body);
    },
    SimplyDeleteAsync: async (uri: string, body?: any, options?: RequestOptions): Promise<ApiResponse> => {
      return await serverAxios.delete(uri);
    },
    SimplyPostFormAsync: async (uri: string, formData: any, options?: RequestOptions): Promise<any> => {
      // Promise<ApiResponse> => {
      return await serverAxios({
        method: 'post',
        url: uri,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  };

  return client;
};

function delay(time: any) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export default ClientFactory;
