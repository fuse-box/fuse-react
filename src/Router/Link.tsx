import * as React from "react";
import { Fusion } from '../Fusion';
import { dispatch, connect } from '../Store';
import { pathMatch } from '../Utils';
import { Query } from '../Query';

@connect('@router')
export class Link extends Fusion<{
    to: string,
    children?: any,
    onClick?: (e: Event) => any;
    exact?: boolean,
    className?: string;
    activeClassName?: string;
    render?: (active, navigate) => JSX.Element,
}, any, any> {
    private navigate() {
        const path = this.props.to;
        window.history.pushState({}, "", path);
        dispatch("router", () => ({
            location: path,
            query: Query.get()
        }));
    }
    linkClicked(e) {
        e.preventDefault();
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        this.navigate();
    }
    public render() {
        let toLink = this.props.to;
        if (!this.props.exact) {
            toLink += "(.*)";
        }
        const matched = pathMatch(this.store.router.location, toLink)
        if (this.props.render) {
            return this.props.render(matched !== undefined, () => this.navigate())
        } else {
            const classes = [];
            if( this.props.className){
                classes.push(this.props.className)
            }
            if ( matched && this.props.activeClassName){
                classes.push(this.props.activeClassName)
            }
            return <a
                className={classes.join(' ')}
                onClick={e => this.linkClicked(e)}
                href={this.props.to}>{this.props.children}
            </a>
        }
    }
}
