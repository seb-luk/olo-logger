import { LogLevel } from './log.type.ts';

/**
 * Typeguard for Logger.
 *
 * @param logger - input that needs to be checked
 *
 * @returns true if input is a Logger
 */
export const isLogger = (logger: any): logger is Logger => {
  return (
    typeof logger === 'object' &&
    typeof logger.debug === 'function' &&
    typeof logger.info === 'function' &&
    typeof logger.warn === 'function' &&
    typeof logger.error === 'function' &&
    typeof logger.fatal === 'function'
  );
};

/**
 * Loggers are classes that provide an array of methods for logging messages embodied with different semantics.
 */
export interface Logger {
  /**
   * Logs messages relevant to debuging the application. Will execute when {@link LogLevel} `development` is active.
   * @param arg - contents to be logged. Exact signature depends on the implementation.
   */
  debug: (...arg: any) => void;

  /**
   * Logs messages with relevant information to the operation of the app. Will execute when {@link LogLevel} `development` or `production` is active.
   * @param arg - contents to be logged. Exact signature depends on the implementation.
   */
  info: (...arg: any) => void;

  /**
   * Logs messages with relevant information that indicate a happening that might indicate problems. Will execute when {@link LogLevel} `development` or `production` is active.
   * @param arg - contents to be logged. Exact signature depends on the implementation.
   */
  warn: (...arg: any) => void;

  /**
   * Logs messages with relavant information around a erroneus process in the app. Will execute when {@link LogLevel} `development` or `production` is active.
   * @param arg - contents to be logged. Exact signature depends on the implementation.
   */
  error: (...arg: any) => void;

  /**
   * Logs messages with relevant information regarding an erroneus state of the app that impedes the app from running. Will execute when {@link LogLevel} `development` or `production` is active.
   * @param arg - contents to be logged. Exact signature depends on the implementation.
   */
  fatal: (...arg: any) => void;
}

/**
 * Logger configurations configure a given loging library and provide a {@link Logger} based on that library.
 */
export interface LoggerConfiguration {
  /**
   * Returns the configured, ready to use logger.
   *
   * @param env - the currently active {@link LogLevel}
   * @returns an operational logger
   */
  getLogger: (env?: LogLevel) => Logger;
}

/**
 * A list of identifiers for all bundled and preconfigured loging libraries that are bundled with this library.
 */
export type SupportedLoggerConfiguationKeys = 'bunyan';

/**
 * Adds one additional identifier to the {@link SupportedLoggerConfiguationKeys} denoting the default library used when none is specified by the library instance.
 */
export type LoggerConfiguationKeys = SupportedLoggerConfiguationKeys | 'DEFAULT';
