import { AxiosRequestConfig, AxiosResponse, AxiosInstance,AxiosError } from "axios";
export interface RequestConfig { 
  show: boolean;
  loading?: boolean;
  loadingText?: string;
  message?: string;
  excludeLock?: boolean
  lockRequest?: boolean;
  isAuth?: boolean;
  isRepeatRequest?: boolean;
}

export interface RequestDefaultOptions  { 
  baseURL: string;
  requestType:"axios" | "fetch"
  withToken?: boolean;
  prefix?: string;
  retryCount?: number;
  refreshApi?: string;
  retryTimeout?: number;
  requestHooks?: RequestHooks;
  tokenPrefix?: string;
  headTokenKey?: string;
  isRetry?: boolean;
  startRetry?: boolean;
  repeatRequest: boolean;
  isTimeout?: boolean;
  isLockRequest?: boolean;
  refreshTokenKey?: string;
  stateRefresh?: boolean
  headers: Record<string, any>;
  withCredentials?: boolean;
  timeout?: number;
}
export interface RequestOptions { 
  params?:Record<string,any>,
  headers?:Record<string,any>,
  data?: Record<string,any>;
  url: string;
  file?: FormData;
  method?: string;
}
export interface RequestSendBodyOptions extends RequestDefaultOptions, RequestOptions,RequestInit, AxiosRequestConfig {
  controller: AbortController;
  signal: AbortSignal;
}
export interface RequestHooks {
  afterRequest<T >(data:DecryptBody<T> | EncryptionBody,config?:RequestConfig,response:AxiosResponse | Response):Promise<DecryptBody<T>> ;
  beforeRequest(options:RequestOptions,config?:RequestConfig):Promise<RequestSendBodyOptions>;
} 
export interface EncryptionBody {
  iv: string;
  data: string;
  key: string;
}


export type { AxiosInstance,AxiosResponse,AxiosRequestConfig,AxiosError,RequestDefaultOptions } 