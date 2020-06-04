import * as pathToRegexp from "path-to-regexp";
import { Query } from "./Query";

export function pathMatch(location: string, path: string) {
	const keys: any = [];
	const re = pathToRegexp(path, keys);
	let matched = re.exec(location);
	if (matched) {
		const params: any = {};
		for (let k = 0; k < keys.length; k++) {
			let item = keys[k];
			params[item.name] = matched[k + 1];
		}
		return params;
	}
}

export interface IRoute {
	params?: Record<string, string>;
	path: string;
	query: Record<string, string>;
}
class RouterSubscriptionClass {
	public route: IRoute;

	public changed: (subscription: RouterSubscriptionClass) => void;

	constructor() {
		this.updateRoute();
		window.onpopstate = history["onpushstate"] = (e) => {
			this.onChange();
		};
	}

	private updateRoute() {
		this.route = {
			path: window.location.pathname,
			query: Query.get(),
		};
	}

	onChange = () => {
		this.updateRoute();
		if (this.changed) this.changed(this);
	};
}

const RouterSubscription = new RouterSubscriptionClass();

export function navigate(path, query?: { [key: string]: any }) {
	if (query) {
		path = `${path}${Query.createString(query)}`;
	}

	window.history.pushState({}, "", path);

	RouterSubscription.onChange();
}
export function mergeQuery(query?: { [key: string]: any }) {
	const data = Query.merge(query);
	const path = `${location.pathname}${data.str}`;
	window.history.pushState({}, "", path);
	RouterSubscription.onChange();
}
export function setQuery(query?: { [key: string]: any }) {
	const data = Query.createString(query);
	const path = `${location.pathname}${data}`;
	window.history.pushState({}, "", path);
	RouterSubscription.onChange();
}

export { RouterSubscription };
