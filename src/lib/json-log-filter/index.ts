import { JsonFilterKeys, RequestJsonLogFilter } from '../../types/index.ts';

import { DefaultJsonLogFilter } from './default-json-log-filter.ts';
import { KoaContextJsonLogFilter } from './koa-context-json-log-filter.ts';

/**
 * Set of all available filters for loggable meta data objects.
 */
export const JsonLogFilters: {
  [key in JsonFilterKeys]: RequestJsonLogFilter;
} = {
  Koa: KoaContextJsonLogFilter,
  DEFAULT: DefaultJsonLogFilter,
};
