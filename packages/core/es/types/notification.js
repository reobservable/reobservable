/**
 * notification type
 * @author yoyoyohamapi
 * @ignore created 2018-08-13 14:16:13
 */
import { LEVEL } from '../constants/notification';
export var NotificationLevel;
(function (NotificationLevel) {
    NotificationLevel[NotificationLevel["silent"] = LEVEL.silent] = "silent";
    NotificationLevel[NotificationLevel["erorr"] = LEVEL.error] = "erorr";
    NotificationLevel[NotificationLevel["all"] = LEVEL.all] = "all";
})(NotificationLevel || (NotificationLevel = {}));
//# sourceMappingURL=Notification.js.map