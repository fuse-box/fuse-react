import { ReactStorage } from "../../Storage";

export class User extends ReactStorage {
	public name: string;
	public changeName(name: string) {
		this.name = name;
		this.notify();
	}
}
