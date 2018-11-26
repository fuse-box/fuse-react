import { Router } from "./storages/Router";

let globalStore: Store;
export class Store {
	public some: string;
	public $subscriptions: any;
	public router: Router;
	constructor() {
		Object.defineProperty(this, "$subscriptions", {
			value: [],
			enumerable: false,
			writable: true
		});
	}

	public static create(StoreObject: any) {
		globalStore = new StoreObject();
	}

	public static getInstance<T extends Store>(): T {
		if (!globalStore) {
			globalStore = new Store();
		}
		return globalStore as any;
	}
}
