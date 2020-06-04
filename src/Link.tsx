import * as React from "react";
import { RouterSubscription, mergeQuery, navigate, pathMatch } from "./Utils";

export interface ILink {
	activeClass?: string;
	children: any;
	className?: string;
	exact?: boolean;
	query?: Record<string, string>;
	tag?: string;
	to?: string;
}
export function Link(props: ILink) {
	const classes = [];
	const route = RouterSubscription.route;
	if (props.className) classes.push(props.className);

	// to link might be missing
	if (props.to) {
		const matching = props.exact ? props.to : props.to + "(.*?)";
		if (pathMatch(route.path, matching)) classes.push("active");
	}

	if (props.query) {
		for (const key in props.query) {
			if (route.query[key] === props.query[key]) {
				!classes.includes("active") && classes.push("active");
			}
		}
	}
	const tag = props.tag ? props.tag : "a";
	const targetProps: any = {
		className: classes.join(" "),
		onClick: (e) => {
			e.preventDefault();
			if (props.to) navigate(props.to, props.query);
			else if (props.query) mergeQuery(props.query);
		},
	};
	if (tag === "a") targetProps.href = props.to;

	return React.createElement(tag, targetProps, props.children);
}

export function DivLink(props: ILink) {
	return <Link {...props} tag="div"></Link>;
}
