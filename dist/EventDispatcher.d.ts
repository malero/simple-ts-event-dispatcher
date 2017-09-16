export interface EventCallbackList {
    [index: string]: EventCallback[];
}
export declare class EventCallback {
    readonly fnc: any;
    readonly key: number;
    readonly once: boolean;
    readonly context: any;
    calls: number;
    constructor(fnc: any, key: number, once?: boolean, context?: any);
    call(...args: any[]): boolean;
}
export declare class EventDispatcher {
    private _listeners;
    private _lastKey;
    constructor();
    bind(event: string, fct: () => any, context?: any, once?: boolean): number;
    once(event: string, fct: () => any, context?: any): number;
    unbind(event: string, key?: number): boolean;
    unbindWithContext(event: string, context: any): number;
    getListener(event: string, key: number): EventCallback | undefined;
    trigger(event: string, ...args: any[]): void;
}
