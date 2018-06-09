import { Fusion } from "./index";
import { createStore, connect, getStore, dispatch } from './Store';
import * as React from "react";
import * as ReactDOM from "react-dom";


interface IUser {
    name: string;
    email?: string;
    age: number;
}
class MyStore {
    user = {
        name: "Bob",
        email: "bob@gmail.eomc",
        age: 0
    }
}
createStore(MyStore);



class MyRootComponent extends Fusion<any, any> {
    public render() {
        return (
            <div><input type="button" />
                <MyUser/>
                <Controls/>
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
    public render() {
        return (
            <div>
                <hr/>
                <div>
                    Controls
                    <input type="button" value="delete user" onClick={() => this.delete()}/>
                    <input type="button" value="create user" onClick={() => this.create()}/>
                    <input type="button" value="incrementAge11" onClick={() => this.incrementAge()}/>

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