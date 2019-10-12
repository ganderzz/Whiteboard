import * as React from "react";

interface IProps {
    connection: signalR.HubConnection | null;
    drawColor: string;
}

export class Whiteboard extends React.Component<IProps> {
    static displayName = Whiteboard.name;

    private isMouseDown = false;
    private isRegisteredtoDraw = false;
    private previousCoords = { x: 0, y: 0 };

    private DOM = React.createRef<HTMLCanvasElement>();

    public componentDidMount() {
        this.registerHubEvent();

        // Stop drawing even when outside of the canvas
        document.addEventListener("pointerup", this.handlePointerUp);
    }

    public componentDidUpdate(prevProps: IProps) {
        if (
            this.props.connection &&
            prevProps.connection !== this.props.connection
        ) {
            this.registerHubEvent();
        }
    }

    public componentWillUnmount() {
        // Clear memory
        document.removeEventListener("pointerup", this.handlePointerUp);
    }

    private registerHubEvent = () => {
        if (this.props.connection && !this.isRegisteredtoDraw) {
            this.props.connection.on(
                "Draw",
                ({ previousCoords, coords, colorHex }) => {
                    this.handleDraw(
                        previousCoords.x,
                        previousCoords.y,
                        coords.x,
                        coords.y,
                        colorHex
                    );
                }
            );

            this.isRegisteredtoDraw = true;
        }
    };

    private handlePointerDown = (e: React.MouseEvent) => {
        if (!this.DOM.current) {
            return;
        }

        this.isMouseDown = true;

        const x = e.clientX - this.DOM.current.offsetLeft;
        const y = e.clientY - this.DOM.current.offsetTop;

        this.previousCoords = { x, y };
    };

    private handlePointerMove = (e: React.MouseEvent) => {
        if (!this.isMouseDown) {
            return;
        }

        if (!this.props.connection) {
            alert("Couldn't connect to the server.");
            return;
        }

        if (!this.DOM.current) {
            return;
        }

        const x = e.clientX - this.DOM.current.offsetLeft;
        const y = e.clientY - this.DOM.current.offsetTop;

        this.props.connection.invoke("Draw", {
            PreviousCoords: this.previousCoords,
            Coords: { x, y },
            ColorHex: this.props.drawColor
        });

        this.handleDraw(
            this.previousCoords.x,
            this.previousCoords.y,
            x,
            y,
            this.props.drawColor
        );

        this.previousCoords = { x, y };
    };

    private handlePointerUp = () => {
        this.isMouseDown = false;
    };

    private handleDraw = (previousX: number, previousY: number, x: number, y: number, color: string = "#222222") => {
        if (!this.DOM.current) {
            return;
        }

        const ctx = this.DOM.current.getContext("2d");

        if (!ctx) {
            return;
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.moveTo(previousX, previousY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    };

    public render() {
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
