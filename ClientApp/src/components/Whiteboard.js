import React, { Component } from 'react';
import * as signalR from "@microsoft/signalr"

export class Whiteboard extends Component {
    static displayName = Whiteboard.name;

    // @TODO: Move out
    state = {
        users: []
    }

    color = "#222222";

    connection = null;
    isMouseDown = false;
    previousCoords = { x: 0, y: 0 };

    DOM = React.createRef();

    componentDidMount() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/whiteboard")
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.start();

        this.connection.on("Draw", (previousX, previousY, x, y, color) => {
            this.handleDraw(previousX, previousY, x, y, color);
        });

        this.connection.on("Connect", (color, users) => {
            this.color = color;
            this.setState({ users });
        });

        this.connection.on("UserConnected", (users) => {
            this.setState({ users });
        });

        // Stop drawing even when outside of the canvas
        document.addEventListener("pointerup", this.handlePointerUp);
    }

    componentWillUnmount() {
        // Clear memory
        document.removeEventListener("pointerup", this.handlePointerUp);
    }

    handlePointerDown = (e) => {
        this.isMouseDown = true;

        const x = e.clientX - this.DOM.current.offsetLeft;
        const y = e.clientY - this.DOM.current.offsetTop;

        this.previousCoords = { x, y };
    }

    handlePointerMove = (e) => {
        if (this.isMouseDown) {
            const x = e.clientX - this.DOM.current.offsetLeft;
            const y = e.clientY - this.DOM.current.offsetTop;

            this.connection.invoke("Draw", this.previousCoords.x, this.previousCoords.y, x, y);

            this.handleDraw(this.previousCoords.x, this.previousCoords.y, x, y, this.color);

            this.previousCoords = { x, y };
        }
    }

    handlePointerUp = () => {
        this.isMouseDown = false;
    }

    handleDraw = (previousX, previousY, x, y, color = "#222222") => {
        if (!this.DOM.current) {
            return;
        }

        const ctx = this.DOM.current.getContext("2d");

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.moveTo(previousX, previousY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }

    render() {
        return (
            <>
                <div style={{ position: "absolute", top: 50, left: 5, padding: 10, background: "#DDD" }}>
                    Users<br />
                    {this.state.users && (<ul>{this.state.users.map(p => <li key={p.Key}><div style={{ display: "inline-block", width: 15, height: 15, background: p.Value }} /> {p.Key}</li>)}</ul>)}
                </div>
                <canvas
                    ref={this.DOM}
                    height={window.innerHeight - 52}
                    width={window.innerWidth}
                    onPointerDown={this.handlePointerDown}
                    onPointerMove={this.handlePointerMove}
                >
                    Not supported by browser
            </canvas>
            </>
        );
    }
}
