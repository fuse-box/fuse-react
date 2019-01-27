import * as React from "react";
import { Fusion } from "../Fusion";
import { Route } from "./Route";
import { pathMatch } from "../Utils";
import { connect } from "../Connect";
import { Router } from "../storages/Router";
import { deepEqual } from "assert";

export interface ISwitchConfig {
	routes: {
		[key: string]: {
			exact?: boolean;
			component?: any;
		};
	};
}
interface IRouteItem {
	path: string;
	exact?: boolean;
	component: any;
	children?: any;
}

@connect({ router: Router })
export class Switch extends Fusion<
	{
		children?: any;
		router?: Router;
		placeholder?: JSX.Element;
		config?: ISwitchConfig;
	},
	any
> {
	init() {
		if (this.props.config) {
			this.renderConfig();
		} else {
			this.renderChildren();
		}
	}
	private findItem(items: Array<IRouteItem>) {
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			let match = item.path;
			if (!item.exact) {
				match += "(.*)";
			}
			const location = this.props.router.location;
			const params = pathMatch(location, match);
			if (params) {
				return {
					item,
					params
				};
			}
		}
	}

	private resetAll() {
		this.setState({
			placeholder: undefined,
			componentChildren: undefined,
			component: undefined,
			props: undefined,
			validReactComponent: undefined
		});
	}

	private evaluteFunctionResult(fnResult, match) {
		if (React.isValidElement(fnResult)) {
			if (this.state.validReactComponent !== fnResult) {
				return this.setState({ validReactComponent: fnResult, component: undefined });
			}
			return;
		}

		let targetComponent = fnResult;
		if (!React.Component.isPrototypeOf(targetComponent)) {
			targetComponent = fnResult.default;
			if (!React.Component.isPrototypeOf(targetComponent)) {
				const firstKey = Object.keys(fnResult)[0];

				targetComponent = fnResult[firstKey];
				if (!React.Component.isPrototypeOf(targetComponent)) {
					throw new Error("Suitable component was not found while loading an async router.");
				}
			}
		}

		if (this.state.component !== targetComponent) {
			this.setState({
				validReactComponent: undefined,
				component: targetComponent,
				props: { match: match }
			});
		}
	}

	private async renderItems(items: Array<IRouteItem>) {
		const foundItem = this.findItem(items);
		if (!foundItem) {
			return this.resetAll();
		}
		const { item, params } = foundItem;
		const location = this.props.router.location;
		if (item.children) {
			return this.setState({ componentChildren: item.children });
		}

		if (item.component) {
			const match = {
				params: params,
				location: location,
				path: item.path
			};

			if (React.Component.isPrototypeOf(item.component)) {
				const differentComponent = this.state.component !== item.component;
				const urlChanged = this.state.currentURL !== match.location;
				if (differentComponent || urlChanged) {
					return (
						this.isComponentMounted &&
						this.setState({
							currentURL: match.location,
							validReactComponent: undefined,
							component: item.component,
							props: { match: match }
						})
					);
				}
				return;
			}
			if (typeof item.component === "function") {
				this.resetAll();
				if (this.props.placeholder) {
					this.setState({ placeholder: this.props.placeholder });
				}

				const fnResult = await item.component(match);
				return this.evaluteFunctionResult(fnResult, match);
			}
		}
	}

	private renderChildren() {
		const children = [].concat(this.props.children);
		const items: Array<IRouteItem> = [];
		for (let i = 0; i < children.length; i++) {
			const item = children[i];
			if (item.type !== Route) {
				throw new Error("Children of Switch must have only Route object");
			}

			items.push({
				path: item.props.path,
				exact: item.props.exact,
				component: item.props.component,
				children: item.props.children
			});
		}
		return this.renderItems(items);
	}

	private renderConfig() {
		const items: Array<IRouteItem> = [];
		for (const path in this.props.config.routes) {
			const item = this.props.config.routes[path];
			items.push({
				path: path,
				exact: item.exact,
				component: item.component
			});
		}

		return this.renderItems(items);
	}

	public render() {
		if (this.state.componentChildren) {
			return this.state.componentChildren;
		}
		const Component = this.state.component;
		if (this.state.validReactComponent) {
			return this.state.validReactComponent;
		}
		if (Component) {
			return <Component {...this.state.props} />;
		}
		if (this.state.placeholder) {
			return this.state.placeholder;
		}
		return <span />;
	}
}
