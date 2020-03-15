import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import OtherPage from "./OtherPage";
import Fib from "./Fib";

class App extends Component {
  state = { activeItem: "home" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    return (
      <Router>
        <div>
          <Menu inverted>
            <Menu.Item
              as={Link}
              name="home"
              to="/"
              active={this.state.activeItem === "home"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              as={Link}
              name="otherPage"
              to="/otherpage"
              active={this.state.activeItem === "other"}
              onClick={this.handleItemClick}
            />
          </Menu>
          <Route exact path="/" component={Fib} />
          <Route path="/otherpage" component={OtherPage} />
        </div>
      </Router>
    );
  }
}

export default App;
