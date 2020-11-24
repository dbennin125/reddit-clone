import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import express from "express";
import { FirstResolverEver } from "./resolvers/first";
import { PORT, secret } from "./constants";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createConnection } from "typeorm";
import { ORMconfig } from "./ormconfig";
// import { User } from "./entities/User";
// import { Post } from "./entities/Post";

import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

const oneDay = 1000 * 60 * 60 * 24;

const main = async () => {
  const connection = await createConnection(ORMconfig[0]);

  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    require("cors")({
      origin: true,
      credentials: true,
    })
  );

  app.use(
    session({
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
      secret: secret,
      resave: false,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [FirstResolverEver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  // app.get('/', (_, res) => {
  //     res.send('are you listening?')
  // })

  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
};

main().catch().then(console.log);
