import * as React from "react";
import { Fusion } from '../Fusion';
import { Route } from './Route';
import { pathMatch } from '../Utils';
import { connect } from '../Store';

@connect("@router")
export class Switch extends Fusion<{ children: any }, {}, any> {
    public render() {
        const children = [].concat(this.props.children);
        return children.map((item, i) => {
            if (item.type !== Route) {
                throw new Error('Children of Switch must have only Route object')
            }
            let match = item.props.path;
            if( !item.props.exact){
                match += "(.*)";
            }
            const location = this.store.router.location;
            const params = pathMatch(location, match);
            if (params) {
                if (item.props.component) {
                    const match = {
                        params: params,
                        location: location,
                        path : item.props.path
                    }
                    const Component = item.props.component;
                    return <Component key={i} {...{ match: match }} />
                }
                return item.props.children;
            }
        })
    }
}