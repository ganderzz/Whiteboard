import * as React from "react";
import { Route } from "react-router";
import { Header } from "./components/Header";
import { WhiteboardPage } from "./pages/WhiteboardPage";

import "./custom.css";

export default class App extends React.Component {
    static displayName = App.name;

    private DOM = React.createRef<HTMLDivElement>();

    public render() {
        return (
            <div ref={this.DOM}>
                <Header />
                <Route exact path="/" component={WhiteboardPage} />
            </div>
        );
    }
}
