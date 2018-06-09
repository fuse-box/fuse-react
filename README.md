# fuse-react

`fuse-react` is an abtraction on top of React Component which relieves the pain for those who find Redux overly complicated.

The concept is simple and revolves around a global Store object that is accessible by all components.
A component can "connect" to an individual key in the store and react to its changes.

```tsx
@connect("user")
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



---
More to come.
