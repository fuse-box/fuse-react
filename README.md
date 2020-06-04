# fuse-react

`fuse-react` is an abtraction on top of React Component which relieves the pain for those who find Redux overly complicated.
`fuse-react` offers a solution to react routing which is more flexible and memory efficient than `react-router-dom`

## Setting up

Setup your index

```tsx
import { IComponentRoute } from "fuse-react";

interface IContext {
  foo: string;
  title: string;
}
interface ComponentContext {
  context: IContext;
  route: IComponentRoute;
  setContext: (fn: (context: IContext) => IContext) => any;
}

// create default values
createContext<IContext>({
  title: "hello World",
});

const App = createRoot(({ context, route, setContext }: ComponentContext) => {
  function clicked() {
    setContext((context) => ({ ...context, title: "Hello foo bar!!!" }));
  }
  return <div onClick={clicked}>{context.title}</div>;
});

ReactDOM.render(<AnotherApp />, document.querySelector("#root"));
```

## Router

Add router to the mix

```tsx
const App = createRoot(({ context, route, setContext }: ComponentContext) => {
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
    setContext((context) => ({
      ...context,
      title: "Changed from bar details",
    }));
  }
  return <h1 onClick={click}>I am bar details: {route.params.name}</h1>;
});

function PageNotFound({ context, route, setContext }: ComponentContext) {
  return <div>Page not found</div>;
}

ReactDOM.render(<App />, document.querySelector("#root"));
```
