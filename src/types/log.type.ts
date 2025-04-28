import { Logger, SupportedLoggerConfiguationKeys } from './logger-config.type.ts';
import { RequestJsonLogFilter, SupportedJsonFilterKeys } from './json-log-filter.type.ts';

/**
 * Typeguard for LogLevel.
 *
 * @param logger - input that needs to be checked
 *
 * @returns true if input is a LogLevel
 */
export const isLogLevel = (value: any): value is LogLevel => {
  return value === LogLevel.development || value === LogLevel.production;
};

/**
 * The log level describes the situation the app is runing in in terms of its impact to loging.
 */
export enum LogLevel {
  /**
   * The development level requires more extensive logging to aid bugfixing and development in general.
   */
  development = 'development',

  /**
   * The production level requires logging related to operation and security of the app and should be as concise as possible.
   */
  production = 'production',
}

/**
 * Set of options to configure the olo log service.
 */
export interface LoggerConfigurationOptions {
  logger?: SupportedLoggerConfiguationKeys;

  /**
   * Sets the environment in which the app is runing and influences the amount of log output. This option overrides configurations done via the `NODE_ENV` or the `OLO_APP_ENV` environment variables.
   */
  env?: LogLevel;

  /**
   * An identifier or name of the logging application that will be part of the log messages. defaults to: 'OLO_APP'
   */
  name?: string;

  /**
   * If provided, log messages will be writen to the indicated log file. If no path is provided logging to file is disabled.
   */
  path?: string;
}

/**
 * Set of options to configure the json filter that maps request objects to that json log output later on used by the loggger.
 */
export interface FilterConfiguration {
  /**
   * JsonFilter are functions that filter request meta data object down to the expected structure and scope for loging. JsonFilters for supported web frameworks can be enabled by identifier string (currently only the ctx object of the `Koa` framework is supported). Alternatively the a custom filter function can be provided here.
   */
  filter?: SupportedJsonFilterKeys;
}

/**
 * Set of dependencies to configure the olo log service.
 */
export interface LogDependencies {
  /**
   * Either defines a included logger (currently only `bunyan` is supported) by identifier string or takes a logger that fits the olo logger interface (see [Usage](#usage)).
   */
  logger?: LoggerConfigurationOptions | Logger;

  /**
   * Either defines a included filter (currently only `Koa` is supported) by identifier string or takes a filter that fits the olo filter interface (see [Usage](#usage)).
   */
  jsonFilter?: FilterConfiguration | RequestJsonLogFilter;
}
