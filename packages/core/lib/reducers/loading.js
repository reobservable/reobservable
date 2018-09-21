"use strict";
/**
 * loading reducer
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 12:36:49
 */
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
var actionTypes_1 = require("../constants/actionTypes");
function loading(state, action) {
    if (state === void 0) { state = { services: {}, flows: {} }; }
    var _a, _b, _c, _d, _e, _f;
    var type = action.type;
    var payload = action.payload ? action.payload : {};
    switch (type) {
        case actionTypes_1.LOADING_START_ACTION: {
            return __assign({}, state, { flows: __assign({}, state.flows, (_a = {}, _a[payload.flow] = true, _a)) });
        }
        case actionTypes_1.LOADING_END_ACTION: {
            return __assign({}, state, { flows: __assign({}, state.flows, (_b = {}, _b[payload.flow] = false, _b)) });
        }
        case actionTypes_1.SERVICE_LOADING_START_ACTION: {
            return __assign({}, state, { services: __assign({}, state.services, (_c = {}, _c[payload.service] = true, _c)) });
        }
        case actionTypes_1.SERVICE_LOADING_END_ACTION: {
            return __assign({}, state, { services: __assign({}, state.services, (_d = {}, _d[payload.service] = false, _d)) });
        }
        // flow 出错时，停止 loading
        case actionTypes_1.ERROR_SET_ACTION: {
            return __assign({}, state, { flows: __assign({}, state.flows, (_e = {}, _e[payload.flow] = false, _e)) });
        }
        case actionTypes_1.SERVICE_ERROR_SET_ACTION: {
            return __assign({}, state, { services: __assign({}, state.services, (_f = {}, _f[payload.service] = false, _f)) });
        }
        default:
            return state;
    }
}
exports.default = loading;
//# sourceMappingURL=loading.js.map