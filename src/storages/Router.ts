import { Query } from "../Query";
import { ReactStorage } from "../Storage";

export class Router extends ReactStorage {
	public location: string;
	public query: { [key: string]: string };
	init() {
		const self = this;
		this.setupValues();
		window.onpopstate = history["onpushstate"] = function(e) {
			self.onBrowserUpdate();
		};
	}
	public setupValues(path?) {
		this.location = path ? path : location.pathname;
		this.query = Query.get();
	}
	public onBrowserUpdate(path?) {
		this.setupValues(path);
		this.notify();
		if (this["store"] && this["store"]["onNavigate"]) {
			this["store"]["onNavigate"](this);
		}
	}
}
