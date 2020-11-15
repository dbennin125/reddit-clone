"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
const postgresql_1 = require("@mikro-orm/postgresql");
const User_1 = require("./entities/User");
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post_1.Post, User_1.User],
    dbName: constants_1.__dbName__,
    user: constants_1.__pg__user__,
    password: constants_1.__pg__password__,
    type: "postgresql",
    driver: postgresql_1.PostgreSqlDriver,
    debug: !constants_1.__prod__,
};
//# sourceMappingURL=mikro-orm.config.js.map