import { ReactStorage } from "../../Storage";
let index = 1;
export class Books extends ReactStorage {
	public list: Array<any>;

	init() {
		this.list = [{ name: "Super nice book", id: 1 }];
	}
	public addBook() {
		index++;
		this.list.push({ name: "Some other", id: index });
		this.notify();
	}

	public remove(item) {
		const index = this.list.indexOf(item);
		if (index > -1) {
			this.list.splice(index, 1);
		}
		this.notify();
	}
}
