import * as React from "react";
import { RouterSubscription, IRoute } from "./Utils";

// global context
let CONTEXT: Record<string, any> = {};
let CONTEXT_LISTENERS = [];

const WINDOW_KEY = "__CONTEXT";
const WINDOW_KEY_CONTEXT_INITIALISED = "__CONTEXT_INITIALISED";

if (process.env.NODE_ENV === "development") {
	if (window[WINDOW_KEY]) CONTEXT = window[WINDOW_KEY];
	else window[WINDOW_KEY] = CONTEXT;
}

export function createContext<T>(context: T) {
	if (process.env.NODE_ENV === "development") {
		// we don't want context to be flushed on every HMR update
		if (window[WINDOW_KEY_CONTEXT_INITIALISED]) return;
		if (!window[WINDOW_KEY_CONTEXT_INITIALISED]) {
			window[WINDOW_KEY_CONTEXT_INITIALISED] = true;
			window[WINDOW_KEY] = context;
		}
	}
	CONTEXT = context;
}

export function setContext(user: (c) => any) {
	CONTEXT = user(CONTEXT);
	for (const fn of CONTEXT_LISTENERS) fn(CONTEXT);
	if (process.env.NODE_ENV === "development") {
		window[WINDOW_KEY] = CONTEXT;
	}
	return CONTEXT;
}

export function getContext() {
	return CONTEXT || {};
}

export function onContextChange(fn: (context) => void) {
	CONTEXT_LISTENERS.push(fn);
}
function removeContextChangeListener(fn) {
	const index = CONTEXT_LISTENERS.indexOf(fn);
	if (index > -1) {
		CONTEXT_LISTENERS.splice(index, 1);
	}
}

export interface IWithContext<T> {
	context: T;
	route: IRoute;
	setContext: (context) => any;
}

export function withContext<T>(
	ComponentFunction,
	actions?: Record<string, (getContext, setContext) => any>
): (props: Readonly<T>) => JSX.Element {
	const extraActionProps: any = {};
	if (actions) {
		for (const key in actions) {
			const actionFn = actions[key];
			extraActionProps[key] = actionFn(getContext, setContext);
		}
	}

	const fn = (props) => {
		const p = { ...props, ...extraActionProps, getContext, route: RouterSubscription.route, setContext };
		return <ComponentFunction {...p}></ComponentFunction>;
	};
	return fn as any;
}

export function createRoot<T>(ComponentFunction, actions?: Record<string, () => Record<string, any>>) {
	RouterSubscription.changed = () => {
		setContext((context) => {
			return { ...context, route: RouterSubscription.route };
		});
	};

	class LocalRoot extends React.Component<T> {
		constructor(props) {
			super(props);
			onContextChange(this.contextChanged);
		}

		contextChanged = () => {
			this.forceUpdate();
		};
		componentWillUnmount() {
			removeContextChangeListener(this.contextChanged);
		}

		render() {
			const p = { ...this.props, getContext, route: RouterSubscription.route, setContext };
			return <ComponentFunction {...p}></ComponentFunction>;
		}
	}
	return LocalRoot;
}
