import * as pathToRegexp from "path-to-regexp";

export function pathMatch(location: string, path: string) {
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

export function classProp(...any) {
    return { className: cls.apply(undefined, arguments) }
}

export function cls(...any) {
    let clsNames = [];
    const args = arguments;
    for (const i in arguments) {
        const arg = arguments[i];
        if (typeof arg === "string") {
            clsNames.push(arg);
        } else {
            if (Array.isArray(arg)) {
                arg.forEach(a => clsNames.push(a));
            } else {
                if (typeof arg === "object") {
                    for (const key in arg) {
                        if (arg[key]) {
                            clsNames.push(key)
                        }
                    }
                }
            }
        }

    }
    return clsNames.join(" ");
}