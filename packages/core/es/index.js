var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * reobservable core
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 10:24:23
 */
import { merge, of, throwError } from 'rxjs';
import { mergeMap, mapTo, catchError } from 'rxjs/operators';
import { createEpicMiddleware, ofType, combineEpics } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import * as mergeWith from 'lodash.mergewith';
import * as cloneDeep from 'lodash.clonedeep';
import * as invariant from 'invariant';
import loadingReducer from './reducers/loading';
import errorReducer from './reducers/error';
import { getPayload, actionSanitizer } from './utils/action';
import end from './operators/end';
import endTo from './operators/endTo';
import createService from './operators/createService';
import { LOADING_START_ACTION, LOADING_END_ACTION, ERROR_SET_ACTION } from './constants/actionTypes';
import { FLOW_END_INDICATOR } from './constants/meta';
import { noop } from './utils/function';
import { LEVEL as NOTIFICATION_LEVEL } from './constants/notification';
import * as Symbols from './constants/symbols';
import { isNil } from './utils/logic';
var selectors = {};
var services = {};
var notification = {
    info: noop,
    success: noop,
    error: noop,
    warn: noop
};
var patchWith = function (objValue, srcValue) {
    if (Array.isArray(srcValue)) {
        return srcValue;
    }
};
var composeEnhancers = composeWithDevTools({
    actionSanitizer: actionSanitizer
});
export var init = function (config) {
    var _a = config.models, models = _a === void 0 ? {} : _a, _b = config.redux, redux = _b === void 0 ? {} : _b;
    notification = __assign({}, notification, (config.notification || {}));
    var epics = [];
    var reducers = {
        loading: loadingReducer,
        error: errorReducer
    };
    /**
     * 创建 model 的 reducer
     * @param {*} mode
     */
    var createReducer = function (model) {
        invariant(!reducers.hasOwnProperty(model.name), "model " + model.name + " has been defined");
        reducers[model.name] = function (state, action) {
            if (state === void 0) { state = model.state; }
            var type = action.type;
            var payload = getPayload(action);
            switch (type) {
                case model.name + "/change": {
                    return __assign({}, state, payload);
                }
                case model.name + "/patch": {
                    return mergeWith(cloneDeep(state), payload, patchWith);
                }
                default: {
                    var _a = type.split('/'), _ = _a[0], reducerName = _a[1];
                    if (typeof model.reducers[reducerName] === 'function') {
                        return model.reducers[reducerName](state, payload);
                    }
                    if (typeof model.reducers[type] === 'function') {
                        return model.reducers[type](state, payload);
                    }
                    return state;
                }
            }
        };
    };
    /**
     * 创建 epic
     * @param actionType
     * @param flow
     */
    var createEpic = function (actionType, flow) {
        return function epic(action$, state$, dependencies) {
            var flow$ = flow(action$.ofType(actionType), action$, state$, dependencies);
            var loadingStart$ = action$.pipe(ofType(actionType), mapTo({
                type: LOADING_START_ACTION,
                payload: { flow: actionType }
            }));
            return merge(loadingStart$, flow$.pipe(mergeMap(function (action) {
                if (!action) {
                    return throwError('inner error');
                }
                if (action[FLOW_END_INDICATOR]) {
                    var hideAction = {
                        type: LOADING_END_ACTION,
                        payload: { flow: actionType }
                    };
                    return of(action, hideAction);
                }
                else {
                    return of(action);
                }
            }), catchError(function (error) {
                console.error("@reobservable[flow " + actionType + " error]", error);
                return of({
                    type: ERROR_SET_ACTION,
                    payload: { flow: actionType, error: error }
                });
            })));
        };
    };
    /**
     * 创建 flows
     * @param {*} model
     */
    var createFlows = function (model) {
        Object.keys(model.flows).forEach(function (flowName) {
            var flow = model.flows[flowName];
            var actionType = model.name + "/" + flowName;
            epics.push(createEpic(actionType, flow));
        });
    };
    Object.keys(models).forEach(function (key) {
        var model = __assign({ reducers: {}, selectors: {}, flows: {}, state: {} }, models[key]);
        createReducer(model);
        createFlows(model);
        selectors[model.name] = model.selectors;
    });
    // 配置 redux
    var epicMiddleware = createEpicMiddleware({
        dependencies: {
            end: end,
            endTo: endTo,
            services: services
        }
    });
    var extraMiddleware = redux.middleware
        ? Array.isArray(redux.middleware) ? redux.middleware : [redux.middleware]
        : [];
    var middleware = applyMiddleware.apply(void 0, [epicMiddleware].concat(extraMiddleware));
    var rootReducer = combineReducers(reducers);
    if (redux.rootReducer) {
        rootReducer = redux.rootReducer(rootReducer);
    }
    var store = createStore(rootReducer, composeEnhancers(middleware));
    // 配置 services
    Object.keys(config.services || {}).forEach(function (key) {
        var service = config.services[key];
        services[key] = createService(notification, service, store);
    });
    epicMiddleware.run(combineEpics.apply(void 0, epics));
    return store;
};
export function getSelectors(model) {
    return selectors[model];
}
export function getService(service) {
    return services[service];
}
export function notificate(type, message) {
    if (!isNil(message)) {
        return (notification[type] || notification.info)(message);
    }
}
export { NOTIFICATION_LEVEL, Symbols };
//# sourceMappingURL=index.js.map