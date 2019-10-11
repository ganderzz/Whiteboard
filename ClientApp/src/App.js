import React, { Component } from 'react';
import { Route } from 'react-router';
import { Header } from "./components/Header";
import { WhiteboardPage } from './pages/WhiteboardPage';

import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    DOM = React.createRef();

    render() {
        return (
            <div ref={this.DOM}>
                <Header />
                <Route exact path='/' component={WhiteboardPage} />
            </div>
        );
    }
}
