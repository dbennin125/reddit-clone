import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import express from "express";
import { FirstResolverEver } from "./resolvers/first";

import {
  PORT,
  __dbName__,
  __db_type__,
  __password__,
  __prod__,
  __user__,
} from "./constants";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";

const app = express();

const main = async () => {
  const connection = await createConnection({
    type: __db_type__,
    database: __dbName__,
    username: __user__,
    password: __password__,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  });

  // const orm = await MikroORM.init(mikroConfig);
  // await orm.getMigrator().up();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [FirstResolverEver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  // app.get('/', (_, res) => {
  //     res.send('are you listening?')
  // })

  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
};

main().catch().then(console.log);
