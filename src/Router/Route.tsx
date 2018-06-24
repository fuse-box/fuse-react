import * as React from "react";
import { Fusion } from '../Fusion';
import { dispatch } from '../Store';
import { Query } from '../Query';

export function navigate(path, query ?: {[key:string]: any}){
    if( query ){
        path = `${path}${Query.createString(query)}`;
    }
    window.history.pushState({}, "", path);
    dispatch("router", () => ({
        location: path,
        query: Query.get()
    }));
}

export function mergeQuery(query ?: {[key:string]: any}, doDispatch : boolean = true){
    const data = Query.merge(query);
    const path = `${location.pathname}${data.str}`;
    window.history.pushState({}, "", path);
    if( doDispatch ){
        dispatch("router", () => ({
            location: location.pathname,
            query: Query.get()
        }));
    }
}

export function setQuery(query ?: {[key:string]: any}, doDispatch : boolean = true){
    const data = Query.createString(query);
    const path = `${location.pathname}${data}`;
    window.history.pushState({}, "", path);
    if( doDispatch ){
        dispatch("router", () => ({
            location: location.pathname,
            query: Query.get()
        }));
    }
}

export class Route extends Fusion<{
         children?: any,
         match?: string,
         path?: string,
         exact?: boolean
         component?: any
    }, {}> {
    public render() {
        return this.props.children;
    }
}