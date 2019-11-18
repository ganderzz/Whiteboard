"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function UsersList(_a) {
    var users = _a.users;
    console.log(users);
    if (!users || users.length <= 0) {
        return (React.createElement("em", { style: { display: "block", margin: "15px 0 10px 0", borderBottom: "1px solid #777", padding: "0 0 10px 0" } }, "None"));
    }
    return (React.createElement("ul", { style: { listStyleType: "none", margin: "0 0 10px 0", borderBottom: "1px solid #777", padding: "0 0 10px 0" } }, users.map(function (p) { return (React.createElement("li", { key: p.Key },
        React.createElement("div", { style: {
                display: "inline-block",
                width: 15,
                height: 15,
                background: p.Value,
                marginRight: 5
            } }),
        p.Key)); })));
}
exports.UsersList = UsersList;
//# sourceMappingURL=UsersList.js.map