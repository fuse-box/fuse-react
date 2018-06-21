import * as React from "react";
import { Query } from './Query';

function contextWithRouter( obj : any){
    obj["router"] = {
        location : location.pathname,
        query : Query.get()
    }
    return obj;
}

export let Context: any = contextWithRouter({});
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
export function createStore(myClassContext: new () => any): StoreWrapper {
    Context = contextWithRouter(new myClassContext())
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

    let updates: any = obj;
    if (typeof obj === "object") {
        for (const key in obj) {
            if (typeof obj[key] === "function") {
                updates[key] = obj[key](store);
            } else {
                updates[key] = obj[key]
            }
        }
    }
    if (typeof obj === "string" && value) {
        updates = {};
        updates[obj] = value(store[obj]);
    }
    Wrapper.trigger(updates);
    const componentsForUpdate =[]
    Subscriptions.forEach(component => {
        if (component._hasSubscriptions(updates)) {
            componentsForUpdate.push(component)
        }
    });


    for (const key in updates) {
        store[key] = updates[key];
    }
    componentsForUpdate.forEach(item => {
        item._initialize();
        item.forceUpdate();
    });
}


export function connect<TP, TC extends React.ComponentClass<TP>>(...args): any {
    return (Target: any) => {
        if (args.length) {
            const collection = {};
            for (const i in args) {

                if (args.hasOwnProperty(i)) {
                    let key = args[i];
                    let deepEqual = false;
                    if (key[0] === "@") {
                        key = key.slice(1);
                        deepEqual = true;
                    }
                    collection[key] = { deep: deepEqual };
                }
            }
            Target["$_connected_store_props"] = collection;
        }
        return Target;
    }
}