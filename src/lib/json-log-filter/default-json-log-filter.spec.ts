import { describe, expect, it } from 'vitest';

import { DefaultJsonLogFilter } from './default-json-log-filter.ts';

describe('DefaultJsonLogFilter', () => {
  it('should filter out logs that do not match the filter', () => {
    const logJSON = {
      message: 'This is a log message.',
      level: 'info',
      timestamp: new Date(),
    };

    const filteredLog = DefaultJsonLogFilter(logJSON);

    expect(filteredLog).toEqual({ request: {}, response: {} });
  });

  it('should filter out logs that match the filter', () => {
    const logJSON = {
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
    };

    const filteredLog = DefaultJsonLogFilter(logJSON);

    expect(filteredLog).toEqual(logJSON);
  });
});
