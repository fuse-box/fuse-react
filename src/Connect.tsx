import * as React from "react";
import { ReactStorage } from "./Storage";
import { Store } from "./Store";

function lowerCaseFirstLetter(string) {
	return string.charAt(0).toLowerCase() + string.slice(1);
}
function initStore(collection?: { [key: string]: any } | Array<any>) {
	const store = Store.getInstance();
	const constructedProps: any = {};

	function initKey(key: string, cls: any) {
		if (store[key] === undefined) {
			store[key] = new cls(store);
			store[key].store = store;
			if (typeof store[key]["init"] === "function") {
				store[key]["init"]();
			}
		}
		constructedProps[key] = store[key];
		return constructedProps[key];
	}

	if (collection) {
		if (Array.isArray(collection)) {
			collection.map((classObject, index) => {
				if (classObject["name"]) {
					const serviceKey = lowerCaseFirstLetter(classObject["name"]);
					const serviceInstance = initKey(serviceKey, classObject);
					if (serviceInstance && index === 0) {
						constructedProps["service"] = serviceInstance;
					}
				}
			});
		} else {
			for (const key in collection) {
				const cls = collection[key];
				initKey(key, cls);
			}
		}
	}
	return { store, constructedProps };
}

export function connect<TP, TC extends React.ComponentClass<TP>>(
	collection?: { [key: string]: any } | Array<ReactStorage>
): any {
	return (Target: any) => {
		class FuseReactComponentWrapper extends React.Component {
			public isComponentMounted: boolean;
			public constructedProps;
			componentWillMount() {
				const { store, constructedProps } = initStore(collection);
				this.constructedProps = constructedProps;
				const subscriptions = store.$subscriptions;
				for (const key in constructedProps) {
					if (!subscriptions[key]) {
						subscriptions[key] = constructedProps[key];
					}
					const storage: ReactStorage = subscriptions[key];
					storage.$components.push(this);
				}
			}

			componentDidMount() {
				this.isComponentMounted = true;
			}

			componentWillUnmount() {
				const store = Store.getInstance();
				this.isComponentMounted = false;
				const subscriptions = store.$subscriptions;
				for (const key in this.constructedProps) {
					if (subscriptions[key]) {
						const storage: ReactStorage = subscriptions[key];
						const index = storage.$components.indexOf(this);
						if (index > -1) {
							storage.$components.splice(index, 1);
						}
					}
				}
			}

			render() {
				return <Target {...this.props} {...this.constructedProps} />;
			}
		}
		return FuseReactComponentWrapper;
	};
}
