"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * reobservable core
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 10:24:23
 */
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var redux_observable_1 = require("redux-observable");
var redux_devtools_extension_1 = require("redux-devtools-extension");
var redux_1 = require("redux");
var mergeWith = require("lodash.mergewith");
var cloneDeep = require("lodash.clonedeep");
var invariant = require("invariant");
var loading_1 = require("./reducers/loading");
var error_1 = require("./reducers/error");
var action_1 = require("./utils/action");
var end_1 = require("./operators/end");
var endTo_1 = require("./operators/endTo");
var createService_1 = require("./operators/createService");
var actionTypes_1 = require("./constants/actionTypes");
var meta_1 = require("./constants/meta");
var function_1 = require("./utils/function");
var notification_1 = require("./constants/notification");
exports.NOTIFICATION_LEVEL = notification_1.LEVEL;
var Symbols = require("./constants/symbols");
exports.Symbols = Symbols;
var selectors = {};
var services = {};
var defaultNotification = {
    info: function_1.noop,
    success: function_1.noop,
    error: function_1.noop,
    warn: function_1.noop
};
var patchWith = function (objValue, srcValue) {
    if (Array.isArray(srcValue)) {
        return srcValue;
    }
};
var composeEnhancers = redux_devtools_extension_1.composeWithDevTools({
    actionSanitizer: action_1.actionSanitizer
});
exports.init = function (config) {
    var _a = config.models, models = _a === void 0 ? {} : _a, _b = config.redux, redux = _b === void 0 ? {} : _b, _c = config.notification, notification = _c === void 0 ? defaultNotification : _c;
    var epics = [];
    var reducers = {
        loading: loading_1.default,
        error: error_1.default
    };
    /**
     * 创建 model 的 reducer
     * @param {*} mode
     */
    var createReducer = function (model) {
        invariant(!reducers.hasOwnProperty(model.name), "model " + model.name + " has been defined");
        reducers[model.name] = function (state, action) {
            if (state === void 0) { state = model.state || {}; }
            var type = action.type;
            var payload = action_1.getPayload(action);
            switch (type) {
                case model.name + "/change": {
                    return __assign({}, state, payload);
                }
                case model.name + "/patch": {
                    return mergeWith(cloneDeep(state), payload, patchWith);
                }
                default: {
                    if (typeof model.reducers[type] === 'function') {
                        return model.reducers[type](state, payload);
                    }
                    var _a = type.split('/'), _ = _a[0], reducerName = _a[1];
                    if (typeof model.reducers[reducerName] === 'function') {
                        return model.reducers[reducerName](state, payload);
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
            var loadingStart$ = action$.pipe(redux_observable_1.ofType(actionType), operators_1.mapTo({
                type: actionTypes_1.LOADING_START_ACTION,
                payload: { flow: actionType }
            }));
            return rxjs_1.merge(loadingStart$, flow$.pipe(operators_1.mergeMap(function (action) {
                if (!action) {
                    return rxjs_1.throwError('inner error');
                }
                if (action[meta_1.FLOW_END_INDICATOR]) {
                    var hideAction = {
                        type: actionTypes_1.LOADING_END_ACTION,
                        payload: { flow: actionType }
                    };
                    return rxjs_1.of(action, hideAction);
                }
                else {
                    return rxjs_1.of(action);
                }
            }), operators_1.catchError(function (error) {
                return rxjs_1.of({
                    type: actionTypes_1.ERROR_SET_ACTION,
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
        selectors[model.name] = model.selectors || {};
    });
    // 配置 redux
    var epicMiddleware = redux_observable_1.createEpicMiddleware({
        dependencies: {
            end: end_1.default,
            endTo: endTo_1.default
        }
    });
    var extraMiddleware = redux.middleware
        ? Array.isArray(redux.middleware) ? redux.middleware : [redux.middleware]
        : [];
    var middleware = redux_1.applyMiddleware.apply(void 0, [epicMiddleware].concat(extraMiddleware));
    var rootReducer = redux_1.combineReducers(reducers);
    if (redux.rootReducer) {
        rootReducer = redux.rootReducer(rootReducer);
    }
    var store = redux_1.createStore(rootReducer, composeEnhancers(middleware));
    // 配置 services
    Object.keys(config.services || {}).forEach(function (key) {
        var service = config.services[key];
        services[key] = createService_1.default(notification, service, store);
    });
    epicMiddleware.run(redux_observable_1.combineEpics.apply(void 0, epics));
    return store;
};
function getSelectors(model) {
    return selectors[model];
}
exports.getSelectors = getSelectors;
function getService(service) {
    return services[service];
}
exports.getService = getService;
//# sourceMappingURL=index.js.map