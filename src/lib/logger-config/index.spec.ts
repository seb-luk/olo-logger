import { describe, expect, it } from 'vitest';

import { BunyanLoggerConfig } from './bunyan-logger-config.ts';
import { LoggerConfigs } from './index.ts';

describe('LoggerConfigs', () => {
  it('should return a bunyan configurator', () => {
    const bunyanConfig = LoggerConfigs.bunyan();

    expect(LoggerConfigs.bunyan).toBeDefined();
    expect(bunyanConfig).toBeInstanceOf(BunyanLoggerConfig);
  });

  it('should return a default configurator', () => {
    const bunyanConfig = LoggerConfigs.DEFAULT();

    expect(LoggerConfigs.DEFAULT).toBeDefined();
    expect(bunyanConfig).toBeInstanceOf(BunyanLoggerConfig);
  });
});
