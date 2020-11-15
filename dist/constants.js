"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__dbName__ = exports.__pg__user__ = exports.__pg__password__ = exports.__prod__ = void 0;
require('dotenv').config();
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.__pg__password__ = process.env.PG_PASSWORD;
exports.__pg__user__ = process.env.PG_USER;
exports.__dbName__ = process.env.DB_NAME;
//# sourceMappingURL=constants.js.map