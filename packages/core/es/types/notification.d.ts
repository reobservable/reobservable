declare type notificate = (content: string, duration?: number) => void;
export interface Notification {
    info: notificate;
    success: notificate;
    warn: notificate;
    error: notificate;
}
export declare enum NotificationLevel {
    silent,
    erorr,
    all
}
export {};
