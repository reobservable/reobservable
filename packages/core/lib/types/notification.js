"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * notification type
 * @author yoyoyohamapi
 * @ignore created 2018-08-13 14:16:13
 */
var notification_1 = require("../constants/notification");
var NotificationLevel;
(function (NotificationLevel) {
    NotificationLevel[NotificationLevel["silent"] = notification_1.LEVEL.silent] = "silent";
    NotificationLevel[NotificationLevel["erorr"] = notification_1.LEVEL.error] = "erorr";
    NotificationLevel[NotificationLevel["all"] = notification_1.LEVEL.all] = "all";
})(NotificationLevel = exports.NotificationLevel || (exports.NotificationLevel = {}));
//# sourceMappingURL=Notification.js.map