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
 * end operator
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 10:31:20
 */
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var meta_1 = require("../constants/meta");
/**
 * end operator
 * @param {function(value: Action): EndAction} project
 * @returns {Observable}
 * @method end
 */
function end(project) {
    return rxjs_1.pipe(operators_1.map(function (action) {
        var _a;
        return (__assign({}, project(action), (_a = {}, _a[meta_1.FLOW_END_INDICATOR] = true, _a)));
    }));
}
exports.default = end;
//# sourceMappingURL=end.js.map