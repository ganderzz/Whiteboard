import * as React from "react";

export function Sidebar({ children, style = {}, ...rest }: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
    return (
        <div
            style={{
                padding: 10,
                background: "#333",
                color: "#FFF",
                ...style
            }}
            {...rest}
        >
            {children}
        </div>
    );
}