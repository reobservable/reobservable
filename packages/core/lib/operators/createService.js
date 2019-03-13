"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * fromService creator
 * @author yoyoyohamapi
 * @ignore created 2018-08-13 14:26:55
 */
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var notification_1 = require("../constants/notification");
var actionTypes_1 = require("../constants/actionTypes");
var function_1 = require("../utils/function");
function partition(source$, predicate) {
    return [
        source$.pipe(operators_1.filter(predicate)),
        source$.pipe(operators_1.filter(function (v, i) { return !predicate(v, i); })),
    ];
}
exports.partition = partition;
/**
 * 创建 fromService creator
 * @param {Notification} notification
 */
function createFromService(notification, serviceConfig, store) {
    /**
     * fromServiceOperators
     * @param service
     * @param options
     */
    return function service(serviceName, service, options) {
        if (options === void 0) { options = {
            level: notification_1.LEVEL.silent,
            retry: 0,
            retryDelay: 0,
            loadingDelay: 0
        }; }
        var _a = options.templates || serviceConfig.templates || {}, _b = _a.success, success = _b === void 0 ? function_1.noop : _b, _c = _a.error, error = _c === void 0 ? function_1.noop : _c;
        var level = options.level, _d = options.retry, retry = _d === void 0 ? 0 : _d, _e = options.retryDelay, retryDelay = _e === void 0 ? 0 : _e, _f = options.loadingDelay, loadingDelay = _f === void 0 ? 0 : _f;
        var timer = null;
        if (loadingDelay > 0) {
            timer = setTimeout(function () { return store.dispatch({
                type: actionTypes_1.SERVICE_LOADING_START_ACTION,
                payload: {
                    service: serviceName
                }
            }); }, loadingDelay);
        }
        else {
            store.dispatch({
                type: actionTypes_1.SERVICE_LOADING_START_ACTION,
                payload: {
                    service: serviceName
                }
            });
        }
        var successNotificate = function (resp) { return level >= notification_1.LEVEL.all &&
            notification.success(success(resp)); };
        var errorNotificate = function (err) { return level >= notification_1.LEVEL.error &&
            notification.error(error(err)); };
        var service$ = (service instanceof rxjs_1.Observable)
            ? service.pipe(operators_1.retryWhen(function (error$) { return error$.pipe(operators_1.scan(function (count, err) {
                if (count >= retry) {
                    throw err;
                }
                else {
                    return count + 1;
                }
            }, 0), operators_1.delay(retryDelay)); }))
            : rxjs_1.from(service);
        var response$ = (typeof serviceConfig.isSuccess) === 'function'
            ? service$.pipe(operators_1.map(function (resp) {
                if (serviceConfig.isSuccess(resp)) {
                    return { resp: resp, success: true };
                }
                else {
                    var error_1 = serviceConfig.errorSelector ? serviceConfig.errorSelector(resp) : 'error';
                    return { error: error_1 };
                }
            }))
            : service$.pipe(operators_1.map(function (resp) {
                return { resp: resp, success: true };
            }), operators_1.catchError(function (error) {
                return rxjs_1.of({
                    error: serviceConfig.errorSelector ? serviceConfig.errorSelector(error) : error
                });
            }));
        var _g = partition(response$.pipe(operators_1.tap(function () { return timer && clearTimeout(timer); }), operators_1.shareReplay(1)), (function (_a) {
            var success = _a.success;
            return success;
        })), success$ = _g[0], error$ = _g[1];
        success$.subscribe({
            next: function (_a) {
                var resp = _a.resp;
                successNotificate(resp);
                store.dispatch({
                    type: actionTypes_1.SERVICE_LOADING_END_ACTION,
                    payload: {
                        service: serviceName
                    }
                });
            }
        });
        error$.subscribe({
            next: (function (_a) {
                var error = _a.error;
                errorNotificate(error);
                store.dispatch({
                    type: actionTypes_1.SERVICE_ERROR_SET_ACTION,
                    payload: {
                        error: error,
                        service: serviceName
                    }
                });
            })
        });
        return [
            success$,
            error$
        ];
    };
}
exports.default = createFromService;
//# sourceMappingURL=createService.js.map