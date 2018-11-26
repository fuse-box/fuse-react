import * as React from "react";
import { ReactStorage } from "./Storage";
import { Store } from "./Store";

export function connect<TP, TC extends React.ComponentClass<TP>>(collection?: { [key: string]: any }): any {
	return (Target: any) => {
		const store = Store.getInstance();

		const constructedProps: any = {};
		if (collection) {
			for (const key in collection) {
				const cls = collection[key];
				if (store[key] === undefined) {
					store[key] = new cls(store);
					store[key].store = store;
					if (typeof store[key]["init"] === "function") {
						store[key]["init"]();
					}
				}
				constructedProps[key] = store[key];
			}
		}

		class FuseReactComponentWrapper extends React.Component {
			public isComponentMounted: boolean;
			componentWillMount() {
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
				this.isComponentMounted = false;
				const subscriptions = store.$subscriptions;
				for (const key in constructedProps) {
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
				return <Target {...this.props} {...constructedProps} />;
			}
		}
		return FuseReactComponentWrapper;
	};
}
