"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const express_1 = __importDefault(require("express"));
const first_1 = require("./resolvers/first");
const constants_1 = require("./constants");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const typeorm_1 = require("typeorm");
const ormconfig_1 = require("./ormconfig");
const redis_1 = __importDefault(require("redis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const oneDay = 1000 * 60 * 60 * 24;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield typeorm_1.createConnection(ormconfig_1.ORMconfig[0]);
    const app = express_1.default();
    const RedisStore = connect_redis_1.default(express_session_1.default);
    const redisClient = redis_1.default.createClient();
    app.use(require("cors")({
        origin: true,
        credentials: true,
    }));
    app.use(express_session_1.default({
        name: "nerf",
        store: new RedisStore({
            client: redisClient,
            disableTTL: true,
            disableTouch: true,
        }),
        cookie: {
            maxAge: oneDay,
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        },
        saveUninitialized: false,
        secret: constants_1.secret,
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [first_1.FirstResolverEver, post_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(constants_1.PORT, () => {
        console.log(`listening on ${constants_1.PORT}`);
    });
});
main().catch().then(console.log);
//# sourceMappingURL=index.js.map