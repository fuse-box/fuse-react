import * as React from "react";
import { getStore, getSubscriptions } from './Store';
import * as equal from "deep-equal";
const Subscriptions = getSubscriptions();

export class Fusion<IProps, IState, IStore = null> extends React.Component<IProps, IState>  {
    public state: IState = {} as IState;
    public props: IProps;
    public store: IStore = getStore();

    public _hasSubscriptions(obj: any) {
        const subscriptions = this.getConnectedStoreKeys();
        const store = getStore();
        if (subscriptions) {
            for (const key in obj) {
                const hasSubscription = subscriptions[key];
                if (hasSubscription) {
                    if (!hasSubscription.deep) {
                        return true;
                    }
                    if (hasSubscription.deep && !equal(store[key], obj[key])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private getConnectedStoreKeys(): Array<string> {
        return this.constructor['$_connected_store_props'] || {};
    }

    public _initialize() {
        if (typeof this["init"] === "function") {
            this["init"].apply(this, [this.props]);
            return true;
        }
        return false;
    }

    componentWillMount() {
        const keys = this.getConnectedStoreKeys();
        if (Object.keys(keys).length) {
            Subscriptions.push(this);
        }
        this._initialize();
    }

    componentWillUnmount() {
        const index = Subscriptions.indexOf(this);
        if (index > -1) {
            Subscriptions.splice(index, 1);
        }
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        this._initialize();
    }
}

