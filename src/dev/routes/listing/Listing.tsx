import * as React from "react";
import { connect } from "../../../Connect";
import { Link } from "../../../Router/Link";
import { Route } from "../../../Router/Route";
import { Switch } from "../../../Router/Switch";
import { User } from "../../storages/User";
import "./Listing.scss";

class ListingA extends React.Component {
	public render() {
		console.log("render a");
		return (
			<div>
				<h2>Listing A </h2>
				<p>
					Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
					aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
					Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
				</p>
			</div>
		);
	}
}

@connect({ user: User })
class ListingB extends React.Component<{ user: User }> {
	public render() {
		console.log("render b");
		return (
			<div>
				<h2>Listing B {this.props.user.name} </h2>
				<p>
					Pedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
					Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates
					repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut
					reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
				</p>
			</div>
		);
	}
}

export class Listing extends React.Component {
	public render() {
		console.log(">> listing section");
		return (
			<div className="page listing">
				<h1>Listing with sub route</h1>
				<div>
					<Link activeClassName="active" to="/listing/a">
						Listing a
					</Link>
				</div>
				<div>
					<Link activeClassName="active" to="/listing/b">
						Listing b
					</Link>
				</div>

				<Switch placeholder={<div>Loading</div>}>
					<Route path="/listing/a" component={ListingA} />
					<Route path="/listing/b" component={() => ListingB} />
				</Switch>
			</div>
		);
	}
}
