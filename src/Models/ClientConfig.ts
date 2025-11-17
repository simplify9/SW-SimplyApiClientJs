type ClientConfigModel = {
  baseUrl?: string;
  getBearer?: () => any;
  refreshAuth?: () => any;
  onAuthFail?: () => any;
  authType?: 'bearer';
  debug?: boolean;
};

export default ClientConfigModel;
