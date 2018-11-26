import { Store } from "../Store";

export class NewStore extends Store {
	constructor() {
		super();
	}
}

Store.create(NewStore);
