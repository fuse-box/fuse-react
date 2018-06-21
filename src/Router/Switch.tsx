import * as React from "react";
import { Fusion } from '../Fusion';
import { Route } from './Route';
import { pathMatch } from '../Utils';
import { connect } from '../Store';

@connect("@router")
export class Switch extends Fusion<{ children: any }, {}, any> {
    public render() {
        return this.props.children.map((item, i) => {
            if (item.type !== Route) {
                throw new Error('Children of Switch must have only Route object')
            }
            let match = item.props.match;
            if( !item.props.exact){
                match += "(.*)";
            }
            const location = this.store.router.location;
            const params = pathMatch(location, match);
            if (params) {
                if (item.props.component) {
                    const routeObj = {
                        params: params,
                        location: location,
                        match : item.props.match
                    }
                    const Component = item.props.component;
                    return <Component key={i} {...{ route: routeObj }} />
                }
                return item.props.children;
            }
        })
    }
}