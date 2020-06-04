import * as React from "react";
import * as ReactDOM from "react-dom";
import { createContext, createRoot, withContext, IWithContext } from "../Context";
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
	setContext: (fn: (context: IContext) => IContext) => any;
}

const App = createRoot(({ context, route, setContext }: ComponentContext) => {
	return (
		<div>
			<div
				onClick={() => {
					setContext((context: IContext) => {
						return { ...context, title: "pukka", foo: "oi oi!!!!!!!!" };
					});
				}}
			>
				Hello noni {context.title} => {context.foo}
			</div>
			<ul>
				<li>
					<DivLink query={{ section: "foo" }} to="/foo">
						To foo
					</DivLink>
				</li>
				<li>
					<DivLink query={{ section: "bar" }} to="/bar/hello">
						To bar
					</DivLink>
				</li>
				<li>
					<Link to="/baz/ivan">To baz</Link>
				</li>
				<li>
					<Link to="/hello/john">To Hello</Link>
				</li>
			</ul>
			<hr></hr>
			<Switch notFound={NotFound}>
				<Route component={Foo} path="/foo" />
				<Route component={Bar} path="/bar/:id" />
				<Route component={Baz} path="/baz/:name" />
				<Route component={Hello} exact path="/hello/:name" />
			</Switch>
		</div>
	);
});

function NotFound() {
	return <div>Not found</div>;
}

interface IFoo extends IWithContext<IContext> {}
const Foo = withContext((props: IFoo) => {
	console.log("render foo", props);
	return <h1>I am foo</h1>;
});

const Bar = withContext(({ route }) => {
	return <h1>I am bar {route.params.id}</h1>;
});

const Some = (props) => {
	return <div>Some stuff</div>;
};
function Hello({ context, route, setContext }: ComponentContext) {
	return (
		<h1
			onClick={() => {
				setContext((context) => ({ ...context, title: "Moikka" }));
			}}
		>
			{route.params.name}
			<Some></Some>
		</h1>
	);
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
const Baz = withContext(BazComponent);

const AnotherApp = createRoot(({ context, route, setContext }: ComponentContext) => {
	function clicked() {
		setContext((context) => ({ ...context, title: "Hello foo bar" }));
	}
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

function RouteFoo({ context, route, setContext }: ComponentContext) {
	return <div>FOO: Name from the url {route.params.name}</div>;
}
function RouteBar({ context, route, setContext }: ComponentContext) {
	return (
		<div>
			BAR: Name from the url {route.params.name}
			<hr></hr>
			<BarDetails />
		</div>
	);
}
const BarDetails = withContext(({ route, setContext }: ComponentContext) => {
	function click() {
		setContext((context) => ({ ...context, title: "Changed from bar details" }));
	}
	return <h1 onClick={click}>I am bar details: {route.params.name}</h1>;
});

function PageNotFound({ context, route, setContext }: ComponentContext) {
	return <div>Page not found</div>;
}

ReactDOM.render(<AnotherApp />, document.querySelector("#root"));
