# fuse-react

`fuse-react` is an abtraction on top of React Component which relieves the pain for those who find Redux overly complicated.


The concept is simple and revolves around a global Store object that is accessible by all components.

`fuse-react` offers a solution to react routing which is more flexible and memory efficient than `react-router-dom`



## Router

FuseReact Router is very similar to `react-router`, in fact it mimics the API so the transition will be as smooth as possible.

![diagram](diagram.png)

Unlike `react-router` `fuse-react router` subscribes to changes and renders only necessary components avoiding `render` from the top of the DOM tree.


Features:

* Memory efficient (render only required component)
* Extended Link support (a mini router)
* No wrapping the application
* Nothing else is required but `Switch` and `Route` (works with any React.Component framework)

### Switch and Route
To create a router swith do the following

```tsx
import * as React from "react";
import { Switch, Route } from "fuse-react";

export class UserRoute extends React.Component {
    public render() {
        return (
             <Switch>
                <Route match="/user" component={UserRoute}/>
                <Route match="/group">Group route</Route>
             </Switch>
        )
    }
}
```

`Switch` object doesn't need to have any parent object unlike `react-router`, it can be placed anywhere.

Matching `/user/anything/here`
```tsx
<Route path="/user" component={UserRoute}/>
```

Strict match `/user`
```tsx
<Route path="/user" exact component={UserRoute}/>
```

Render children
```tsx
<Route path="/user">I will be rendered</Route>
```

Access `route` object via props in your component

```tsx
import * as React from "react";
import { Switch, Route } from "fuse-react";

export class UserRoute extends React.Component {
    init() {  }
    public render() {
        return (
            <div>User Id: {this.props.match.params.id}</div>
        )
    }
}
```

### Links

The `Link` object is way more flexible comparing to `react-router`'s

Importing
```ts
import { Link } from "fuse-react";
```

Regular `a` tags

```tsx
<Link activeClassName="active" to="/user/listing">list</Link>
```

Custom render

`render` property accepts `active` and `navigate` function

```tsx
<Link to="/user/add" render={(active, navigate) =>
    <div className={active ? 'active' : ''} onClick={navigate}>To user</div>}/>
```

Custom render converts your link into a mini router. You can pass additional property for matching

```tsx
<Link to="/user/add" match="/user" render={(active, navigate) =>
    <div className={active ? 'active' : ''} onClick={navigate}>To user</div>}/>
```

In the case above `active` is `true` when navigated to `/user/foobar`, however the `navigate` function navigates to `/user/add`

### Navigation

Access navigation from anywhere in your code!

```ts
import { navigate, mergeQuery, setQuery} from "fuse-react";
```

Navigating to path 

```ts
navigate("/user")
```

Passing and overriding query arguments

```ts
navigate("/user", {foo : "bar"})
// will result in `/user?foo=bar`
```

Setting query

```ts
setQuery({foo : "bar"})
// will result in `/current-url?foo=bar`
```

Merging query

```ts
// existing url "/user?hello=world"
mergQuery({foo : "bar"})
// will result in `/user?hello=world&foo=bar`
```

Additionally `setQuery` and `mergQuery` accept a second bool argument. Dispatch (update trigger for all `Switch` and `Link` on scene) won't be triggered when set `false`

```ts
// existing url "/user?hello=world"
mergQuery({foo : "bar"}, false)
// will result in `/user?hello=world&foo=bar`
```

A component can "connect" to an individual key in the store and react to its changes.


The framework also offers a router which has some improvements comparing to  `react-router`

```tsx
@connect("count")
class MyUser extends Fusion<any, any, MyStore> {
    public render() {
        return (
            <div>{this.store.count}</div>
        );
    };
}
```

The decorator `@connect` registers subscription to the store, therefore once we update the object it will be forced to get updated.

```ts
dispatch("count", 1); // like this
dispatch({count : 1}); // or like this
```

## Create your store

```ts
import { createStore } from "fuse-react";
class MyStore {
    count = 0;
}
createStore(MyStore);
```

A class will be instantiated and registered globally

## Connecting

A component can be connected to individual keys in the store
```tsx
import { connect } from "fuse-react";
@connect("count", "user")
class MyUser extends Fusion<any, any, MyStore> {
    public render() {
        return (
            <div>{this.store.count}</div>
        );
    };
}
```

The third (optional) generic typing will help with your typings on `this.store`, meanwhile the first and the second arguments remain conventional(IProps, IState)

### Connecting with deep compare

There are situations where you would like to avoid unnesserary updates. For that preffix your key with `@`

```ts
import { connect } from "fuse-react";
@connect("@user")
class MyUser extends Fusion<any, any, MyStore> {
    public render() {
        return (
            <div>{this.store.user.name}</div>
        );
    };
}
```

Once the dispatcher recieves an event and goes through all subscriptions it will check if the new value is different from the one in the store.

### Init

```tsx
@connect("count", "user")
class MyUser extends Fusion<any, any, MyStore> {
    private init(){}
    public render() {
        return (
            <div>{this.store.count}</div>
        );
    };
}
```

It's important to understand the `init` of the component, it will be triggered on `componentWillMount` and `componentWillReceiveProps` as well as when a subscription key in the store has been changed.

Avoid dispatching events from `init` as it might cause an infinite loop.

### Dispatch

```tsx
import { dispatch } from "fuse-react";
dispatch("count", 1); // like this
dispatch({count : 1}); // or like this
```



