import React, { Component } from 'react';

export class Whiteboard extends Component {
    static displayName = Whiteboard.name;

    isMouseDown = false;
    isRegisteredtoDraw = false;
    previousCoords = { x: 0, y: 0 };

    DOM = React.createRef();

    componentDidMount() {
        this.registerHubEvent();

        // Stop drawing even when outside of the canvas
        document.addEventListener("pointerup", this.handlePointerUp);
    }

    componentDidUpdate(prevProps) {
        if (this.props.connection && prevProps.connection !== this.props.connection) {
            this.registerHubEvent();
        }
    }

    componentWillUnmount() {
        // Clear memory
        document.removeEventListener("pointerup", this.handlePointerUp);
    }

    registerHubEvent = () => {
        if (this.props.connection && !this.isRegisteredtoDraw) {
            this.props.connection.on("Draw", ({ previousCoords, coords, colorHex }) => {
                this.handleDraw(previousCoords.x, previousCoords.y, coords.x, coords.y, colorHex);
            });

            this.isRegisteredtoDraw = true;
        }
    }

    handlePointerDown = (e) => {
        this.isMouseDown = true;

        const x = e.clientX - this.DOM.current.offsetLeft;
        const y = e.clientY - this.DOM.current.offsetTop;

        this.previousCoords = { x, y };
    }

    handlePointerMove = (e) => {
        if (this.isMouseDown) {
            if (!this.props.connection) {
                alert("Couldn't connect to the server.");
                return;
            }

            const x = e.clientX - this.DOM.current.offsetLeft;
            const y = e.clientY - this.DOM.current.offsetTop;

            this.props.connection.invoke(
                "Draw",
                {
                    PreviousCoords: this.previousCoords,
                    Coords: { x, y },
                    ColorHex: this.props.drawColor
                }
            );

            this.handleDraw(this.previousCoords.x, this.previousCoords.y, x, y, this.props.drawColor);

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
            <canvas
                ref={this.DOM}
                height={window.innerHeight - 52}
                width={window.innerWidth}
                onPointerDown={this.handlePointerDown}
                onPointerMove={this.handlePointerMove}
            >
                Not supported by browser
            </canvas>
        );
    }
}
