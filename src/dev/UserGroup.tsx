import * as React from "react";
import { Fusion } from "../Fusion";

export class UserGroup extends Fusion<
	{
		children?: any;
	},
	any
> {
	public render() {
		return <div className="group-route">group route !!</div>;
	}
}
