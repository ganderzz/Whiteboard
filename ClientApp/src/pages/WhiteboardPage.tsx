import * as React from "react";
import * as signalR from "@microsoft/signalr";
import * as PIXI from "pixi.js";
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

    private connection: signalR.HubConnection | null = null;
    private application: PIXI.Application | null = null;

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
                this.handleDraw(
                    {
                        PreviousCoords: previousCoords,
                        Coords: coords,
                        ColorHex: colorHex,
                    }
                );
            }
        );
    }

    /**
     * Update the user's current color.
     */
    private handleColorChange = (color: ColorResult) => {
        this.setState({ selectedColor: color.hex })
    }

    /**
     * Send the current user's draw data to other users.
     */
    private handlePointerMove = (payload: {
        PreviousCoords: { x: number, y: number },
        Coords: { x: number, y: number },
        ColorHex?: string,
    }) => {
        if (!payload) {
            return;
        }

        if (this.connection) {
            this.connection.invoke("Draw", { ...payload, ColorHex: this.state.selectedColor });
        }

        this.handleDraw(payload);
    };

    /**
     * Draw to the whiteboard canvas.
     */
    private handleDraw = (payload: {
        PreviousCoords: { x: number, y: number },
        Coords: { x: number, y: number },
        ColorHex?: string,
    }) => {
        if (!this.application || !payload) {
            return;
        }

        const { PreviousCoords, Coords, ColorHex } = payload;

        const line = new PIXI.Graphics();

        line.lineStyle(3, PIXI.utils.string2hex(ColorHex || this.state.selectedColor), 1);
        line.moveTo(PreviousCoords.x, PreviousCoords.y);
        line.lineTo(Coords.x, Coords.y);
        line.closePath();
        line.endFill();

        // checking null above, but typescript complains
        this.application!.stage.addChild(line);
    };

    public render() {
        const { users, selectedColor } = this.state;

        return (
            <section style={{ display: "grid", height: "100%", gridTemplateColumns: "minmax(280px, 20%) 80%" }}>
                <div
                    style={{
                        padding: 10,
                        background: "#333",
                        color: "#FFF"
                    }}
                >
                    <strong>Users</strong>

                    {users ? (
                        <ul style={{ listStyleType: "none", margin: "15px 0 10px 0", borderBottom: "1px solid #777", padding: "0 0 10px 0" }}>
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
                    ) : <em>None</em>}

                    <CirclePicker color={selectedColor} onChange={this.handleColorChange} />
                </div>


                <Whiteboard
                    onPointerMove={this.handlePointerMove}
                    onContextLoad={(application) => { this.application = application; }}
                />
            </section>
        );
    }
}
