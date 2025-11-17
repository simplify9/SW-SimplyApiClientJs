import ClientFactory, { setAxiosInstance } from './Services/Client';
import ApiResponse from './Models/ApiResponse';
import RequestOptions from './Models/RequestOptions';
import ClientConfig from './Models/ClientConfig';
import GetClientConfig, {
  SetBaseUrl,
  GetBaseUrl,
  SetAuthType,
  SetGetBearer,
  SetClientConfig,
  SetOnAuthFail,
  GetOnAuthFail,
  SetRefreshAuth,
} from './Services/ClientConfigProvider';

export {
  ApiResponse,
  RequestOptions,
  ClientConfig,
  ClientFactory,
  setAxiosInstance,
  GetClientConfig,
  GetBaseUrl,
  SetBaseUrl,
  SetAuthType,
  SetGetBearer,
  SetClientConfig,
  SetOnAuthFail,
  GetOnAuthFail,
  SetRefreshAuth,
};
