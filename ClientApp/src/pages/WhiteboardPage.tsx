import * as React from "react";
import * as signalR from "@microsoft/signalr";
import { Whiteboard } from "../components/Whiteboard";
import { CirclePicker, ColorResult } from "react-color";

interface IState {
    users: { Key: string, Value: string }[],
    selectedColor: string;
}

export class WhiteboardPage extends React.Component<{}, IState> {
    public readonly state: IState = {
        users: [],
        selectedColor: "#03a9f4"
    };

    connection: signalR.HubConnection | null = null;
    context: CanvasRenderingContext2D | null = null;

    public componentDidMount() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/whiteboard")
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.start();

        this.connection.on("UsersUpdated", (users = []) => {
            this.setState({ users });
        });

        this.connection.on(
            "Draw",
            ({ previousCoords, coords, colorHex }) => {
                console.log(this.context)
                this.handleDraw(
                    this.context,
                    {
                        PreviousCoords: previousCoords,
                        Coords: coords,
                        ColorHex: colorHex,
                    }
                );
            }
        );
    }

    private handleColorChange = (color: ColorResult) => {
        this.setState({ selectedColor: color.hex })
    }

    private handlePointerMove = (context: CanvasRenderingContext2D | null, payload: {
        PreviousCoords: { x: number, y: number },
        Coords: { x: number, y: number },
        ColorHex?: string,
    }) => {
        if (!context || !payload) {
            return;
        }

        if (this.connection) {
            this.connection.invoke("Draw", { ...payload, ColorHex: this.state.selectedColor });
        }

        this.handleDraw(context, payload);
    };

    private handleDraw = (context: CanvasRenderingContext2D | null, payload: {
        PreviousCoords: { x: number, y: number },
        Coords: { x: number, y: number },
        ColorHex?: string,
    }) => {
        if (!context || !payload) {
            return;
        }

        const { PreviousCoords, Coords, ColorHex } = payload;

        context.beginPath();
        context.strokeStyle = ColorHex || this.state.selectedColor;
        context.lineWidth = 5;
        context.lineJoin = "round";
        context.moveTo(PreviousCoords.x, PreviousCoords.y);
        context.lineTo(Coords.x, Coords.y);
        context.closePath();
        context.stroke();
    };

    public render() {
        const { users, selectedColor } = this.state;

        return (
            <div>
                <div
                    style={{
                        position: "absolute",
                        top: 50,
                        left: 5,
                        padding: 10,
                        background: "#DDD"
                    }}
                >
                    <strong>Users</strong>

                    {users && (
                        <ul style={{ listStyleType: "none", margin: "15px 0 10px 0", borderBottom: "1px solid #999", padding: "0 0 10px 0" }}>
                            {users.map(p => (
                                <li key={p.Key}>
                                    <div
                                        style={{
                                            display: "inline-block",
                                            width: 15,
                                            height: 15,
                                            background: p.Value,
                                            marginRight: 5
                                        }}
                                    />
                                    {p.Key}
                                </li>
                            ))}
                        </ul>
                    )}

                    <CirclePicker color={selectedColor} onChange={this.handleColorChange} />
                </div>

                <Whiteboard
                    onPointerMove={this.handlePointerMove}
                    onContextLoad={(context) => { this.context = context; }}
                />
            </div>
        );
    }
}
