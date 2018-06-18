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
    reset = {a : "b"}
    user = {
        name: "Bob",
        email: "bob@gmail.eomc",
        age: 0
    }
}
const wrapper = createStore(MyStore);
wrapper.susbcribe("user", user => {
    console.log("recived user", user);
})


@connect("@reset")
class MyRootComponent extends Fusion<any, any, MyStore> {
    public render() {
        console.log("update");
        return (
            <div><input type="button" />
                {this.store.reset.a}
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