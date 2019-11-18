import * as React from "react";
import { CirclePicker, Color, ColorResult } from "react-color";

interface IProps {
    color: Color;
    onChange: (color: ColorResult) => void;
}

export function ColorPicker({ color, onChange }: IProps) {
    const [isShown, setIsShown] = React.useState(false);

    return (
        <>
            <div
                onClick={() => setIsShown(!isShown)}
                style={{
                    display: "inline-block",
                    cursor: "pointer",
                    width: 28,
                    height: 28,
                    background: !color ? "#FFF" : color.toString(),
                    borderRadius: "50%"
                }} />
            {isShown && (
                <div style={{
                    position: "relative",
                    top: 10,
                    padding: 10,
                    background: "#444",
                    boxShadow: "1px 2px 10px rgba(0, 0, 0, 0.2)"
                }}>
                    <CirclePicker color={color} onChange={onChange} onChangeComplete={() => setIsShown(false)} />
                </div>
                )
            }
        </>
    );
}