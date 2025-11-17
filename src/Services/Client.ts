import ApiResponse from '../Models/ApiResponse';
import ClientConfig from '../Models/ClientConfig';

import IClient from '../Models/IClient';
import RequestOptions from '../Models/RequestOptions';

import GetClientConfig, { GetOnAuthFail, GetRefreshAuth } from './ClientConfigProvider';

// Allow users to pass their own axios instance to avoid import issues
let userProvidedAxios: any = null;

export const setAxiosInstance = (axiosInstance: any) => {
  userProvidedAxios = axiosInstance;
};

const ClientFactory = (clientConfig?: ClientConfig) => {
  let Axios: any = null;

  // Strategy 1: Use user-provided axios instance
  if (userProvidedAxios) {
    Axios = userProvidedAxios;
  }
  
  // Strategy 2: Try to get axios from global scope (if user included it globally)
  else if (typeof window !== 'undefined' && (window as any).axios) {
    Axios = (window as any).axios;
  }
  
  // Strategy 3: Try to require axios dynamically (only in Node.js environments)
  else if (typeof require !== 'undefined') {
    try {
      // tslint:disable-next-line:no-eval
      const axiosModule = eval('require')('axios');
      Axios = axiosModule.default || axiosModule;
    } catch (requireError: any) {
      // Continue to error below
    }
  }

  if (!Axios) {
    throw new Error(`
      Axios not found! Please use one of these solutions:
      
      1. Call setAxiosInstance() before using the client:
         import axios from 'axios';
         import { setAxiosInstance } from '@simplify9/simplyapiclient';
         setAxiosInstance(axios);
      
      2. Or add axios to window globally:
         window.axios = axios; // (NOT require('axios') in browser!)
    `);
  }

  if (typeof Axios.create !== 'function') {
    throw new Error(`
      Invalid axios instance! Please ensure you're passing a valid axios instance.
      
      Usage example:
      import axios from 'axios';
      import { setAxiosInstance } from '@simplify9/simplyapiclient';
      setAxiosInstance(axios);
    `);
  }

  const serverAxios = Axios.create();

  serverAxios.interceptors.request.use(
    (config: any) => {
      const clientConfiguration = clientConfig ? clientConfig : GetClientConfig()

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
    (error: any) => {
      return Promise.reject(error);
    },
  );


  serverAxios.interceptors.response.use(
    (response:any):any => {
      return {
        status: response.status,
        succeeded: response.status >= 200 && response.status < 300,
        data: response.data,
        error: response.statusText,
      };
    },
    async (error: any) => {
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

          if (!originalRequest._retry)
          {
            originalRequest._retry = true;
            const refreshAuth = GetRefreshAuth();
            if (refreshAuth)
            {
              await refreshAuth();
              await delay(2000);
              return serverAxios(originalRequest);
            }
          }


          const OnAuthFail = GetOnAuthFail();
          if (OnAuthFail) { OnAuthFail!();}
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
      return await serverAxios.post(
        uri,
        body,
      );
    },
    SimplyPutAsync: async (uri: string, body: any, options?: RequestOptions): Promise<ApiResponse> => {

      return await serverAxios.put(
        uri,
        body,
      );
    },
    SimplyDeleteAsync: async (uri: string, body?: any, options?: RequestOptions): Promise<ApiResponse> => {
      return await serverAxios.delete(uri);
    },
    SimplyPostFormAsync: async (uri: string, formData: any, options?: RequestOptions): Promise<any>=> {// Promise<ApiResponse> => {
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


function delay(time:any) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export default ClientFactory;