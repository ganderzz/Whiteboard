import * as React from "react";

export function SidebarHeader({ children, style = {}, ...rest }: React.PropsWithChildren<{ style?: React.CSSProperties  }>) {
    return (
        <strong style={{ display: "block", background: "#222", padding: 5, marginBottom: 5, ...style }} {...rest}>{children}</strong>
    );
}