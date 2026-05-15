import { AxiosRequestConfig, AxiosResponse, AxiosInstance,AxiosError } from "axios";
export type ResponseCodeMode = "data" | "response" | "auto";
type RequestPayload = Record<string, unknown> | FormData | EncryptionBody;
export interface RequestConfig { 
  show: boolean;
  loading?: boolean;
  loadingText?: string;
  message?: string;
  codeMode?: ResponseCodeMode;
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
  requestHooks: RequestHooks;
  codeMode?: ResponseCodeMode;
  tokenPrefix?: string;
  headTokenKey?: string;
  isRetry?: boolean;
  startRetry?: boolean;
  repeatRequest: boolean;
  isTimeout?: boolean;
  isLockRequest?: boolean;
  refreshTokenKey?: string;
  stateRefresh?: boolean
  headers: Record<string, string>;
  withCredentials?: boolean;
  timeout?: number;
}
export interface RequestOptions { 
  params?:Record<string, unknown>,
  headers?:Record<string, string>,
  data?: RequestPayload;
  url: string;
  file?: FormData;
  method?: string;
}
export interface RequestSendBodyOptions extends RequestDefaultOptions, RequestOptions,RequestInit, AxiosRequestConfig {
  controller: AbortController;
  signal: AbortSignal;
}
export interface RequestHooks {
  afterRequest<T >(data:DecryptBody<T> | EncryptionBody,config?:RequestConfig,response?:AxiosResponse | Response):Promise<DecryptBody<T>> ;
  beforeRequest(options:RequestOptions,config?:RequestConfig):Promise<RequestSendBodyOptions>;
} 
export interface EncryptionBody {
  iv: string;
  data: string;
  key: string;
}


export type { AxiosInstance,AxiosResponse,AxiosRequestConfig,AxiosError,RequestDefaultOptions } 
