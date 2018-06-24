import { Query } from '../Query';
import { dispatch } from '../Store';

function updateStoreBrowserHistory() {
    setTimeout(() => {
        dispatch("router", () => getRouterObject());
    }, 0);
}
window.onpopstate = history["onpushstate"] = function (e) { updateStoreBrowserHistory() }

export function getRouterObject() {
    return {
        location: location.pathname,
        query: Query.get()
    }
}