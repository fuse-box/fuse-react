import * as React from "react";
import { connect } from "../Connect";
import { Router } from "../storages/Router";
import { pathMatch } from "../Utils";
import { navigate } from "./Route";

@connect({ router: Router })
export class Link extends React.Component<{
	to: string;
	router?: Router;
	match?: string;
	children?: any;
	onClick?: (e: Event) => any;
	exact?: boolean;
	className?: string;
	activeClassName?: string;
	render?: (active, navigate) => JSX.Element;
}> {
	private navigate() {
		const path = this.props.to;
		navigate(this.props.to);
	}
	linkClicked(e) {
		e.preventDefault();
		if (this.props.onClick) {
			this.props.onClick(e);
		}
		this.navigate();
	}
	public render() {
		let toLink = this.props.match || this.props.to;
		if (!this.props.exact) {
			toLink += "(.*)";
		}
		const matched = pathMatch(this.props.router.location, toLink);

		if (this.props.render) {
			return this.props.render(matched !== undefined, () => this.navigate());
		} else {
			const classes = [];
			if (this.props.className) {
				classes.push(this.props.className);
			}
			if (matched && this.props.activeClassName) {
				classes.push(this.props.activeClassName);
			}
			return (
				<a className={classes.join(" ")} onClick={e => this.linkClicked(e)} href={this.props.to}>
					{this.props.children}
				</a>
			);
		}
	}
}
