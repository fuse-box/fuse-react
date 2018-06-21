import * as pathToRegexp from "path-to-regexp";

export function pathMatch(location: string, path : string) {
    const keys: any = [];
    const re = pathToRegexp(path, keys);
    let matched = re.exec(location)
    if (matched) {
        const params: any = {}
        for (let k = 0; k < keys.length; k++) {
            let item = keys[k];
            params[item.name] = matched[k + 1];
        }
        return params;
    }
}