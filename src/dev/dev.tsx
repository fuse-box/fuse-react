import { Fusion } from "./../index";
import { createStore, connect, getStore, dispatch } from './../Store';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Switch } from './../Router/Switch';
import { Route } from './../Router/Route';
import { MyStore } from './MyStore';
import { UserRoute } from './UserRoute';
import { Link } from '../Router/Link';
import "./style.scss";
import { Query } from '../Query';

interface IUser {
    name: string;
    email?: string;
    age: number;
}

const wrapper = createStore(MyStore);

// 

const q = Query.get("http://google.com/?width=200&height=100")



class MyRootComponent extends Fusion<any, any, MyStore> {
    public render() {
        return (
            <div><input type="button" />
                {this.store.reset.a}
                <MyUser/>
                <Controls/>

                <div>

                    <h1>Navigation</h1>
                    <ul>
                        <li><Link to="/user/add" render={(active, navigate) =>
                                <div className={active ? 'active' : ''} onClick={navigate}>To user</div>}/>
                        </li>
                        <li><Link to="/group" render={(active, navigate) =>
                                <div className={active ? 'active' : ''} onClick={navigate}>To group</div>}/>
                        </li>
                    </ul>
                    <hr/>
                    <Switch>
                        <Route path="/user" component={UserRoute}/>
                        <Route path="/group">Group route</Route>
                    </Switch>
                </div>
            </div>
        )
    }
}

class Controls extends Fusion<any, any> {
    private delete(){
        dispatch("user", () => undefined);
    }
    private create(){
        dispatch("user", () => ({name : "John", age : 14}));
    }
    private incrementAge(){
        dispatch<IUser>("user", user => {
            user.age++;
            return user;
        });
    }
    private reset(){
        dispatch("reset", () => ({a : "b"}));
    }
    private reset2(){
        dispatch("reset", () => ({a : "a"}));
    }
    public render() {
        return (
            <div>
                <hr/>
                <div>
                    Controls
                    <input type="button" value="delete user" onClick={() => this.delete()}/>
                    <input type="button" value="create user" onClick={() => this.create()}/>
                    <input type="button" value="incrementAge11" onClick={() => this.incrementAge()}/>
                    <input type="button" value="reset obj 1" onClick={() => this.reset()}/>
                    <input type="button" value="reset obj 2" onClick={() => this.reset2()}/>

                </div>
            </div>
        )
    }
}
@connect("user")
class MyUser extends Fusion<any, any, MyStore> {
    init() { }
    public render() {
        return (
            <div>
                {this.store.user && <div>
                    User: {this.store.user.name}  -> {this.store.user.age}
                </div> }
                {!this.store.user && <div>User deleted</div>}
            </div>
        )
    }
}



ReactDOM.render(<MyRootComponent />, document.querySelector('#root'))