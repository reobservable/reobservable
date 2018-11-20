import { Store, Middleware, Reducer } from 'redux';
import Model, { Selectors } from './types/Model';
import { ServiceConfig, ServiceFunc } from './operators/createService';
import { Notification } from './types/Notification';
import { LEVEL as NOTIFICATION_LEVEL } from './constants/notification';
import * as Symbols from './constants/symbols';
interface Models {
    [modelName: string]: Model<any>;
}
interface ReduxConfig {
    middleware?: Middleware | [Middleware];
    rootReducer?: (reducer: Reducer) => Reducer;
}
interface Config {
    models?: Models;
    redux?: ReduxConfig;
    notification?: Notification;
    services?: {
        [serviceName: string]: ServiceConfig<any, any>;
    };
}
export declare type InitFunc = (config: Config) => Store;
export declare const init: InitFunc;
export declare function getSelectors(model: string): Selectors<any, any>;
export declare function getService(service: string): ServiceFunc<any, any>;
export declare function notificate(type: string, message: any): any;
export { NOTIFICATION_LEVEL, Symbols };
