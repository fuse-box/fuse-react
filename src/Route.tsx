import * as React from "react";
import { getContext, setContext } from "./Context";
import { RouterSubscription, pathMatch } from "./Utils";

export interface IRouteProps {
	children?: any;
	component: any;
	exact?: boolean;
	path: string;
}

export interface IComponentRoute {
	params: Record<string, string>;
	path: string;
	query: string;
}

export interface ISwitchProps {
	children?: any;
	notFound?: any;
}
export function Switch(props: ISwitchProps): any {
	const children = React.Children.toArray(props.children);

	const components = [];
	const route = RouterSubscription.route;
	children.map((routeChild: any, index) => {
		const childProps = routeChild.props;
		const path = childProps.exact ? childProps.path : childProps.path + "(.*?)";
		const matched = pathMatch(route.path, path);
		const Target = childProps.component;
		if (matched) {
			route.params = matched;

			const targetProps = {
				context: getContext(),
				route,
				setContext: setContext,
			};
			components.push(<Target key={index} {...targetProps} />);
		}
	});
	if (components.length === 0 && props.notFound) {
		const NotFoundComponent = props.notFound;
		const targetProps = {
			context: getContext(),
			route,
			setContext: setContext,
		};
		return <NotFoundComponent {...targetProps} />;
	}

	return components;
}
export function Route(props: IRouteProps) {
	return props.children;
}
