import { LogLevel, Logger, LoggerConfiguration, LoggerConfigurationOptions, isLogLevel } from '../../types/index.ts';
import { Stream, createLogger } from 'bunyan';

import dotenv from 'dotenv';

dotenv.config();

/**
 * Configures a bunyan instance according to the provided options.
 */
export class BunyanLoggerConfig implements LoggerConfiguration {
  /**
   * @private Fallback log level is non is provided in the getLogger method
   */
  private defaultEnv: LogLevel;

  /**
   * @private Preconfigured logger providers for every log level.
   */
  private loggers: { [key in LogLevel]: () => Logger };

  /**
   * @constructor Sets up the bunyan logger configurator according to the provided options.
   *
   * @param options.env - Sets the environment in which the app is runing and influences the amount of log output. This option overrides configurations done via the `NODE_ENV` or the `OLO_APP_ENV` environment variables.
   * @param options.name - An identifier or name of the logging application that will be part of the log messages. defaults to: 'OLO_APP'
   * @param options.path - If provided, log messages will be writen to the indicated log file. If no path is provided logging to file is disabled.
   *
   * @returns an instance of this configurator
   */
  constructor({
    env,
    name = 'OLO_APP',
    path = process.env[`${name}_LOG_DIR`] || process.env['OLO_APP_LOG_DIR']
      ? `${process.env[`${name}_LOG_DIR`] || process.env['OLO_APP_LOG_DIR']}/${name.toLowerCase()}-log.json`
      : undefined,
  }: LoggerConfigurationOptions = {}) {
    const getProdStream = (path?: string): Stream[] | undefined =>
      typeof path === 'string'
        ? [
            {
              type: 'rotating-file',
              level: 'info',
              path,
              period: '1w', // weekly rotation
              count: 5,
            },
            {
              level: 'info',
              stream: process.stdout,
            },
          ]
        : undefined;

    this.defaultEnv = isLogLevel(env)
      ? env
      : isLogLevel(process.env['OLO_APP_ENV'])
      ? process.env['OLO_APP_ENV']
      : isLogLevel(process.env['NODE_ENV'])
      ? process.env['NODE_ENV']
      : LogLevel.production;

    this.loggers = {
      development: () =>
        createLogger({
          name,
          level: 'debug',
        }),
      production: () =>
        createLogger({
          name,
          level: 'info',
          streams: getProdStream(path),
        }),
    };
  }

  /**
   * Returns the configured logger.
   *
   * @param env - requested log level, devaults to the log level defined in the constructor.
   *
   * @returns bunyan logger
   */
  public getLogger(env: LogLevel = this.defaultEnv): Logger {
    return this.loggers[env]();
  }
}
