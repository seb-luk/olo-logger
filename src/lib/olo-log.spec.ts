import { ActionType, Logger } from '../types/index.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { OloLog } from './olo-log.ts';

const getLogger = () => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
}) as Logger;

const context = {
  request: {
    method: 'GET',
    path: '/test',
  },
  response: {
    status: 200,
  },
};

const emptyContext = {
  request: {},
  response: {},
};

const emptyJsonFilter = () => emptyContext;
const jsonFilter = () => context;

describe('OloLog', () => {
  beforeEach(() => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);
    oloLog.resetJsonFilter(emptyJsonFilter);
  });

  it('should create an instance of OloLog with a bundled logger', () => {
    const oloLog = new OloLog();
    expect(oloLog).toBeInstanceOf(OloLog);
    expect(oloLog.logger).toMatchObject({
      debug: expect.any(Function),
      info: expect.any(Function),
      warn: expect.any(Function),
      error: expect.any(Function),
      fatal: expect.any(Function),
    });
  });

  it('should update an instance of OloLog with the provided logger', () => {
    const logger = getLogger();
    const oloLog = new OloLog();

    oloLog.resetLogger(logger);

    expect(oloLog).toBeInstanceOf(OloLog);
    expect(oloLog.logger).toBe(logger);
  });

  it('should update an instance of OloLog with the provided filter', () => {
    const oloLog = new OloLog();

    oloLog.resetJsonFilter(jsonFilter);

    expect(oloLog).toBeInstanceOf(OloLog);
    expect(oloLog.jsonFilter).toBe(jsonFilter);

  });

  it('should fallback to default filter if non supported option is provided.', () => {
    const oloLog = new OloLog();

    oloLog.resetJsonFilter({ filter: 'testFilter' as 'Koa' });

    expect(oloLog).toBeInstanceOf(OloLog);
    expect(oloLog.jsonFilter).toBeInstanceOf(Function);
  });

  it('should not reset filter when creating a new instance.', () => {
    const filterA = vi.fn(jsonFilter);

    const oloLogA = new OloLog();
    oloLogA.resetJsonFilter(filterA);

    const filterB = vi.fn(jsonFilter);
    const oloLogB = new OloLog({ jsonFilter: filterB });

    expect(oloLogB).toBeInstanceOf(OloLog);
    expect(oloLogB.jsonFilter).not.toBe(filterB);
    expect(oloLogB.jsonFilter).toBe(filterA);
  });

  it('should not reset logger when creating a new instance.', () => {
    const loggerA = getLogger();

    const oloLogA = new OloLog();
    oloLogA.resetLogger(loggerA);

    const loggerB = getLogger();
    const oloLogB = new OloLog({ logger: loggerB });

    expect(oloLogB).toBeInstanceOf(OloLog);
    expect(oloLogB.logger).not.toBe(loggerB);
    expect(oloLogB.logger).toBe(loggerA);
  });

  it('should call the request json log filter', () => {
    const requestJsonLogFilter = vi.fn(jsonFilter);
    const oloLog = new OloLog();
    oloLog.resetJsonFilter(requestJsonLogFilter);

    oloLog.logReadRequest('/test', '', context, 200);

    expect(requestJsonLogFilter).toHaveBeenCalledWith(context);
  });

  it("should call the bundled logger's info method with the correct message", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);
    oloLog.resetJsonFilter(jsonFilter);

    oloLog.logReadRequest('/test', '', { request: { method: 'GET' } }, 200);

    expect(logger.info).toHaveBeenCalledWith(
      { request: { method: 'GET', path: '/test' }, response: { status: 200 } },
      'GET request on /test | 200',
    );
  });

  it("should call the bundled logger's warn method with the correct message", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);
    oloLog.resetJsonFilter(jsonFilter);

    oloLog.logReadRequest('/test', '', context, 500);

    expect(logger.error).toHaveBeenCalledWith(context, 'GET request on /test | 500');
  });

  it("should call the bundled logger's error method with the correct message", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);
    oloLog.resetJsonFilter(jsonFilter);

    oloLog.logReadRequest('/test', '', context, 404);

    expect(logger.warn).toHaveBeenCalledWith(context, 'GET request on /test | 404');
  });

  it("should call the bundled logger's info method with the correct message and execution time", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);
    oloLog.resetJsonFilter(jsonFilter);

    oloLog.logReadRequest('/test', '', context, 200, 100);

    expect(logger.info).toHaveBeenCalledWith(context, 'GET request on /test | 200 | 100ms');
  });

  it("should call the bundled logger's error method with the correct message and execution time", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);

    oloLog.logReadRequest('/test', '', { foo: 'bar' }, 500, 200);

    expect(logger.error).toHaveBeenCalledWith(emptyContext, 'UNKNOWN request on /test | 500 | 200ms');
  });

  it("should call the bundled logger's error method with the correct message and execution time", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);

    oloLog.logReadRequest('/test', '', { foo: 'bar' }, 404, 300);

    expect(logger.warn).toHaveBeenCalledWith(emptyContext, 'UNKNOWN request on /test | 404 | 300ms');
  });

  it('should call the request json log filter with the correct context', () => {
    const requestJsonLogFilter = vi.fn(jsonFilter);
    const oloLog = new OloLog();
    oloLog.resetJsonFilter(requestJsonLogFilter);

    oloLog.logReadRequest('/test', '', context, 200);

    expect(requestJsonLogFilter).toHaveBeenCalledWith(context);
  });

  it("should call the bundled logger's info method with the correct message and query parameters", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);

    oloLog.logReadRequest('/test', 'foo=bar&baz=qux', { foo: 'bar' }, 200);

    expect(logger.info).toHaveBeenCalledWith(
      emptyContext,
      'UNKNOWN request on /test | 200 || requested: foo=bar&baz=qux',
    );
  });

  it("should call the bundled logger's warn method with the correct message and query parameters", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);

    oloLog.logReadRequest('/test', 'foo=bar&baz=qux', { foo: 'bar' }, 500);

    expect(logger.error).toHaveBeenCalledWith(
      emptyContext,
      'UNKNOWN request on /test | 500 || requested: foo=bar&baz=qux',
    );
  });

  it("should call the bundled logger's error method with the correct message and query parameters", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);

    oloLog.logReadRequest('/test', 'foo=bar&baz=qux', { foo: 'bar' }, 404);

    expect(logger.warn).toHaveBeenCalledWith(
      emptyContext,
      'UNKNOWN request on /test | 404 || requested: foo=bar&baz=qux',
    );
  });

  it('should call the request json log filter with the correct context', () => {
    const requestJsonLogFilter = vi.fn(jsonFilter);
    const oloLog = new OloLog();
    oloLog.resetJsonFilter(requestJsonLogFilter);

    oloLog.logWriteRequest('/test', [ActionType.create, ActionType.update], context, 200);

    expect(requestJsonLogFilter).toHaveBeenCalledWith(context);
  });

  it("should call the bundled logger's info method with the correct message and updates", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);
    oloLog.resetJsonFilter(jsonFilter);


    oloLog.logWriteRequest('/test', [ActionType.create, ActionType.update], context, 200);

    expect(logger.info).toHaveBeenCalledWith(
      context,
      'GET request on /test | 200 || requested: 1 creations, 1 updates',
    );
  });

  it("should call the bundled logger's warn method with the correct message and updates", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);

    oloLog.logWriteRequest('/test', [ActionType.create, ActionType.update], { foo: 'bar' }, 500);

    expect(logger.error).toHaveBeenCalledWith(
      emptyContext,
      'UNKNOWN request on /test | 500 || requested: 1 creations, 1 updates',
    );
  });

  it("should call the bundled logger's error method with the correct message and updates", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);

    oloLog.logWriteRequest('/test', [ActionType.create, ActionType.update], { foo: 'bar' }, 404);

    expect(logger.warn).toHaveBeenCalledWith(
      emptyContext,
      'UNKNOWN request on /test | 404 || requested: 1 creations, 1 updates',
    );
  });

  it('should call the request json log filter with the correct context', () => {
    const requestJsonLogFilter = vi.fn(jsonFilter);
    const oloLog = new OloLog();
    oloLog.resetJsonFilter(requestJsonLogFilter);

    oloLog.logWriteRequest('/test', 'create test', context, 200);

    expect(requestJsonLogFilter).toHaveBeenCalledWith(context);
  });

  it("should call the bundled logger's info method with the correct message and update", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);

    oloLog.logWriteRequest('/test', 'create test', { foo: 'bar' }, 200);

    expect(logger.info).toHaveBeenCalledWith(emptyContext, 'UNKNOWN request on /test | 200 || requested: create test');
  });

  it("should call the bundled logger's warn method with the correct message and update", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);

    oloLog.logWriteRequest('/test', 'create test', { foo: 'bar' }, 500);

    expect(logger.error).toHaveBeenCalledWith(emptyContext, 'UNKNOWN request on /test | 500 || requested: create test');
  });

  it("should call the bundled logger's error method with the correct message and update", () => {
    const logger = getLogger();
    const oloLog = new OloLog();
    oloLog.resetLogger(logger);

    oloLog.logWriteRequest('/test', '', { foo: 'bar' }, 404);

    expect(logger.warn).toHaveBeenCalledWith(emptyContext, 'UNKNOWN request on /test | 404');
  });
});
