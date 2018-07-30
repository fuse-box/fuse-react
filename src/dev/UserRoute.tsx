import { Fusion } from "../Fusion";
import * as React from "react";
import { MyStore } from './MyStore';
import { Switch } from '../Router/Switch';
import { Route, mergeQuery } from '../Router/Route';
import { Link } from '../Router/Link';
import { connect } from '../Store';

@connect("@initial")
export class UserRoute extends Fusion<any, any, MyStore> {
    init() { 
        
    }
    public render() {
        return (
            <div>
                User with id: {this.props.match.params.id}
                <hr />
                <ul>
                    <li><Link activeClassName="active" to="/user/add">add</Link></li>
                    <li><Link activeClassName="active" to="/user/listing">list</Link></li>
                    <li><span onClick={() => {
                        mergeQuery({ foo: new Date().getTime() })
                    }}>merge query</span></li>

                    <li><span onClick={() => {
                        mergeQuery({ bar: new Date().getTime() })
                    }}>merge query</span></li>
                </ul>

                <Switch>
                    <Route path="/user/add">
                        <h2>Adding new user <Link to="/group">To group</Link></h2>
                    </Route>
                    <Route path="/user/listing">
                        <h2>Listing users</h2>
                    </Route>
                </Switch>
            </div>
        )
    }
}
