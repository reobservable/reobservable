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
import { LOADING_START_ACTION, ERROR_SET_ACTION, SERVICE_ERROR_SET_ACTION, SERVICE_LOADING_START_ACTION } from '../constants/actionTypes';
export default function error(state, action) {
    if (state === void 0) { state = { flows: {}, services: {} }; }
    var _a, _b, _c, _d;
    var type = action.type;
    var payload = action.payload ? action.payload : {};
    switch (type) {
        // flow 开始，重置错误
        case LOADING_START_ACTION: {
            return __assign({}, state, { flows: __assign({}, state.flows, (_a = {}, _a[payload.flow] = null, _a)) });
        }
        case SERVICE_LOADING_START_ACTION: {
            return __assign({}, state, { services: __assign({}, state.flows, (_b = {}, _b[payload.service] = null, _b)) });
        }
        case ERROR_SET_ACTION: {
            return __assign({}, state, { flows: __assign({}, state.flows, (_c = {}, _c[payload.flow] = payload.error, _c)) });
        }
        case SERVICE_ERROR_SET_ACTION: {
            return __assign({}, state, { services: __assign({}, state.services, (_d = {}, _d[payload.service] = payload.error, _d)) });
        }
        default:
            return state;
    }
}
//# sourceMappingURL=error.js.map