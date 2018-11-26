import { Store } from "../Store";
import { Fusion } from "../Fusion";
import { Query } from "../Query";

export function navigate(path, query?: { [key: string]: any }) {
	const store = Store.getInstance();
	if (!store.router) {
		throw new Error("You need to connect at least one Switch or Link object");
	}
	if (query) {
		path = `${path}${Query.createString(query)}`;
	}
	window.history.pushState({}, "", path);
	store.router.onBrowserUpdate(path);
}

export function mergeQuery(query?: { [key: string]: any }, doDispatch: boolean = true) {
	const store = Store.getInstance();
	if (!store.router) {
		throw new Error("You need to connect at least one Switch or Link object");
	}
	const data = Query.merge(query);
	const path = `${location.pathname}${data.str}`;
	window.history.pushState({}, "", path);
	if (doDispatch) {
		store.router.onBrowserUpdate(path);
	}
}

export function setQuery(query?: { [key: string]: any }, doDispatch: boolean = true) {
	const store = Store.getInstance();
	if (!store.router) {
		throw new Error("You need to connect at least one Switch or Link object");
	}
	const data = Query.createString(query);
	const path = `${location.pathname}${data}`;
	window.history.pushState({}, "", path);
	if (doDispatch) {
		store.router.onBrowserUpdate(path);
	}
}

export class Route extends Fusion<
	{
		children?: any;
		path: string;
		exact?: boolean;
		component?: any;
	},
	{}
> {
	public render() {
		return this.props.children;
	}
}
