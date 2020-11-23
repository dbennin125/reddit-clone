"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORMconfig = void 0;
const constants_1 = require("./constants");
const User_1 = require("./entities/User");
const Post_1 = require("./entities/Post");
exports.ORMconfig = [
    {
        type: constants_1.__db_type__,
        database: constants_1.__dbName__,
        username: constants_1.__user__,
        password: constants_1.__password__,
        logging: true,
        synchronize: true,
        entities: [User_1.User, Post_1.Post],
    },
    {
        type: constants_1.__db_type__,
        database: constants_1.__testDB__,
        username: constants_1.__user__,
        password: constants_1.__password__,
        logging: true,
        synchronize: true,
        entities: [User_1.User, Post_1.Post],
    },
];
//# sourceMappingURL=ormconfig.js.map