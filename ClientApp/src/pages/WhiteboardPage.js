import React, { Component } from "react";
import * as signalR from "@microsoft/signalr";
import { Whiteboard } from "../components/Whiteboard";

export class WhiteboardPage extends Component {
    state = {
        users: [],
        selectedColor: "#222222"
    }

    connection = null;

    componentDidMount() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/whiteboard")
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.start();

        this.connection.on("Connect", (color, users) => {
            this.setState({ users });
        });

        this.connection.on("UserConnected", (users) => {
            this.setState({ users });
        });
    }

    render() {
        return (
            <div>
                <div style={{ position: "absolute", top: 50, left: 5, padding: 10, background: "#DDD" }}>
                    Users<br />
                    {this.state.users && (
                        <ul>
                            {this.state.users.map(p =>
                                <li key={p.Key}>
                                    <div style={{ display: "inline-block", width: 15, height: 15, background: p.Value, marginRight: 5 }} />
                                    {p.Key}
                                </li>
                            )}
                        </ul>
                    )}
                </div>

                <Whiteboard connection={this.connection} drawColor={this.state.selectedColor} />
            </div>
        );
    }
}