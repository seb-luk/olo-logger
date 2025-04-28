import {
  ActionType,
  FilterConfiguration,
  LogDependencies,
  Logger,
  LoggerConfigurationOptions,
  RequestJsonLogFilter,
  isLogger,
} from '../types/index.ts';

import { JsonLogFilters } from './json-log-filter/index.ts';
import { LoggerConfigs } from './logger-config/index.ts';
import { SerializableObject } from 'olo-platform';

/**
 * A loging service that provides a preconfigured logger as well as ready to use methods around common loging cases, to help you hit the ground runing.
 */
export class OloLog {
  /**
   * @static
   * @private Bundled logger
   */
  private static log: Logger;

  /**
   * Returns the included logger.
   *
   * @returns bundled logger
   */
  public get logger() { return OloLog.log };

  public resetLogger(logger: LoggerConfigurationOptions | Logger = {}): Logger {
    OloLog.log = isLogger(logger)
      ? logger
      : LoggerConfigs[logger?.logger ?? 'DEFAULT'](logger).getLogger();

    return this.logger;
  }

  /**
   * @static
   * @private Log object filter used for all request logging.
   */
  private static requestJsonLogFilter: RequestJsonLogFilter;

  public get jsonFilter(): RequestJsonLogFilter {
    return OloLog.requestJsonLogFilter;
  }

  public resetJsonFilter(filter: FilterConfiguration | RequestJsonLogFilter = {}): RequestJsonLogFilter {
    OloLog.requestJsonLogFilter = typeof filter === 'function'
      ? filter
      : JsonLogFilters[filter.filter ?? 'DEFAULT'] ?? JsonLogFilters.DEFAULT;

    return this.jsonFilter;
  }

  /**
   * @constructor Sets up a OloLog service.
   *
   * @param logger - either a logger that should be used or a set of options to configure a bundled logger.
   *
   * @returns an instance of this service
   */
  constructor(dependencies: LogDependencies = {}) {
    if (OloLog.log === undefined) {
      this.resetLogger(dependencies.logger);
    }

    if (OloLog.requestJsonLogFilter === undefined) {
      this.resetJsonFilter(dependencies.jsonFilter);
    }
  }

  /**
   * @todo Move this to to-be-created OloRequest class and redefine status param to MessageCode
   * @private Logs a message with the appropriate semantics.
   *
   * @param msg - message text in natural language
   * @param context - JSON object with metadata related to the message.
   * @param status - http status code representing message semantics.
   */
  private logMessage(msg: string, context: SerializableObject, status: number): void {
    if (status >= 200 && status <= 300) {
      OloLog.log.info(context, msg);
    } else if (status >= 500) {
      OloLog.log.error(context, msg);
    } else {
      OloLog.log.warn(context, msg);
    }
  };

  /**
   * @todo Move this to to-be-created OloRequest class and redefine status param to MessageCode
   * @private Returns a message text in natural language form request metadata.
   *
   * @param route - request url
   * @param method - request method, e.g. `GET`
   * @param status - http status code of the request
   * @param execution - duration of request handling
   *
   * @returns message text in natural language
   */
  private composeRequestLogText(
    route: string,
    method: string = 'UNKNOWN',
    status: number,
    execution?: number,
  ): string { return `${method} request on ${route} | ${status}${execution ? ` | ${execution}ms` : ''}`; }

  /**
   * @todo Move this to to-be-created OloRequest class and redefine status param to MessageCode
   * Composes a read request log messages and logs it together with JSON request metadata.
   *
   * @param route - request url
   * @param query - url and query parameters relevant for the read qeuery
   * @param context - object containing request methadata for JSON logging
   * @param status - http status code of the request
   * @param execution - duration of request handling
   */
  public logReadRequest(
    route: string,
    query: string,
    context: any,
    status: number,
    execution?: number,
  ): void {
    const logJson = OloLog.requestJsonLogFilter(context);

    const msg = `${this.composeRequestLogText(route, logJson.request?.method, status, execution)}${
      query ? ` || requested: ${query}` : ''
    }`;
    this.logMessage(msg, logJson, status);
  };

  /**
   * @todo Move this to to-be-created OloRequest class and redefine status param to MessageCode
   * Composes a write request log messages and logs it together with JSON request metadata.
   *
   * @param route - request url
   * @param query - array of requested {@link ActionType} noted as `CREATE`, `UPDATE`, `DELETE`, `PUBLISH`, or a custom description of update
   * @param context - object containing request methadata for JSON logging
   * @param status - http status code of the request
   * @param execution - duration of request handling
   */
  public logWriteRequest(
    route: string,
    query: ActionType[] | string,
    context: any,
    status: number,
    execution?: number,
  ): void {
    const actionTypeLabelMap: { [key in ActionType]: string } = {
      [ActionType.create]: 'creations',
      [ActionType.update]: 'updates',
      [ActionType.delete]: 'deletions',
      [ActionType.publish]: 'publish',
    };

    const updates: { [key in ActionType]: number } = (Array.isArray(query) ? query : []).reduce(
      (acc: { [key in ActionType]: number }, type) => {
        acc[type] = acc[type] ?? 0;
        acc[type] += 1;
        return acc;
      },
      { [ActionType.create]: 0, [ActionType.update]: 0, [ActionType.delete]: 0, [ActionType.publish]: 0 },
    );

    const updateString = Array.isArray(query)
      ? (Object.values(ActionType) as ActionType[])
        .reduce((message, key) => {
          updates[key] = updates[key] ?? 0;
          const updatedMessage =
            updates[key] > 0 ? `${message}${updates[key]} ${actionTypeLabelMap[key] ?? ''}, ` : message;
          return updatedMessage;
        }, '')
          .slice(0, -2)
      : query;

    const logJson = OloLog.requestJsonLogFilter(context);

    const msg = `${this.composeRequestLogText(route, logJson.request.method, status, execution)}${
      updateString ? ` || requested: ${updateString}` : ''
    }`;
    this.logMessage(msg, logJson, status);
  };
}
