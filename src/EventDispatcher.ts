
export interface EventCallbackList {
	[index: string]: EventCallback[];
}


export class EventCallback {
    public calls: number;
    constructor(
        public readonly fnc: any,
        public readonly key: number,
        public readonly once: boolean,
        public readonly context?: any,
    ) {
        this.calls = 0;
    }

    call(...args: any[]): boolean {
        if(this.once && this.calls > 0)
            return false;

        this.fnc.apply(this.context, ...args);
        this.calls += 1;
        return true;
    }
}

export type EventDispatcherCallback = (...args: any[]) => any;


export class EventDispatcher  {
    private _listeners: EventCallbackList;
    private _lastKey: number;

    constructor() {
        this._lastKey = 0;
        this._listeners = {};
    }

    bind(event: string, fct: EventDispatcherCallback, context?: any, once?: boolean): number {
        once = once || false;
        this._lastKey++;
        this._listeners[event] = this._listeners[event] || [];
        this._listeners[event].push(new EventCallback(fct, this._lastKey, once, context));
        return this._lastKey;
    }

    once(event: string, fct: EventDispatcherCallback, context?: any): number {
        return this.bind(event, fct, context, true);
    }

    unbind(event: string, key?: number): boolean {
        if(event in this._listeners === false) return false;
        if(key) {
            for(const cb of this._listeners[event]) {
                if(key == cb.key) {
                    this._listeners[event].splice(this._listeners[event].indexOf(cb), 1);
                    return true;
                }
            }
        } else {
            this._listeners[event] = [];
            return true;
        }
        return false;
    }

    unbindWithContext(event: string, context: any): number {
        if(event in this._listeners === false) return 0;
        let toRemove: EventCallback[] = [],
            cnt = 0;

        for(const cb of this._listeners[event]) {
            if(context == cb.context) {
                toRemove.push(cb);
            }
        }

        for(const cb of toRemove) {
            this._listeners[event].splice(this._listeners[event].indexOf(cb), 1);
            cnt++;
        }
        return cnt;
    }

    getListener(event: string, key: number): EventCallback | undefined {
        for(const cb of this._listeners[event]) {
            if(key == cb.key)
                return cb;
        }
    }

    trigger(event: string, ...args: any[]): void {
        if(event in this._listeners === false) return;

        for(let i = 0; i < this._listeners[event].length; i++) {
            const cb: EventCallback = this._listeners[event][i];

            // We need to unbind callbacks before they're called to prevent
            // infinite loops if the event is somehow triggered within the
            // callback
            if(cb.once) {
                this.unbind(event, cb.key);
                i--;
            }

            cb.call(args);
        }
    }
}
