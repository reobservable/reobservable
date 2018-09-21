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
 * end operator
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 10:31:20
 */
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { FLOW_END_INDICATOR } from '../constants/meta';
/**
 * end operator
 * @param {function(value: Action): EndAction} project
 * @returns {Observable}
 * @method end
 */
export default function end(project) {
    return pipe(map(function (action) {
        var _a;
        return (__assign({}, project(action), (_a = {}, _a[FLOW_END_INDICATOR] = true, _a)));
    }));
}
//# sourceMappingURL=end.js.map