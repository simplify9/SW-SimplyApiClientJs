import ClientConfigModel from '../Models/ClientConfig';

let ClientConfig: ClientConfigModel = {
  baseUrl: '',
};

export const SetOnAuthFail = (callBack: () => any) => {
  ClientConfig = {
    ...GetClientConfig(),
    onAuthFail: callBack,
  };
};

export const SetBaseUrl = (url: string) =>
  SetClientConfig({
    ...GetClientConfig(),
    baseUrl: url,
  });

export const SetAuthType = (authType?: 'bearer') =>
  SetClientConfig({
    ...GetClientConfig(),
    authType,
  });

export const SetGetBearer = (callBack: () => any) =>
  SetClientConfig({
    ...GetClientConfig(),
    getBearer: callBack,
  });

export const SetRefreshAuth = (callBack: () => any) =>
  SetClientConfig({
    ...GetClientConfig(),
    refreshAuth: callBack,
  });

export const SetClientConfig = (config: ClientConfigModel) => (ClientConfig = config);

export const GetOnAuthFail = () => ClientConfig.onAuthFail;
export const GetRefreshAuth = () => ClientConfig.refreshAuth;
export const GetBaseUrl = () => ClientConfig.baseUrl;

const GetClientConfig = () => ClientConfig;

export default GetClientConfig;
