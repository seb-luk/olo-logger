import { SerializableObject } from 'olo-platform';

/**
 * Defines how the JSON object describing the request headers of a request context needs to look like to standardize request logging.
 */
export interface HeaderJsonLog {
  [key: string]: number | string | string[] | undefined;
}

/**
 * Defines how the JSON object describing the request part of a request context needs to look like to standardize request logging.
 */
export interface RequestJsonLog extends SerializableObject {
  method?: string;
  href?: {
    host?: string;
    path?: string;
    query?: { [key: string]: string | string[] | undefined };
  };
  headers?: HeaderJsonLog;
  client?: {
    remoteAddress?: string;
    remotePort?: number;
    ['user-agent']?: string;
  };
}

/**
 * Defines how the JSON object describing the response part of a request context needs to look like to standardize request logging.
 */
export interface ResponseJsonLog extends SerializableObject {
  status?: number;
  headers?: HeaderJsonLog;
  size?: {
    latency?: string;
    length?: number;
  };
}

/**
 * Defines how the JSON object describing a request context needs to look like to standardize request logging.
 */
export interface RequestContextJsonLog extends SerializableObject {
  request: RequestJsonLog;
  response: ResponseJsonLog;
}

/**
 * A function that takes an object containing logging metadata and returns a loggable object.
 */
export type JsonLogFilter = (obj: any) => SerializableObject;

/**
 * A function that takes an object containing request metadata and returns a loggable stadardized request metadata object.
 */
export type RequestJsonLogFilter = (obj: any) => RequestContextJsonLog;

/**
 * A list of identifiers for all bundled and preconfigured request json filters that are bundled with this library.
 */
export type SupportedJsonFilterKeys = 'Koa';

/**
 * Adds one additional identifier to the {@link SupportedJsonFilterKeys} denoting the default filter used when none is specified by the library instance.
 */
export type JsonFilterKeys = SupportedJsonFilterKeys | 'DEFAULT';
