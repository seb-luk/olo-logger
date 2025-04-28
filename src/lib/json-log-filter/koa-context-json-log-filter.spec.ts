import { describe, expect, it } from 'vitest';

import { KoaContextJsonLogFilter } from './koa-context-json-log-filter.ts';

describe('KoaContextJsonLogFilter', () => {
  it('should return an empty object if the input is udefined', () => {
    const input = undefined;

    const result = KoaContextJsonLogFilter(input);

    expect(result).toEqual({
      request: {},
      response: {},
    });
  });

  it('should return an empty object if the input is not a Koa context', () => {
    const input = {};

    const result = KoaContextJsonLogFilter(input);

    expect(result).toEqual({
      request: {},
      response: {},
    });
  });

  it('should return a request metadata object if the input is a Koa context', () => {
    const input = {
      request: {
        method: 'GET',
        path: '/test',
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        socket: {
          remoteAddress: '127.0.0.1',
          remotePort: 8080,
        },
      },
      response: {
        status: 200,
        headers: {
          'content-type': 'text/html',
        },
        length: 100,
      },
    };

    const result = KoaContextJsonLogFilter(input);

    expect(result).toEqual({
      request: {
        method: 'GET',
        href: {
          path: '/test',
        },
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        client: {
          remoteAddress: '127.0.0.1',
          remotePort: 8080,
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      },
      response: {
        status: 200,
        headers: {
          'content-type': 'text/html',
        },
        size: {
          length: 100,
        },
      },
    });
  });
});
