import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { BunyanLoggerConfig } from './bunyan-logger-config.ts';
import { LogLevel } from '../../types/index.ts';

describe('BunyanLoggerConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });
  it('should create a logger the complies with the logger interface', () => {
    process.env['OLO_APP_ENV'] = 'foo';
    process.env['NODE_ENV'] = 'bar';

    const config = new BunyanLoggerConfig();
    const logger = config.getLogger();

    expect(logger).toMatchObject({
      debug: expect.any(Function),
      info: expect.any(Function),
      warn: expect.any(Function),
      error: expect.any(Function),
      fatal: expect.any(Function),
    });
  });

  it('should create a logger with the development log level', () => {
    const config = new BunyanLoggerConfig({
      env: LogLevel.development,
    });
    const logger = config.getLogger();

    expect((logger as any)._level).toBe(20);
  });

  it('should create a logger with the production log level', () => {
    const config = new BunyanLoggerConfig({
      env: LogLevel.production,
    });
    const logger = config.getLogger();

    expect((logger as any)._level).toBe(30);
  });

  it('should create a logger with a configuration from environment variables', () => {
    process.env['OLO_APP_ENV'] = 'foo';
    process.env['NODE_ENV'] = LogLevel.production;
    process.env['OLO_APP_LOG_DIR'] = '/tmp';

    const config = new BunyanLoggerConfig({
      name: 'test-app',
    });
    const logger = config.getLogger();

    expect((logger as any)._level).toBe(30);
    expect((logger as any).streams.find((stream: any) => stream.path).path).toBe('/tmp/test-app-log.json');
  });

  it('should create a logger with a file stream', () => {
    const config = new BunyanLoggerConfig({
      env: LogLevel.production,
      path: '/tmp/olo-logger.json',
    });
    const logger = config.getLogger();
    expect((logger as any).streams.find((stream: any) => stream.path).path).toBe('/tmp/olo-logger.json');
  });

  it('should create a logger with a stdout stream', () => {
    const config = new BunyanLoggerConfig();
    const logger = config.getLogger();

    expect((logger as any).streams.find((stream: any) => stream.stream).stream).toBe(process.stdout);
  });
});
