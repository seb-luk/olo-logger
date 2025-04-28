import { Context, Request, Response } from 'koa';
import { RequestContextJsonLog, RequestJsonLog, ResponseJsonLog } from '../../types/index.ts';

/**
 * High tevel typeguard for Koa Context.
 *
 * @param ctx - input that needs to be checked
 *
 * @returns true if input structure conforms sufficiently with Koa Context
 */
const isKoaContext = (ctx: any): ctx is Context =>
  typeof ctx === 'object' && typeof ctx.request === 'object' && typeof ctx.response === 'object';

/**
 * Takes a Koa request object (`ctx.request`) and filters it down to a request metadata object.
 *
 * @param ctx - Context object used by Koa
 *
 * @returns request metadata object
 */
const koaRequestJsonLogFilter = (request?: Request): RequestJsonLog => ({
  method: request?.method,
  href: {
    host: request?.origin,
    path: request?.path,
    query: request?.query,
  },
  headers: request?.headers,
  client: {
    remoteAddress: request?.socket.remoteAddress,
    remotePort: request?.socket?.remotePort,
    'user-agent': request?.headers?.['user-agent'],
  },
});

/**
 * Takes a Koa response object (`ctx.response`) and filters it down to a response metadata object.
 *
 * @param response - response object used by Koa
 *
 * @returns response metadata object
 */
const koaResponseJsonLogFilter = (response?: Response): ResponseJsonLog => ({
  status: response?.status,
  headers: response?.headers,
  size: {
    latency: response?.headers?.['x-response-time'] as string | undefined,
    length: response?.length,
  },
});

/**
 * Takes an object checks if its a Koa request context object (`ctx`) and filters it down to a request metadata object.
 *
 * @param ctx - Context object used by Koa
 *
 * @returns request metadata object
 */
export const KoaContextJsonLogFilter = (ctx: any): RequestContextJsonLog =>
  isKoaContext(ctx)
    ? {
        request: JSON.parse(JSON.stringify(koaRequestJsonLogFilter(ctx.request))),
        response: JSON.parse(JSON.stringify(koaResponseJsonLogFilter(ctx.response))),
      }
    : {
        request: {},
        response: {},
      };
