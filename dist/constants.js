"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secret = exports.PORT = exports.salt_rounds = exports.__db_type__ = exports.__testDB__ = exports.__dbName__ = exports.__user__ = exports.__password__ = exports.__prod__ = void 0;
require("dotenv").config();
exports.__prod__ = process.env.NODE_ENV === "production";
exports.__password__ = process.env.PG_PASSWORD;
exports.__user__ = process.env.PG_USER;
exports.__dbName__ = process.env.NEW_DB_NAME;
exports.__testDB__ = process.env.NEW_JEST_DB;
exports.__db_type__ = process.env.NEW_DB_TYPE;
exports.salt_rounds = Number(process.env.SALT_ROUNDS) || 15;
exports.PORT = process.env.PORT || 5040;
exports.secret = String(process.env.APP_SECRET);
//# sourceMappingURL=constants.js.map