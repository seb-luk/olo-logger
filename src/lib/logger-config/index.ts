import { LoggerConfiguationKeys, LoggerConfiguration, LoggerConfigurationOptions } from '../../types/index.ts';

import { BunyanLoggerConfig } from './bunyan-logger-config.ts';

/**
 * Set of all available logger configurators.
 */
export const LoggerConfigs: {
  [key in LoggerConfiguationKeys]: (params?: LoggerConfigurationOptions) => LoggerConfiguration;
} = {
  bunyan: (params?: LoggerConfigurationOptions) => new BunyanLoggerConfig(params),
  DEFAULT: (params?: LoggerConfigurationOptions) => new BunyanLoggerConfig(params),
};
