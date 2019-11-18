"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_color_1 = require("react-color");
function ColorPicker(_a) {
    var color = _a.color, onChange = _a.onChange;
    var _b = React.useState(false), isShown = _b[0], setIsShown = _b[1];
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { onClick: function () { return setIsShown(!isShown); }, style: {
                display: "inline-block",
                cursor: "pointer",
                width: 28,
                height: 28,
                background: !color ? "#FFF" : color.toString(),
                borderRadius: "50%"
            } }),
        isShown && (React.createElement("div", { style: {
                position: "relative",
                top: 10,
                padding: 10,
                background: "#444",
                boxShadow: "1px 2px 10px rgba(0, 0, 0, 0.2)"
            } },
            React.createElement(react_color_1.CirclePicker, { color: color, onChange: onChange, onChangeComplete: function () { return setIsShown(false); } })))));
}
exports.ColorPicker = ColorPicker;
//# sourceMappingURL=ColorPicker.js.map