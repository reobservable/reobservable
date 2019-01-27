/**
 * fromService creator
 * @author yoyoyohamapi
 * @ignore created 2018-08-13 14:26:55
 */
import { from, of, Observable } from 'rxjs';
import { catchError, map, filter, tap, shareReplay, retryWhen, scan, delay } from 'rxjs/operators';
import { LEVEL } from '../constants/notification';
import { SERVICE_ERROR_SET_ACTION, SERVICE_LOADING_END_ACTION, SERVICE_LOADING_START_ACTION } from '../constants/actionTypes';
import { noop } from '../utils/function';
export function partition(source$, predicate) {
    return [
        source$.pipe(filter(predicate)),
        source$.pipe(filter(function (v, i) { return !predicate(v, i); })),
    ];
}
/**
 * 创建 fromService creator
 * @param {Notification} notification
 */
export default function createFromService(notification, serviceConfig, store) {
    /**
     * fromServiceOperators
     * @param service
     * @param options
     */
    return function service(serviceName, service, options) {
        if (options === void 0) { options = {
            level: LEVEL.silent,
            retry: 0,
            retryDelay: 0
        }; }
        store.dispatch({
            type: SERVICE_LOADING_START_ACTION,
            payload: {
                service: serviceName
            }
        });
        var _a = options.templates || serviceConfig.templates || {}, _b = _a.success, success = _b === void 0 ? noop : _b, _c = _a.error, error = _c === void 0 ? noop : _c;
        var level = options.level, _d = options.retry, retry = _d === void 0 ? 0 : _d, _e = options.retryDelay, retryDelay = _e === void 0 ? 0 : _e;
        var successNotificate = function (resp) { return level >= LEVEL.all &&
            notification.success(success(resp)); };
        var errorNotificate = function (err) { return level >= LEVEL.error &&
            notification.error(error(err)); };
        var service$ = (service instanceof Observable)
            ? service.pipe(retryWhen(function (error$) { return error$.pipe(scan(function (count, err) {
                if (count >= retry) {
                    throw err;
                }
                else {
                    return count + 1;
                }
            }, 0), delay(retryDelay)); }))
            : from(service);
        var response$ = (typeof serviceConfig.isSuccess) === 'function'
            ? service$.pipe(map(function (resp) {
                if (serviceConfig.isSuccess(resp)) {
                    return { resp: resp, success: true };
                }
                else {
                    var error_1 = serviceConfig.errorSelector ? serviceConfig.errorSelector(resp) : 'error';
                    return { error: error_1 };
                }
            }))
            : service$.pipe(map(function (resp) {
                return { resp: resp, success: true };
            }), catchError(function (error) {
                return of({
                    error: serviceConfig.errorSelector ? serviceConfig.errorSelector(error) : error
                });
            }));
        var _f = partition(response$.pipe(shareReplay(1)), (function (_a) {
            var success = _a.success;
            return success;
        })), success$ = _f[0], error$ = _f[1];
        return [
            success$.pipe(tap(function (_a) {
                var resp = _a.resp;
                successNotificate(resp);
                store.dispatch({
                    type: SERVICE_LOADING_END_ACTION,
                    payload: {
                        service: serviceName
                    }
                });
            })),
            error$.pipe(tap(function (_a) {
                var error = _a.error;
                errorNotificate(error);
                store.dispatch({
                    type: SERVICE_ERROR_SET_ACTION,
                    payload: {
                        error: error,
                        service: serviceName
                    }
                });
            }))
        ];
    };
}
//# sourceMappingURL=createService.js.map