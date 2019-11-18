import * as React from "react";

interface IProps {
    users: { Key: string, Value: string }[];
}

export function UsersList({ users }: IProps) {
    console.log(users)
    if (!users || users.length <= 0) {
        return (
            <em style={{ display: "block", margin: "15px 0 10px 0", borderBottom: "1px solid #777", padding: "0 0 10px 0" }}>
                None
            </em>
        );
    }

    return (
        <ul style={{ listStyleType: "none", margin: "0 0 10px 0", borderBottom: "1px solid #777", padding: "0 0 10px 0" }}>
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
    );
}