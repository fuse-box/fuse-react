import * as React from "react";
import * as ReactDOM from "react-dom";
import { createContext, createRoot, getContext, withContext, IWithContext } from "../Context";
import { DivLink, Link } from "../Link";
import { Route, Switch, IComponentRoute } from "../Route";
import "./index.scss";
interface IContext {
	foo?: string;
	title?: string;
}

createContext<IContext>({
	foo: "Some foo string here!!!",
	title: "hello",
});

interface ComponentContext {
	context: IContext;
	route: IComponentRoute;
	getContext: () => IContext;
	setContext: (fn: (context: IContext) => IContext) => any;
}

interface BazProps {
	route: IComponentRoute;
}
class BazComponent extends React.Component<BazProps, any> {
	render() {
		const { route } = this.props;
		return <h3>Baz component {route.params.name}</h3>;
	}
}

type IActions = Record<string, (getContext, setContext) => Record<string, any>>;

const UserActions = (getContext, setContext) => {
	return {
		getUser: () => {
			const context = getContext();
			context.title = "Changed";
			setContext(() => context);
		},
	};
};
const Baz = withContext(BazComponent);

const AnotherApp = createRoot(({ route, setContext }: ComponentContext) => {
	function clicked() {
		const context = getContext();
		context.title = "Hello from cloned context";
		setContext(() => context);
	}

	const context = getContext();
	return (
		<div>
			<h1 onClick={clicked}>{context.title}</h1>

			<Link to="/foo/john">To Foo</Link>
			<Link to="/bar/john">To Bar</Link>
			<Link to="/oi">Random page</Link>
			<Switch notFound={PageNotFound}>
				<Route component={RouteFoo} path="/foo/:name" />
				<Route component={RouteBar} path="/bar/:name" />
			</Switch>
		</div>
	);
});

function RouteFoo({ getContext, route, setContext }: ComponentContext) {
	return <div>FOO: Name from the url {route.params.name}</div>;
}
function RouteBar({ getContext, route, setContext }: ComponentContext) {
	return (
		<div>
			BAR: Name from the url {route.params.name}
			<hr></hr>
			<BarDetails />
		</div>
	);
}
const BarDetails = withContext(
	({ actions, route, setContext }: ComponentContext & { actions: any }) => {
		function click() {
			actions.getUser();
		}
		return <h1 onClick={click}>I am bar details: {route.params.name}</h1>;
	},
	{ actions: UserActions }
);

function PageNotFound({ context, route, setContext }: ComponentContext) {
	return <div>Page not found</div>;
}

ReactDOM.render(<AnotherApp />, document.querySelector("#root"));
