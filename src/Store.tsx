import * as React from "react";
export let Context: any = {};
declare const FuseBox: any;
let storage: any;
if (FuseBox.isBrowser) {
    storage = window;
}
if (FuseBox.isServer) {
    storage = {};
}

storage.__Subscriptions = [];

export function createStore(myClassContext: new () => any) {
    Context = new myClassContext();
    if (typeof Context["init"] === "function") {
        Context["init"]();
    }
}

export function getStore<T>(): T {
    return Context;
}

export function getSubscriptions(): Array<any> {
    return storage.__Subscriptions;
}
export function dispatch<Context>(obj: { [key: string]: any } | string, value?: (cnt : Context) => any) {
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
    if ( typeof obj === "string" && value){
        store[obj] = value(store[obj]);
        updates = {};
        updates[obj] = store[obj];
    }
    
    Subscriptions.forEach(component => {
        if (component._hasSubscriptions(updates)) {
            component._initialize(updates);
            component.forceUpdate();
        }
    });
}


export function connect<TP, TC extends React.ComponentClass<TP>>(...args): any {
    return (Target: any) => {
        if (args.length) {
            Target["$_connected_store_props"] = args;
        }

        return class extends React.Component {
            render() {
                const store = getStore();
                const storeProps: any = {}
                args.forEach(key => {
                    if (store[key] !== undefined) { storeProps[key] = store[key] }
                });
                return <Target {...this.props} {...storeProps} />
            }
        }
    }
}