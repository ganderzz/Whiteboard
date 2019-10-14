import * as React from "react";

interface IProps {
    onPointerMove: (context: CanvasRenderingContext2D | null, payload: {
        PreviousCoords: { x: number, y: number },
        Coords: { x: number, y: number },
        ColorHex?: string,
    }) => void;
    onContextLoad: (context: CanvasRenderingContext2D | null) => void;
}

export class Whiteboard extends React.Component<IProps> {
    static displayName = Whiteboard.name;

    private isMouseDown = false;
    private previousCoords = { x: 0, y: 0 };

    private DOM = React.createRef<HTMLCanvasElement>();

    public componentDidMount() {
        // Stop drawing even when outside of the canvas
        document.addEventListener("pointerup", this.handlePointerUp);

        if (this.props.onContextLoad && this.DOM.current) {
            this.props.onContextLoad(this.DOM.current.getContext("2d"));
        }
    }

    public componentDidUpdate() {
        if (this.props.onContextLoad && this.DOM.current) {
            this.props.onContextLoad(this.DOM.current.getContext("2d"));
        }
    }

    public componentWillUnmount() {
        // Clear memory
        document.removeEventListener("pointerup", this.handlePointerUp);
    }

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

        if (!this.DOM.current) {
            return;
        }

        const x = e.clientX - this.DOM.current.offsetLeft;
        const y = e.clientY - this.DOM.current.offsetTop;

        if (this.props.onPointerMove) {
            const context = this.DOM.current.getContext("2d");

            this.props.onPointerMove(context, {
                PreviousCoords: this.previousCoords,
                Coords: { x, y },
            });
        }

        this.previousCoords = { x, y };
    };

    private handlePointerUp = () => {
        this.isMouseDown = false;
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
