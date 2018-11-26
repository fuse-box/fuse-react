import * as React from "react";

export class Fusion<IProps, IState = null> extends React.Component<IProps, IState> {
	public state: IState = {} as IState;
	public isComponentMounted: boolean;

	public _initialize() {
		if (typeof this["init"] === "function") {
			this["init"].apply(this, [this.props]);
			return true;
		}
		return false;
	}

	componentWillMount() {
		this.setState({});
		this.isComponentMounted = true;
		this._initialize();
	}

	componentWillUnmount() {
		this.isComponentMounted = false;
	}

	componentWillReceiveProps(newProps) {
		this.props = newProps;
		this._initialize();
	}
}
