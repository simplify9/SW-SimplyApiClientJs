import RequestOptions from './RequestOptions';

interface IClient {
  SimplyGetAsync: (url: string, options?: RequestOptions) => any;
  SimplyPostAsync: (url: string, body: any, options?: RequestOptions) => any;
  SimplyPutAsync: (url: string, body: any, options?: RequestOptions) => any;
  SimplyDeleteAsync: (url: string, body?: any, options?: RequestOptions) => any;
  SimplyPostFormAsync: (url: string, body: any, options?: RequestOptions) => any;
}

export default IClient;
