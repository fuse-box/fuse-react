import * as React from "react";
export let Context: any = {};
export let Wrapper: any = {};
declare const FuseBox: any;
let storage: any;
if (FuseBox.isBrowser) {
    storage = window;
}
if (FuseBox.isServer) {
    storage = {};
}

storage.__Subscriptions = [];

export class StoreWrapper {
    private listeners: { [key: string]: Array<(value) => any> } = {}
    constructor(public store: any) { }

    public susbcribe(key: string, fn: (value) => any) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(fn);
    }
    public trigger(updates: { [key: string]: any }) {
        for (const key in updates) {
            if (this.listeners[key]) {
                this.listeners[key].forEach(fn => {
                    fn(updates[key])
                })
            }
        }
    }
}
export function createStore(myClassContext: new () => any) : StoreWrapper {
    Context = new myClassContext();
    if (typeof Context["init"] === "function") {
        Context["init"]();
    }
    Wrapper = new StoreWrapper(Context);
    return Wrapper;
}

export function getStore<T>(): T {
    return Context;
}

export function getSubscriptions(): Array<any> {
    return storage.__Subscriptions;
}
export function dispatch<Context>(obj: { [key: string]: any } | string, value?: (cnt: Context) => any) {
    const Subscriptions = storage.__Subscriptions;
    const store = getStore();
    let updates = obj;
    if (typeof obj === "object") {
        for (const key in obj) {
            if (typeof obj[key] === "function") {
                store[key] = obj[key](store);
            } else {
                store[key] = obj[key]
            }
        }
    }
    if (typeof obj === "string" && value) {
        store[obj] = value(store[obj]);
        updates = {};
        updates[obj] = store[obj];
    }
    Wrapper.trigger(updates);
    Subscriptions.forEach(component => {
        if (component._hasSubscriptions(updates)) {
            component._initialize();
            component.forceUpdate();
        }
    });
}


export function connect<TP, TC extends React.ComponentClass<TP>>(...args): any {
    return (Target: any) => {
        if (args.length) {
            Target["$_connected_store_props"] = args;
        }
        return Target;
    }
}