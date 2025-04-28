# olo-logger

olo-logger is a loging service that provides a preconfigured logger as well as ready to use methods around common loging cases, to help you hit the ground runing.

## Installation

Navigate to your project folder and enter the following in you terminal:

```sh
npm i olo-logger --save
```

## Usage

`new OloLog().logger` returns the included logger.

```ts
const logger = new OloLog().logger;
logger.info('Log this info-message!');
```

The logger provides methods to log messages with the following semantics:

- debuging information: `logger.debug('var reuestStatus value: '+ reuestStatus);`
- information about app processes: `logger.info('Database startup completed.');`
- information about potentialy problematic app processes `logger.warning('Requested content is not available.');`
- information about erroneus app processes `logger.error('Request could not be completed.');`
- information about erroneus app state that keeps the app from runing `fatal('Database is not avaialable.');`

### Request logging

olo-logo provides methods for logging read and write requests in humand readable format as well as JSON loging of relevant request metadata (see also [Configuration](#configuration)).

#### Logging read requests

```ts
new OloLog().logReadRequest = (
  route, // request url
  query, // url and query parameters relevant for the read qeuery
  context, // object containing request methadata for JSON logging
  status, // http status code of the request
  execution, // duration of request handling
);
```

#### Logging write requests

```ts
new OloLog().logWriteRequest = (
  route, // request url
  query, // array of requested actions noted as `CREATE`, `UPDATE`, `DELETE`, `PUBLISH`, or a custom description of update
  context, // object containing request methadata for JSON logging.
  status, // http status code of the request
  execution, // duration of request handling
);
```

## Configuration

olo-logger is implemented as a singleton to make sure there exists only one instance in any runing app. So the service needs to be configured at the first instantiation.

```ts
const log = new OloLog({
  logger: {
    logger: 'bunyan',
    env: 'production',
    name: 'myApp',
    path: '/app/logfiles/log.json',

    jsonFilter: 'Koa',
  },
  jsonFilter: {
    filter: 'Koa',
  },
});
```

If a reconfiguration at a later stage is needed the methods `new OloLog().resetLogger(logger)` and `new OloLog().resetJsonFilter(jsonFilter)` are available.

### Configuration options overview

| Option            | Description                                                                                                                                                                                                                                                                                                                           | Supported Values            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| logger.logger     | Either defines a included logger (currently only `bunyan` is supported) by identifier string or takes a logger that fits the olo logger interface (see [Usage](#usage)).                                                                                                                                                              | `bunyan` or logger instance |
| logger.env        | Sets the environment in which the app is runing and influences the amount of log output. This option overrides configurations done via the `NODE_ENV` or the `OLO_APP_ENV` environment variables.                                                                                                                                     | `development`, `production` |
| logger.name       | An identifier or name of the logging application that will be part of the log messages. Defaults to `OLO_APP`.                                                                                                                                                                                                                        | any string                  |
| logger.path       | If provided, log messages will be writen to the indicated log file. If no path is provided logging to file is disabled.                                                                                                                                                                                                               | file path string            |
| jsonFilter.filter | JsonFilter are functions that filter request meta data object down to the expected structure and scope for loging. JsonFilters for supported web frameworks can be enabled by identifier string (currently only the ctx object of the `Koa` framework is supported). Alternatively the a custom filter function can be provided here. | `Koa` or a filter function  |
