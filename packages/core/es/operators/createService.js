/**
 * fromService creator
 * @author yoyoyohamapi
 * @ignore created 2018-08-13 14:26:55
 */
import { from, of } from 'rxjs';
import { catchError, map, filter, tap, shareReplay } from 'rxjs/operators';
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
        if (options === void 0) { options = { level: LEVEL.silent }; }
        store.dispatch({
            type: SERVICE_LOADING_START_ACTION,
            payload: {
                service: serviceName
            }
        });
        var _a = options.templates || serviceConfig.templates || {}, _b = _a.success, success = _b === void 0 ? noop : _b, _c = _a.error, error = _c === void 0 ? noop : _c;
        var level = options.level;
        var successNotificate = function (resp) { return level >= LEVEL.all &&
            notification.success(success(resp)); };
        var errorNotificate = function (err) { return level >= LEVEL.error &&
            notification.error(error(err)); };
        var response$ = (typeof serviceConfig.isSuccess) === 'function'
            ? from(service).pipe(map(function (resp) {
                if (serviceConfig.isSuccess(resp)) {
                    return { resp: resp, success: true };
                }
                else {
                    var error_1 = serviceConfig.errorSelector ? serviceConfig.errorSelector(resp) : 'error';
                    return { error: error_1 };
                }
            }))
            : from(service).pipe(map(function (resp) {
                return { resp: resp, success: true };
            }), catchError(function (error) {
                return of({
                    error: serviceConfig.errorSelector ? serviceConfig.errorSelector(error) : error
                });
            }));
        var _d = partition(response$.pipe(shareReplay(1)), (function (_a) {
            var success = _a.success;
            return success;
        })), success$ = _d[0], error$ = _d[1];
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