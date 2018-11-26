import * as React from "react";
import * as ReactDOM from "react-dom";
import "./NewStore";
import { connect } from "../Connect";
import { Link } from "../Router/Link";
import { Switch } from "../Router/Switch";
import { Blogs } from "./routes/blog/Blog";
import { Listing } from "./routes/listing/Listing";
import { News } from "./routes/news/News";

import { Books } from "./storages/Books";
import "./style.scss";
import { User } from "./storages/User";
const config = {
	routes: {
		"/blog": {
			component: () => Blogs
		},
		"/news": {
			component: () => News
		},
		"/listing": {
			component: () => Listing
		}
	}
};

@connect({ user: User })
class Menu extends React.Component<{ user?: User }> {
	public render() {
		const menuConfig = [
			{ to: "/blog", label: "Blogs" },
			{ to: "/news", label: "News" },
			{ to: "/listing", label: "Listing" }
		];
		return (
			<div className="menu">
				{menuConfig.map((item, i) => (
					<Link activeClassName="active" key={i} to={item.to}>
						{item.label}
					</Link>
				))}

				<button
					onClick={() => {
						this.props.user.changeName(new Date().getTime().toString());
					}}
				>
					change name {this.props.user.name}
				</button>
			</div>
		);
	}
}

@connect({ books: Books })
class BookCounter extends React.Component<{ books?: Books }> {
	render() {
		const books = this.props.books;
		return <span>({books.list.length})</span>;
	}
}

@connect({ books: Books })
class BookList extends React.Component<{ books?: Books }, any> {
	render() {
		const books = this.props.books;
		return (
			<div>
				<div>
					<button
						onClick={() => {
							books.addBook();
						}}
					>
						add
					</button>
				</div>
				<ul>
					{books.list.map((item, i) => (
						<li key={i}>
							{item.id} - {item.name}
							<BookCounter />
							<span onClick={() => books.remove(item)}>[remove]</span>
							<Link to="/a" activeClassName="active">
								To A
							</Link>
							<Link to="/b" activeClassName="active">
								To B
							</Link>
						</li>
					))}
				</ul>
				<div>
					Total count: <BookCounter />
				</div>
			</div>
		);
	}
}

class MyRootComponent extends React.Component {
	public render() {
		return (
			<div className="demo">
				{/* <BookList />
				<div /> */}
				<div className="left">
					<Menu />
				</div>
				<div className="right">
					<Switch config={config} />
				</div>
			</div>
		);
	}
}

ReactDOM.render(<MyRootComponent />, document.querySelector("#root"));
