"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var signalR = require("@microsoft/signalr");
var PIXI = require("pixi.js");
var Whiteboard_1 = require("../components/Whiteboard");
var react_color_1 = require("react-color");
var WhiteboardPage = /** @class */ (function (_super) {
    __extends(WhiteboardPage, _super);
    function WhiteboardPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            users: [],
            selectedColor: "#03a9f4"
        };
        _this.connection = null;
        _this.application = null;
        /**
         * Update the user's current color.
         */
        _this.handleColorChange = function (color) {
            _this.setState({ selectedColor: color.hex });
        };
        /**
         * Send the current user's draw data to other users.
         */
        _this.handlePointerMove = function (payload) {
            if (!payload) {
                return;
            }
            if (_this.connection) {
                _this.connection.invoke("Draw", __assign(__assign({}, payload), { ColorHex: _this.state.selectedColor }));
            }
            _this.handleDraw(payload);
        };
        /**
         * Draw to the whiteboard canvas.
         */
        _this.handleDraw = function (payload) {
            if (!_this.application || !payload) {
                return;
            }
            var PreviousCoords = payload.PreviousCoords, Coords = payload.Coords, ColorHex = payload.ColorHex;
            var line = new PIXI.Graphics();
            line.lineStyle(3, PIXI.utils.string2hex(ColorHex || _this.state.selectedColor), 1);
            line.moveTo(PreviousCoords.x, PreviousCoords.y);
            line.lineTo(Coords.x, Coords.y);
            line.closePath();
            line.endFill();
            // checking null above, but typescript complains
            _this.application.stage.addChild(line);
        };
        return _this;
    }
    WhiteboardPage.prototype.componentDidMount = function () {
        var _this = this;
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/whiteboard")
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();
        this.connection.start();
        this.connection.on("UsersUpdated", function (users) {
            if (users === void 0) { users = []; }
            _this.setState({ users: users });
        });
        this.connection.on("Draw", function (_a) {
            var previousCoords = _a.previousCoords, coords = _a.coords, colorHex = _a.colorHex;
            _this.handleDraw({
                PreviousCoords: previousCoords,
                Coords: coords,
                ColorHex: colorHex,
            });
        });
    };
    WhiteboardPage.prototype.render = function () {
        var _this = this;
        var _a = this.state, users = _a.users, selectedColor = _a.selectedColor;
        return (React.createElement("section", { style: { display: "grid", height: "100%", gridTemplateColumns: "minmax(280px, 20%) 80%" } },
            React.createElement("div", { style: {
                    padding: 10,
                    background: "#333",
                    color: "#FFF"
                } },
                React.createElement("strong", null, "Users"),
                users ? (React.createElement("ul", { style: { listStyleType: "none", margin: "15px 0 10px 0", borderBottom: "1px solid #777", padding: "0 0 10px 0" } }, users.map(function (p) { return (React.createElement("li", { key: p.Key },
                    React.createElement("div", { style: {
                            display: "inline-block",
                            width: 15,
                            height: 15,
                            background: p.Value,
                            marginRight: 5
                        } }),
                    p.Key)); }))) : React.createElement("em", null, "None"),
                React.createElement(react_color_1.CirclePicker, { color: selectedColor, onChange: this.handleColorChange })),
            React.createElement(Whiteboard_1.Whiteboard, { onPointerMove: this.handlePointerMove, onContextLoad: function (application) { _this.application = application; } })));
    };
    return WhiteboardPage;
}(React.Component));
exports.WhiteboardPage = WhiteboardPage;
//# sourceMappingURL=WhiteboardPage.js.map