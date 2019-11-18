import * as React from "react";
import * as PIXI from "pixi.js";

interface IProps {
    onPointerMove: (payload: {
        PreviousCoords: { x: number, y: number },
        Coords: { x: number, y: number },
        ColorHex?: string,
    }) => void;
    onContextLoad: (context: PIXI.Application | null) => void;
}

export class Whiteboard extends React.Component<IProps> {
    static displayName = Whiteboard.name;

    private application = new PIXI.Application({
        antialias: true,
        backgroundColor: 0xFFFFFF,
        
    });

    private isMouseDown = false;
    private previousCoords = { x: 0, y: 0 };

    private DOM = React.createRef<HTMLDivElement>();

    public componentDidMount() {
        // Stop drawing even when outside of the canvas
        document.addEventListener("pointerup", this.handlePointerUp);
        document.addEventListener("resize", this.handleResize);

        if (this.DOM.current) {
            this.application.resizeTo = this.DOM.current;

            this.DOM.current.appendChild(this.application.view);
        }

        if (this.props.onContextLoad) {
            this.props.onContextLoad(this.application);
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
            this.props.onPointerMove({
                PreviousCoords: this.previousCoords,
                Coords: { x, y },
            });
        }

        this.previousCoords = { x, y };
    };

    private handlePointerUp = () => {
        this.isMouseDown = false;
    };

    private handleResize = () => {
        if (this.DOM.current) {
            const { clientWidth, clientHeight } = this.DOM.current;

            this.application.renderer.resize(clientWidth, clientHeight);
        }
    }

    public render() {
        return (
            <div
                ref={this.DOM}
                onPointerDown={this.handlePointerDown}
                onPointerMove={this.handlePointerMove}
            />
        );
    }
}
